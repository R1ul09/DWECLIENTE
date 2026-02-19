// main.js - El cerebro de la app

import * as api from './api.js';
import * as components from './components.js';

// Elementos del DOM
const formulario = document.getElementById("miFormulario");
const mensajeDiv = document.getElementById("mensajeRespuesta");
const btnEnviar = document.getElementById("btnEnviar");
const tablaDatos = document.getElementById("datos");
const btnEliminar = document.getElementById("eliminar");
const formModificar = document.getElementById("formularioModificar");
const selectID = document.getElementById("selectID");
const modifyID = document.getElementById("modifyID");

// Estado: usuarios en memoria
let usuariosLocales = [];

// Crear usuario
async function crearUsuario(event) {
  event.preventDefault();

  btnEnviar.disabled = true;
  btnEnviar.innerText = "Enviando...";
  mensajeDiv.innerText = "";

  const datos = new FormData(formulario);

  // Validar móvil
  const movil = datos.get('movil');
  const patronMovil = /^6[0-9]{8}$/;
  
  if (!patronMovil.test(movil)) {
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: El móvil debe tener 9 dígitos y empezar por 6";
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
    return;
  }

  // Validar edad
  const edad = datos.get('edad');
  if (edad && (edad < 18 || edad > 100)) {
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: La edad debe estar entre 18 y 100 años";
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
    return;
  }

  try {
    const data = await api.crearUsuario(datos);

    if (!data.ok) throw new Error(data.error);

    if (data.status === "ok") {
      mensajeDiv.style.color = "green";
      mensajeDiv.innerText = `Exito: ${data.mensaje}`;
      formulario.reset();
      listaUsuarios();
    } else {
      throw new Error(data.error || "Error desconocido");
    }
  } catch (error) {
    console.error("Hubo un problema:", error);
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: " + error.message;
  } finally {
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
  }
}

// Listar usuarios
async function listaUsuarios() {
  try {
    const usuarios = await api.obtenerUsuarios();
    
    usuariosLocales = usuarios;

    // Pintar tabla y selects
    components.pintarTabla(usuarios, tablaDatos);
    components.pintarSelects(usuarios, selectID, modifyID);

  } catch (error) {
    console.error("Hubo un problema:", error);
  }
}

// Borrar usuario
async function borrarUsuario(event) {
  event.preventDefault();

  const id = selectID.value;

  try {
    const resultado = await api.borrarUsuario(id);

    if (resultado.status === "ok") {
      alert(resultado.mensaje);
      location.reload();
    }
  } catch (error) {
    console.error("Error al borrar:", error);
  }
}

// Cargar datos en formulario de modificación
function cargarDatosEnFormulario() {
  const idSeleccionado = modifyID.value;
  const usuario = usuariosLocales.find(u => u.id == idSeleccionado);

  if (usuario) {
    formModificar.style.display = "flex";
    formModificar.querySelector('[name="nombre"]').value = usuario.nombre;
    formModificar.querySelector('[name="correo"]').value = usuario.correo;
    formModificar.querySelector('[name="movil"]').value = usuario.movil;
    formModificar.querySelector('[name="edad"]').value = usuario.edad;
    formModificar.querySelector('[name="idioma"]').value = usuario.idioma;
  } else {
    formModificar.style.display = "none";
  }
}

// Modificar usuario
async function modificarUsuario(event) {
  event.preventDefault();

  const id = modifyID.value;
  const formData = new FormData(formModificar);

  try {
    const resultado = await api.modificarUsuario(id, formData);

    if (resultado.status === "ok") {
      alert(resultado.mensaje);
      formModificar.style.display = "none";
      listaUsuarios();
    }
  } catch (error) {
    console.error("Error al modificar:", error);
  }
}

// Eventos
formulario.addEventListener("submit", crearUsuario);
document.addEventListener('DOMContentLoaded', listaUsuarios);
btnEliminar.addEventListener('click', borrarUsuario);
modifyID.addEventListener('change', cargarDatosEnFormulario);
formModificar.addEventListener("submit", modificarUsuario);