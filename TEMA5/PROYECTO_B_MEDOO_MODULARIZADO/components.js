// components.js - Solo pinta HTML

// Pintar la tabla con usuarios
export function pintarTabla(usuarios, tablaDatos) {
  tablaDatos.innerHTML = "";
  
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
  }
}

// Pintar los selects de eliminar y modificar
export function pintarSelects(usuarios, selectID, modifyID) {
  selectID.innerHTML = "";
  modifyID.innerHTML = "";

  for (let usuario of usuarios) {
    const opcion = document.createElement("option");
    opcion.value = usuario.id;
    opcion.textContent = `${usuario.id}`;
    selectID.appendChild(opcion.cloneNode(true));
    modifyID.appendChild(opcion);
  }
}