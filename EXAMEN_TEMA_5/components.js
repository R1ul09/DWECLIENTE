// components.js - Solo pinta HTML

// Pintar la tabla con productos
export function pintarTabla(productos, tablaDatos) {
  tablaDatos.innerHTML = "";
  
  for (let producto of productos) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>${producto.talla}</td>
      <td>${producto.precio}</td>
      <td>${producto.email_creador}</td>
    `;
    tablaDatos.appendChild(fila);
  }
}

// Pintar los selects de eliminar y modificar
export function pintarSelects(productos, selectID, modifyID) {
  selectID.innerHTML = "";
  modifyID.innerHTML = "";

  for (let producto of productos) {
    const opcion = document.createElement("option");
    opcion.value = producto.id;
    opcion.textContent = `${producto.id} - ${producto.nombre}`;
    selectID.appendChild(opcion.cloneNode(true));
    modifyID.appendChild(opcion);
  }
}