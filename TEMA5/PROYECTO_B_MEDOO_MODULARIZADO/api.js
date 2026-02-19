// api.js - Solo habla con el servidor

export async function crearUsuario(datos) {
  const respuesta = await fetch("servidor.php", {
    method: "POST",
    body: datos,
  });
  return await respuesta.json();
}

export async function obtenerUsuarios() {
  const respuesta = await fetch("servidor.php", {
    method: "GET"
  });
  return await respuesta.json();
}

export async function borrarUsuario(id) {
  const respuesta = await fetch(`servidor.php?id=${id}`, {
    method: "DELETE",
  });
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