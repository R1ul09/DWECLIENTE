const formulario = document.getElementById("miFormulario");
const mensajeDiv = document.getElementById("mensajeRespuesta");
const btnEnviar = document.getElementById("btnEnviar");
const tablaDatos = document.getElementById("datos");
const btnEliminar = document.getElementById("eliminar");
const formModificar = document.getElementById("formularioModificar");

// Array local para almacenar usuarios recibidos del servidor
let usuariosLocales = [];

// Funcion para crear un usuario nuevo en el servidor
async function crearUsuario(event) {
  // Evitar que el formulario recargue la pagina
  event.preventDefault();

  // Feedback: bloquear boton mientras dura la peticion
  btnEnviar.disabled = true;
  btnEnviar.innerText = "Enviando...";
  mensajeDiv.innerText = "";

  // Empaquetar los datos del formulario automaticamente
  const datos = new FormData(formulario);

  const movil = datos.get('movil');
  const patronMovil = /^6[0-9]{8}$/;  // 9 dígitos exactos
  
  if (!patronMovil.test(movil)) {
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: El móvil debe tener 9 dígitos y empezar por 6";
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
    return;  // Detener el envío
  }

  const edad = datos.get('edad');
  if (edad && (edad < 18 || edad > 100)) {
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: La edad debe estar entre 18 y 100 años";
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
    return;
  }

  try {
    // Enviar peticion POST al servidor con los datos
    const respuesta = await fetch("servidor.php", {
      method: "POST",
      body: datos,
    });

    // Leer la respuesta como JSON
    const data = await respuesta.json();

    // Comprobar que la respuesta HTTP sea correcta
    if (!respuesta.ok) throw new Error(data.error);

    // Mostrar resultado segun lo que devuelva el servidor
    if (data.status === "ok") {
      mensajeDiv.style.color = "green";
      mensajeDiv.innerText = `Exito: ${data.mensaje}`;
      formulario.reset();
      
      // actualizamos la lista mostrada
      listaUsuarios();
    } else {
      throw new Error(data.error || "Error desconocido");
    }
  } catch (error) {
    // Mostrar error en consola y en la pagina si algo falla
    console.error("Hubo un problema:", error);
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: " + error.message;
  } finally {
      btnEnviar.disabled = false;
      btnEnviar.innerText = "Registrar";
  }
}

// Solicitar al servidor la lista de usuarios y pintarla en la tabla
async function listaUsuarios() {
  try {
    // Peticion GET para obtener todos los usuarios
    const respuestaGet = await fetch("servidor.php", {
      method: "GET"
    })

    // Validar respuesta HTTP
    if (!respuestaGet.ok) throw new Error("Error HTTP: " + respuestaGet.status);
    // Leer JSON con los usuarios
    const usuarios = await respuestaGet.json();

    // Guardar copia local para operaciones posteriores
    usuariosLocales = usuarios;

    // Limpiar la tabla y los selects antes de rellenar
    tablaDatos.innerHTML = "";
    const selectID = document.getElementById("selectID");
    const modifyID = document.getElementById("modifyID");

    // Recorrer usuarios y crear filas y opciones en los selects
    for (let usuario of usuarios) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>${usuario.movil}</td>
        <td>${usuario.edad}</td>
        <td>${usuario.idioma}</td>
        <td>${usuario.fecha_registro}</td>
      `;
      tablaDatos.appendChild(fila);

      // Añadir opciones a los selects para borrar o modificar
      const opcion = document.createElement("option");
      opcion.value = usuario.id;
      opcion.textContent = `${usuario.id}`;
      selectID.appendChild(opcion.cloneNode(true));
      modifyID.appendChild(opcion);
    }

  } catch (error) {
    // Mostrar error en consola si falla la peticion
    console.error("Hubo un problema:", error);
  }
}

// Borrar un usuario seleccionado enviando una peticion DELETE
async function borrarUsuario(event) {
  event.preventDefault();

  // cojemos el id seleccionado para borrar del select correspondiente
  const id = document.getElementById("selectID").value;

  try {
    // Enviar DELETE al servidor con el id como query param
    const respuestaDelete = await fetch(`servidor.php?id=${id}`, {
      method: "DELETE",
    })

    const resultado = await respuestaDelete.json();

    // Si todo va bien, avisar y recargar para ver cambios
    if (resultado.status === "ok") {
        alert(resultado.mensaje);
        location.reload();
    }
  } catch (error) {
    console.error("Error al borrar:", error);
  }
}

// funcion para cargar los datos del usuario seleccionado en el formulario de modificacion
function cargarDatosEnFormulario() {
    const idSeleccionado = document.getElementById("modifyID").value;
    
    // Buscamos al usuario en nuestro array local
    const usuario = usuariosLocales.find(u => u.id == idSeleccionado);
  // Si existe el usuario, rellenar el formulario de modificacion
  if (usuario) {
    formModificar.style.display = "flex";
    formModificar.querySelector('[name="nombre"]').value = usuario.nombre;
    formModificar.querySelector('[name="correo"]').value = usuario.correo;
    formModificar.querySelector('[name="movil"]').value = usuario.movil;
    formModificar.querySelector('[name="edad"]').value = usuario.edad;
    formModificar.querySelector('[name="idioma"]').value = usuario.idioma;
  } else {
    // Ocultar el formulario si no hay usuario seleccionado
    formModificar.style.display = "none";
  }
}

// Funcion para enviar cambios del usuario al servidor usando PUT
// Se convierte FormData a URLSearchParams para compatibilidad con PHP
async function modificarUsuario(event) {
  event.preventDefault();
  const id = document.getElementById("modifyID").value;

  // Cogemos los datos actuales del formulario
  const formData = new FormData(formModificar);

  // Convertimos FormData a un objeto simple o URLSearchParams
  // porque PHP maneja mejor los datos PUT si vienen como "x-www-form-urlencoded"
  const datosBusqueda = new URLSearchParams(formData);

  try {
    // Enviar PUT con los datos codificados
    const respuestaPut = await fetch(`servidor.php?id=${id}`, {
      method: "PUT",
      body: datosBusqueda,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    const resultado = await respuestaPut.json();

    // Si el servidor confirma, ocultar form y actualizar lista
    if (resultado.status === "ok") {
        alert(resultado.mensaje);
        formModificar.style.display = "none";
        listaUsuarios();
    }
  } catch (error) {
    console.error("Error al modificar:", error);
  }
};

formulario.addEventListener("submit", crearUsuario);
document.addEventListener('DOMContentLoaded', listaUsuarios);
btnEliminar.addEventListener('click', borrarUsuario);
document.getElementById("modifyID").addEventListener('change', cargarDatosEnFormulario);
formModificar.addEventListener("submit", modificarUsuario);