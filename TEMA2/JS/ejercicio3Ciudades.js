/*
        3.Almacenar en un Map los nombres de ciudades como clave y la cantidad de habitantes como
        valores. Mostrar en una lista HTML que se debe crear en forma dinámica inmediatamente luego que
        se carga la página.
        Se debe implementar estas opciones
        1. El usuario puede ver todas las ciudades y sus habitantes
        */
        const ciudades = new Map([
            ["Madrid", 3500000],
            ["Granada", 232000],
            ["Barcelona", 1700000],
            ["Cadiz", 110000],
            ["Sevilla", 687000],
            ["Malaga", 592000]
        ]);

        // Estas variables sirven para guardar los nombres de las ciudades más grande y más pequeña
        let ciudadResaltadaMasGrande = "";
        let ciudadResaltadaMasPequena = "";

        function mostrarCiudades() {
             // Inicializamos la tabla con los encabezados
            let tablaHTML = "<table><thead><tr><th>Ciudad</th><th>Habitantes</th></tr></thead><tbody>";

            // Recorremos todas las ciudades del Map
            ciudades.forEach((habitantes, ciudad) => {
                // Por cada elemento, metemos una fila (<tr>) con dos celdas (<td>)
                // Primera celda: la clave (ciudad)
                // Segunda celda: el valor (habitantes)
                
                // Si la ciudad es la más grande, la pintamos en rojo
                if(ciudad == ciudadResaltadaMasGrande) {
                    let contenido = '<span style="color:red;">' + ciudad + '</span>';
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + contenido + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                } 
                // Si la ciudad es la más pequeña, la pintamos en verde
                else if(ciudad == ciudadResaltadaMasPequena)  {
                    let contenido = '<span style="color:green;">' + ciudad + '</span>';
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + contenido + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                } 
                // Si no es ninguna de las dos, la mostramos normal
                else {
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + ciudad + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                }
            });

            // Cerramos la tabla y la mostramos en el HTML
            tablaHTML += "</tbody></table>";
            document.getElementById("tablaCiudades").innerHTML = tablaHTML;
        }

        /*
        2. El usuario puede saber cuantas ciudades existen
        */
        function totalCiudades() {
            // Obtenemos cuántas ciudades hay en el Map con .size
            let totalCiudades = ciudades.size;
            // Mostramos el total en el HTML
            document.getElementById("totalCiudades").innerHTML = "El total de ciudades que existen son: " + totalCiudades;
        }
        
        // Lista HTML
        function listaCiudades() {
            // Creamos un desplegable con las ciudades disponibles
            let listaHTML = '<select id="ciudadABorrar">';
            ciudades.forEach((habitantes, ciudad) => {
                listaHTML += '<option value="' + ciudad + '">' + ciudad + '</option>';
            });
            listaHTML += "</select>";
            // Lo mostramos en el HTML junto a un texto
            document.getElementById("borrarCiudad").innerHTML = "Ciudad que quieras eliminar: " + listaHTML;
        }
        
        /*
        3. Borrar ciudad
        */
        function borrarCiudad() {
            // Capturamos el botón de borrar
            let borrar = document.getElementById("botonBorrar");
            // Esperamos al clic del usuario
            borrar.addEventListener('click', () => {
                // Obtenemos la ciudad seleccionada en el select
                let selectElemento = document.getElementById("ciudadABorrar");
                let ciudadSeleccionada = selectElemento.value;
                // Borramos esa ciudad del Map
                ciudades.delete(ciudadSeleccionada);
                // Limpiamos las ciudades resaltadas
                ciudadResaltadaMasGrande = "";
                ciudadResaltadaMasPequena = "";
                // Actualizamos la tabla, el total y la lista
                mostrarCiudades();
                totalCiudades();
                listaCiudades();
            }
        )};
        
        /*
        4. Añadir ciudad y habitantes
        */
        function anadirCiudad() {
            // Capturamos el botón de añadir
            let anadir = document.getElementById("botonAnadir");
            // Esperamos el clic del usuario
            anadir.addEventListener('click', () => {
                // Pedimos el nombre de la ciudad y los habitantes
                let ciudad = prompt("Nombre de la ciudad que quieras añadir:");
                let habitantes = parseInt(prompt("Numero de habitantes que hay en la ciudad:"));
                
                // Comprobamos que los datos sean válidos
                while (ciudad === "" || isNaN(habitantes) || habitantes < 0) {
                    alert("La ciudad o los habitantes no pueden estar vacios o ser menos que 0");
                    ciudad = prompt("Nombre de la ciudad que quieras añadir:");
                    habitantes = parseInt(prompt("Numero de habitantes que hay en la ciudad:"));
                }

                // Añadimos la nueva ciudad al Map
                ciudades.set(ciudad, habitantes);
                // Limpiamos los resaltados
                ciudadResaltadaMasGrande = "";
                ciudadResaltadaMasPequena = "";
                // Actualizamos todo
                mostrarCiudades();
                totalCiudades();
                listaCiudades();
            }
        )};

        /*
        5. Si el usuario solicita saber la ciudad de mas habitantes que se muestre en un color rojo el tipo de
        letra
        */
        function ciudadMasPoblada() {
            // Capturamos el botón correspondiente
            let btnmaxHabitantes = document.getElementById("botonMasHabitantes");
            // Cuando el usuario hace clic
            btnmaxHabitantes.addEventListener('click', () => {
                let maxHabitantes = 0;
                let ciudadMasGrande = "";
                // Recorremos todas las ciudades
                for (const [ciudad, habitantes] of ciudades.entries()) {
                    // clave será 'Madrid', 'Granada', etc.
                    // valor será 3500000, 232000, etc.
                    // Si encontramos una con más habitantes, la guardamos
                    if (habitantes > maxHabitantes) {
                        maxHabitantes = habitantes;
                        ciudadMasGrande = ciudad;
                        ciudadResaltadaMasGrande = ciudadMasGrande;
                    }
                }
                // Mostramos la tabla con la ciudad resaltada en rojo
                mostrarCiudades();
            })
        }
        
        /*
        6. Si el usuario solicita la ciudad de menos habitantes que se muestre en color verde.
        */
        function ciudadMenosPoblada() {
            // Capturamos el botón correspondiente
            let btnminHabitantes = document.getElementById("botonMenosHabitantes");
            // Cuando el usuario hace clic...
            btnminHabitantes.addEventListener('click', () => {
                // Número grande para comparar
                let minHabitantes = 10000000000000; 
                let ciudadMasPequena = "";
                // Recorremos todas las ciudades
                for (const [ciudad, habitantes] of ciudades.entries()) {
                    // clave será 'Madrid', 'Granada', etc.
                    // valor será 3500000, 232000, etc.
                    // Si encontramos una con menos habitantes, la guardamos
                    if (habitantes < minHabitantes) {
                        minHabitantes = habitantes;
                        ciudadMasPequena = ciudad;
                        ciudadResaltadaMasPequena = ciudadMasPequena;
                    }
                }
                // Mostramos la tabla con la ciudad resaltada en verde
                mostrarCiudades();
            })
        }
        
        // Llamamos a las funciones para que todo se muestre al cargar la página
        mostrarCiudades();
        totalCiudades();
        listaCiudades();
        borrarCiudad();
        anadirCiudad();
        ciudadMasPoblada();
        ciudadMenosPoblada();
