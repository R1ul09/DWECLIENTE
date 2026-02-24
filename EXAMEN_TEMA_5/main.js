import * as api from './api.js';
import * as components from './components.js';

// recojemos todos los elementos
const tabla = document.getElementById("cuerpoTabla");
const formNuevo = document.getElementById("miFormulario");
const formEditar = document.getElementById("miFormularioEditar");
const divErrorNuevo = document.getElementById("mensajeError");
const divErrorEditar = document.getElementById("mensajeErrorEditar");
const selectTalla = document.getElementById("filtroTalla");

// creamos un array para guardar los productos
let misProductos = [];

// tallas permitidas
const tallasPermitidas = ["XS", "S", "M", "L", "XL", "XXL"];

// creamos una funcion para cargar los dato, y va a ssrvir para cada vez que hagamo una acciÃ³n
async function cargar() {
    try {
        const datos = await api.obtenerProductos();
        misProductos = datos;
        pintar();
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

// esta es la funcion para pintar los datos
function pintar() {
    tabla.innerHTML = "";
    // esto es para el filtrado
    const tallaSeleccionada = selectTalla.value;

    // Usamos .filter() para filtrar los productos en el frontend
    const productosFiltrados = misProductos.filter(producto => {
        // limpiamos espacios para que el filtro sea preciso
        const tallaProducto = producto.talla ? producto.talla.trim() : "";
        return tallaSeleccionada === "Todas" || tallaProducto === tallaSeleccionada;
    });

    // Ahora iteramos sobre el array filtrado para pintar
    productosFiltrados.forEach(producto => {
        // usamos la funcion del componente para crear la fila HTML
        tabla.innerHTML += components.crearFilaHTML(producto);
    });
}

// hacemos un window para que aparezca el modal de si queremos borrar el producto
window.eliminarFila = async (id) => {
    if (confirm("¿Seguro que quieres borrar este producto?")) {
        try {
            await api.borrarProducto(id);
            alert("Eliminado con exito");
            cargar();
        } catch (error) {
            alert("Error al borrar");
        }
    }
};

// lo mismo para el mismo para ele modificar
window.modificarFila = (id) => {
    // Buscamos el producto en el array local
    const producto = misProductos.find(producto => producto.id == id);
    
    if (producto) {
        // Cerramos el de nuevo y abrimos el de editar
        formNuevo.style.display = "none";
        formEditar.style.display = "block";

        // Rellenamos los campos con los id que especificamos de editar
        document.getElementById("edit-id").value = producto.id;
        document.getElementById("edit-codigo").value = producto.codigo;
        document.getElementById("edit-nombre").value = producto.nombre;
        document.getElementById("edit-talla").value = producto.talla;
        document.getElementById("edit-precio").value = producto.precio;
        document.getElementById("edit-email").value = producto.email_creador;
    }
};

// esto es para el de crear, cuando le demos al boton de embiar
formNuevo.addEventListener("submit", async (event) => {
    // hacemos para que no se reinicie la pagina
    event.preventDefault();
    divErrorNuevo.innerText = "";

    // vamos a añadir los regex
    const codigo = document.getElementById("codigo").value;
    const precio = document.getElementById("precio").value;

    const regexCodigo = /^[a-zA-Z0-9]{9}$/;
    const regexPrecio = /^\d+(\.\d{2})?$/;

    if (!regexCodigo.test(codigo)) {
      divErrorNuevo.innerText = "El código debe tener exactamente 9 caracteres";
      return;
    }

    if (!regexPrecio.test(precio)) {
      divErrorNuevo.innerText = "El precio debe ser un número decimal positivo (ej: 15.50).";
      return;
    }

    const talla = document.getElementById("talla").value;
    if (!tallasPermitidas.includes(talla.toUpperCase())) {
      divErrorNuevo.innerText = "La talla debe ser una de las siguientes: XS, S, M, L, XL, XXL";
      return;
    }

    const datosEnvio = new FormData();
    datosEnvio.append("codigo", document.getElementById("codigo").value);
    datosEnvio.append("nombre", document.getElementById("nombre").value);
    datosEnvio.append("talla", document.getElementById("talla").value);
    datosEnvio.append("precio", document.getElementById("precio").value);
    datosEnvio.append("email_creador", document.getElementById("email").value);

    try {
        await api.crearProducto(datosEnvio);
        alert("¡Producto creado!");
        formNuevo.reset();
        formNuevo.style.display = "none";
        cargar();
    } catch (err) {
        divErrorNuevo.innerText = "Error al guardar en el servidor.";
    }
});

// lo mismo para modificar
formEditar.addEventListener("submit", async (event) => {
    // lo mismo para que no se actualize solo
    event.preventDefault();
    divErrorEditar.innerText = "";

    // vamos a añadir los regex
    const codigo = document.getElementById("edit-codigo").value;
    const precio = document.getElementById("edit-precio").value;

    const regexCodigo = /^[a-zA-Z0-9]{9}$/;
    const regexPrecio = /^\d+(\.\d{2})?$/;

    if (!regexCodigo.test(codigo)) {
      divErrorEditar.innerText = "El código debe tener exactamente 9 caracteres";
      return;
    }

    if (!regexPrecio.test(precio)) {
      divErrorEditar.innerText = "El precio debe ser un número decimal positivo (ej: 15.50).";
      return;
    }

    const talla = document.getElementById("edit-talla").value;
    if (!tallasPermitidas.includes(talla.toUpperCase())) {
      divErrorEditar.innerText = "La talla debe ser una de las siguientes: XS, S, M, L, XL, XXL";
      return;
    }

    // cojemos el id
    const id = document.getElementById("edit-id").value;
    const formData = new FormData();
    
    // cojemos los valores para el modificar
    formData.append("nombre", document.getElementById("edit-nombre").value);
    formData.append("talla", document.getElementById("edit-talla").value);
    formData.append("precio", document.getElementById("edit-precio").value);
    formData.append("codigo", document.getElementById("edit-codigo").value);
    formData.append("email_creador", document.getElementById("edit-email").value);

    try {
        await api.modificarUsuario(id, formData);
        alert("¡Producto actualizado!");
        formEditar.reset();
        formEditar.style.display = "none";
        cargar();
    } catch (err) {
        divErrorEditar.innerText = "Error al actualizar.";
    }
});

// y aqui van a ir los eventod del panel de controlo
document.getElementById("btnCargar").onclick = cargar;

document.getElementById("btnNuevo").onclick = () => {
    // Cerramos el de editar si esta abierto
    formEditar.style.display = "none";
    formNuevo.style.display = (formNuevo.style.display === "none") ? "block" : "none";
};

document.getElementById("btnLimpiar").onclick = () => {
    misProductos = [];
    tabla.innerHTML = "";
};

// Cambio del filtro
selectTalla.onchange = pintar;