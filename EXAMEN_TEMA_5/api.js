export async function crearProducto(datos) {
  const respuesta = await fetch("servidor.php", {
    method: "POST",
    body: datos,
  });
  if (!respuesta.ok) {
    throw new Error("Error en el servidor, comprueba a ver que es lo que pasa");
  }
  return await respuesta.json();
}

export async function obtenerProductos() {
  const respuesta = await fetch("servidor.php", {
    method: "GET"
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener datos");
  }
  return await respuesta.json();
}

export async function borrarProducto(id) {
  const respuesta = await fetch(`servidor.php?id=${id}`, {
    method: "DELETE",
  });
  if (!respuesta.ok) throw new Error("Error al borrar");
  return await respuesta.json();
}

export async function modificarUsuario(id, formData) {
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