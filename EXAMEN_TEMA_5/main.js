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

// Estado: productos en memoria
let productosLocales = [];

// Crear producto
async function crearProducto(event) {
  event.preventDefault();

  btnEnviar.disabled = true;
  btnEnviar.innerText = "Enviando...";
  mensajeDiv.innerText = "";

  const datos = new FormData(formulario);

  // Validar código (según SQL: CHAR(9))
  const codigo = datos.get('codigo');
  if (codigo.length !== 9) {
    mensajeDiv.style.color = "red";
    mensajeDiv.innerText = "Error: El código debe tener exactamente 9 caracteres";
    btnEnviar.disabled = false;
    btnEnviar.innerText = "Registrar";
    return;
  }

  try {
    const data = await api.crearProducto(datos);

    if (data.status === "ok") {
      mensajeDiv.style.color = "green";
      mensajeDiv.innerText = `Éxito: ${data.mensaje}`;
      formulario.reset();
      listaProductos();
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

// Listar productos
async function listaProductos() {
  try {
    const productos = await api.obtenerProductos();
    
    productosLocales = productos;

    // Pintar tabla y selects
    components.pintarTabla(productos, tablaDatos);
    components.pintarSelects(productos, selectID, modifyID);

  } catch (error) {
    console.error("Hubo un problema:", error);
  }
}

// Borrar producto
async function borrarProducto(event) {
  event.preventDefault();

  const id = selectID.value;

  try {
    const resultado = await api.borrarProducto(id);

    if (resultado.status === "ok") {
      alert(resultado.mensaje);
      listaProductos(); // Cambiado de reload a recarga de lista para mejor UX
    }
  } catch (error) {
    console.error("Error al borrar:", error);
  }
}

// Cargar datos en formulario de modificación
function cargarDatosEnFormulario() {
  const idSeleccionado = modifyID.value;
  const producto = productosLocales.find(p => p.id == idSeleccionado);

  if (producto) {
    formModificar.style.display = "flex";
    formModificar.querySelector('[name="codigo"]').value = producto.codigo;
    formModificar.querySelector('[name="nombre"]').value = producto.nombre;
    formModificar.querySelector('[name="talla"]').value = producto.talla;
    formModificar.querySelector('[name="precio"]').value = producto.precio;
    formModificar.querySelector('[name="email_creador"]').value = producto.email_creador;
  } else {
    formModificar.style.display = "none";
  }
}

// Modificar producto
async function modificarProducto(event) {
  event.preventDefault();

  const id = modifyID.value;
  const formData = new FormData(formModificar);

  try {
    const resultado = await api.modificarProducto(id, formData);

    if (resultado.status === "ok") {
      alert(resultado.mensaje);
      formModificar.style.display = "none";
      listaProductos();
    }
  } catch (error) {
    console.error("Error al modificar:", error);
  }
}

// Eventos
formulario.addEventListener("submit", crearProducto);
document.addEventListener('DOMContentLoaded', listaProductos);
btnEliminar.addEventListener('click', borrarProducto);
modifyID.addEventListener('change', cargarDatosEnFormulario);
formModificar.addEventListener("submit", modificarProducto);