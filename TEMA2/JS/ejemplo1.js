let diasSemana = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
document.getElementById("dias").innerHTML = "Dias: " + diasSemana;
// Y lo sacamos por consola con .map(), que lo que hace es crear un nuevo array y en este caso
let diasConSuma = diasSemana.map(dias => dias.length);
document.getElementById("diasSemana").innerHTML = "Longitudes: " + diasConSuma;
// Mostraremos la longitud de palabras de cada dia y la suma total
let sumaDias= diasSemana.reduce((acumulador, elemento) => {
    return acumulador + elemento.length;
}, 0);
// Muestra la suma de la longitud de los dias
document.getElementById("sumaDeDias").innerHTML = "Suma de letra de Dias: " + sumaDias;
let diaMasLargo = diasSemana[0];
let diaMasCorto = diasSemana[0];
        
for(let i = 1; i < diasSemana.length; i++) {
    let diaActual = diasSemana[i];
            
    // Si la longitud del día actual es MAYOR que la longitud del más largo hasta ahora
    if (diaActual.length > diaMasLargo.length) {
        // Almacenamos el día
        diaMasLargo = diaActual; 
    }

    // Si la longitud del día actual es MENOR que la longitud del más corto hasta ahora
    if (diaActual.length < diaMasCorto.length) {
        // Almacenamos el día
        diaMasCorto = diaActual; 
    }
}
document.getElementById("diaMasLargo").innerHTML = "Dia mas Largo: " + diaMasLargo;
document.getElementById("diaMasCorto").innerHTML = "Dia mas Corto: " + diaMasCorto;