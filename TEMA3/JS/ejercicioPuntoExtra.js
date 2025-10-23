const palabra1input = document.getElementById("palabra1");
        const palabra2input = document.getElementById("palabra2");
        const palabra3input = document.getElementById("palabra3");
        const comprobar = document.getElementById("comprobar");

        comprobar.addEventListener("click", () => {
            // Guardamos el valor actual (la palabra) que introdujo cada jugador
            const palabra1 = palabra1input.value;
            const palabra2 = palabra2input.value;
            const palabra3 = palabra3input.value;

            // Función principal que contiene toda la lógica del juego
            function comprobarContraseña() {
                // Arrays que guardarán las palabras introducidas, divididas en caracteres
                let arrayPalabra1 = [];
                let arrayPalabra2 = [];
                let arrayPalabra3 = [];
                const contraseña = "L4ultimavezKtelod1go";

                // Convertimos las palabras de texto en arrays de caracteres (ej: "hola" -> ['h', 'o', 'l', 'a'])
                arrayPalabra1 = palabra1.split('');
                arrayPalabra2 = palabra2.split('');
                arrayPalabra3 = palabra3.split('');

                // Cadenas de caracteres de referencia para la clasificación y puntuación
                // Incluyen mayúsculas y minúsculas para el acierto exacto
                const vocales = "aeiouAEIOU";
                const consonantes = "bcdfghjklmnñpqrstvwxyzBCDFGHJKLMNÑPQRSTVWXYZ"
                const numeros = "0123456789"

                // Inicializamos el contador de puntos del Jugador 1
                let contador1 = 0;
                // Inicializmos el array para guardar los caracteres acertados
                let arrayResultado1 = [] 

                // Itera sobre cada carácter de la palabra del Jugador 1
                for (let i = 0; i < arrayPalabra1.length; i++) {
                    // Comprueba si el carácter existe exactamente en la contraseña
                    if (contraseña.includes(arrayPalabra1[i])) {
                        // Si existe, clasifica el tipo de carácter y asigna puntos
                        if (vocales.includes(arrayPalabra1[i])) {
                            contador1 += 1;
                            arrayResultado1.push(arrayPalabra1[i]);
                        } else if (consonantes.includes(arrayPalabra1[i])) {
                            contador1 += 2;
                            arrayResultado1.push(arrayPalabra1[i]);
                        } else if (numeros.includes(arrayPalabra1[i])) {
                            contador1 += 3;
                            arrayResultado1.push(arrayPalabra1[i]);
                        }
                    }
                }
                
                // El mismo bloqe de lgica de puntuación se repite para jugador 2 y 3
                
                let contador2 = 0; 
                let arrayResultado2 = []
                for (let i = 0; i < arrayPalabra2.length; i++) {
                    if (contraseña.includes(arrayPalabra2[i])) {
                        if (vocales.includes(arrayPalabra2[i])) {
                            contador2 += 1; 
                            arrayResultado2.push(arrayPalabra2[i]);
                        } else if (consonantes.includes(arrayPalabra2[i])) {
                            contador2 += 2;
                            arrayResultado2.push(arrayPalabra2[i]);
                        } else if (numeros.includes(arrayPalabra2[i])) {
                            contador2 += 3;
                            arrayResultado2.push(arrayPalabra2[i]);
                        }
                    }
                }

                let contador3 = 0;
                let arrayResultado3 = []
                for (let i = 0; i < arrayPalabra3.length; i++) {
                    if (contraseña.includes(arrayPalabra3[i])) {
                        if (vocales.includes(arrayPalabra3[i])) {
                            contador3 += 1;
                            arrayResultado3.push(arrayPalabra3[i]);
                        } else if (consonantes.includes(arrayPalabra3[i])) {
                            contador3 += 2;
                            arrayResultado3.push(arrayPalabra3[i]);
                        } else if (numeros.includes(arrayPalabra3[i])) {
                            contador3 += 3;
                            arrayResultado3.push(arrayPalabra3[i]);
                        }
                    }
                }
                
                // Jugador 1
                if (palabra1 === contraseña) {
                    // Si acierta completamente, le damos la puntuación máxima (para que gane la competición)
                    contador1 = 9999; 
                    document.getElementById("resultado1").innerHTML = "¡CONTRASEÑA CORRECTA! - JUGADOR 1";
                } else {
                    // Si no acierta, mstramos los puntos y las letras acertadas
                    document.getElementById("resultado1").innerHTML = 
                        "Los puntos del jugador 1 son: " + contador1 + 
                        // Uno el array de aciertos con comas
                        ". Letras acertadas: " + arrayResultado1.join(', ');
                }

                // Jugador 2
                if (palabra2 === contraseña) {
                    contador2 = 9999;
                    document.getElementById("resultado2").innerHTML = "¡CONTRASEÑA CORRECTA! - JUGADOR 2";
                } else {
                    document.getElementById("resultado2").innerHTML = 
                        "Los puntos del jugador 2 son: " + contador2 + 
                        ". Letras acertadas: " + arrayResultado2.join(', ');
                }

                // Jugador 3
                if (palabra3 === contraseña) {
                    contador3 = 9999;
                    document.getElementById("resultado3").innerHTML = "¡CONTRASEÑA CORRECTA! - JUGADOR 3";
                } else {
                    document.getElementById("resultado3").innerHTML = 
                        "Los puntos del jugador 3 son: " + contador3 + 
                        ". Letras acertadas: " + arrayResultado3.join(', ');
                }

                // Comprobmos si el Jugador 1 tiene más puntos que J2 Y J3
                if (contador1 > contador2 && contador1 > contador3) {
                    document.getElementById("resultadofinal").innerHTML = "el ganador es el jugador 1 con " + contador1;
                // Si no es J1, compruebo si el Jugador 2 tiene más puntos que J1 Y J3
                } else if (contador2 > contador3 && contador2 > contador1) {
                    document.getElementById("resultadofinal").innerHTML = "el ganador es el jugador 2 con " + contador2;
                // Si no es ninguno de los anteriores, compruebo si J3 tiene más puntos que J1 Y J2
                } else if (contador3 > contador1 && contador3 > contador2) {
                    document.getElementById("resultadofinal").innerHTML = "el ganador es el jugador 3 con " + contador3;
                // Si ninguno cumple la condición de ser estrictamente el mayor, hay un empate
                } else {
                    document.getElementById("resultadofinal").innerHTML = "¡Ha habido un empate! No hay un ganador único.";
                }
            }

            comprobarContraseña();
        })
