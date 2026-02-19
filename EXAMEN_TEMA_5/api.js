// api.js - Solo habla con el servidor

export async function crearProducto(datos) {
  const respuesta = await fetch("servidor.php", {
    method: "POST",
    body: datos,
  });
  return await respuesta.json();
}

export async function obtenerProductos() {
  const respuesta = await fetch("servidor.php", {
    method: "GET"
  });
  return await respuesta.json();
}

export async function borrarProducto(id) {
  const respuesta = await fetch(`servidor.php?id=${id}`, {
    method: "DELETE",
  });
  return await respuesta.json();
}

export async function modificarProducto(id, formData) {
  const datosBusqueda = new URLSearchParams(formData);
  
  const respuesta = await fetch(`servidor.php?id=${id}`, {
    method: "PUT",
    body: datosBusqueda,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return await respuesta.json();
}