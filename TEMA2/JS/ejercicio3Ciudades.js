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

        let ciudadResaltadaMasGrande = "";
        let ciudadResaltadaMasPequena = "";
        function mostrarCiudades() {
             // Inicializamos la tabla con los encabezados
            let tablaHTML = "<table><thead><tr><th>Ciudad</th><th>Habitantes</th></tr></thead><tbody>";
            ciudades.forEach((habitantes, ciudad) => {
                // Por cada elemento, metemos una fila (<tr>) con dos celdas (<td>)
                // Primera celda: la clave (ciudad)
                // Segunda celda: el valor (habitantes)
                if(ciudad == ciudadResaltadaMasGrande) {
                    let contenido = '<span style="color:red;">' + ciudad + '</span>';
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + contenido + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                } else if(ciudad == ciudadResaltadaMasPequena)  {
                    let contenido = '<span style="color:green;">' + ciudad + '</span>';
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + contenido + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                } else {
                    tablaHTML += "<tr>";
                    tablaHTML += "<td>" + ciudad + "</td>"; 
                    tablaHTML += "<td>" + habitantes + "</td>";
                    tablaHTML += "</tr>";
                }
            });
            tablaHTML += "</tbody></table>";
            document.getElementById("tablaCiudades").innerHTML = tablaHTML;
        }

        /*
        2. El usuario puede saber cuantas ciudades existen
        */
        function totalCiudades() {
            let totalCiudades = ciudades.size;
            document.getElementById("totalCiudades").innerHTML = "El total de ciudades que existen son: " + totalCiudades;
        }
        
        // Lista HTML
        function listaCiudades() {
            let listaHTML = '<select id="ciudadABorrar">';
            ciudades.forEach((habitantes, ciudad) => {
                listaHTML += '<option value="' + ciudad + '">' + ciudad + '</option>';
            });
            listaHTML += "</select>";
            document.getElementById("borrarCiudad").innerHTML = "Ciudad que quieras eliminar: " + listaHTML;
        }
        
        /*
        3. Borrar ciudad
        */
        function borrarCiudad() {
            let borrar = document.getElementById("botonBorrar");
            borrar.addEventListener('click', () => {
                let selectElemento = document.getElementById("ciudadABorrar");
                let ciudadSeleccionada = selectElemento.value;
                ciudades.delete(ciudadSeleccionada);
                ciudadResaltadaMasGrande = "";
                ciudadResaltadaMasPequena = "";
                mostrarCiudades();
                totalCiudades();
                listaCiudades();
            }
        )};
        
        /*
        4. Añadir ciudad y habitantes
        */
        function anadirCiudad() {
            let anadir = document.getElementById("botonAnadir");
            anadir.addEventListener('click', () => {
                let ciudad = prompt("Nombre de la ciudad que quieras añadir:");
                let habitantes = parseInt(prompt("Numero de habitantes que hay en la ciudad:"));
                while (ciudad === "" || isNaN(habitantes) || habitantes < 0) {
                    alert("La ciudad o los habitantes no pueden estar vacios o ser menos que 0");
                    ciudad = prompt("Nombre de la ciudad que quieras añadir:");
                    habitantes = parseInt(prompt("Numero de habitantes que hay en la ciudad:"));
                }
                ciudades.set(ciudad, habitantes);
                ciudadResaltadaMasGrande = "";
                ciudadResaltadaMasPequena = "";
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
            let btnmaxHabitantes = document.getElementById("botonMasHabitantes");
            btnmaxHabitantes.addEventListener('click', () => {
                let maxHabitantes = 0;
                let ciudadMasGrande = "";
                for (const [ciudad, habitantes] of ciudades.entries()) {
                    // clave será 'Madrid', 'Granada', etc.
                    // valor será 3500000, 232000, etc.
                    if (habitantes > maxHabitantes) {
                        maxHabitantes = habitantes;
                        ciudadMasGrande = ciudad;
                        ciudadResaltadaMasGrande = ciudadMasGrande;
                    }
                }
                mostrarCiudades();
            })
        }
        
        /*
        6. Si el usuario solicita la ciudad de menos habitantes que se muestre en color verde.
        */
        function ciudadMenosPoblada() {
            let btnminHabitantes = document.getElementById("botonMenosHabitantes");
            btnminHabitantes.addEventListener('click', () => {
                let minHabitantes = 10000000000000;
                let ciudadMasPequena = "";
                for (const [ciudad, habitantes] of ciudades.entries()) {
                    // clave será 'Madrid', 'Granada', etc.
                    // valor será 3500000, 232000, etc.
                    if (habitantes < minHabitantes) {
                        minHabitantes = habitantes;
                        ciudadMasPequena = ciudad;
                        ciudadResaltadaMasPequena = ciudadMasPequena;
                    }
                }
                mostrarCiudades();
            })
        }
        

        mostrarCiudades();
        totalCiudades();
        listaCiudades();
        borrarCiudad();
        anadirCiudad();
        ciudadMasPoblada();
        ciudadMenosPoblada();