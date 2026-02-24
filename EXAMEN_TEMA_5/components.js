// para crear las filas
export function crearFilaHTML(producto) {
  return `
    <tr>
      <td>${producto.codigo}</td>
      <td>${producto.nombre}</td>
      <td>${producto.talla}</td>
      <td>${producto.precio}€</td>
      <td>${producto.email_creador}</td>
      <td>
        <button onclick="eliminarFila(${producto.id})">Borrar</button>
        <button onclick="modificarFila(${producto.id})">Editar</button>
      </td>
    </tr>
  `;
}

// Pintar la tabla
export function pintarTabla(productos, contenedor) {
  contenedor.innerHTML = "";
  productos.forEach(p => {
    contenedor.innerHTML += crearFila(p);
  });
}