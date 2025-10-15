 /*
        1. Definir una función de flecha que reciba un valor entero y retorne otro valor entero aleatorio
        comprendido entre 1 y el valor que llega como parámetro. Asignar dicha función de flecha a una
        constante para permitir llamarla en sucesivas ocasiones.        
        */
        let numero = parseInt(prompt("Introduce un numero entero:"));

        while (numero <= 0 || isNaN(numero)) {
            alert("El numero no puede estar vacio o debe ser mayor a 0");
            numero = parseInt(prompt("Introduce un numero entero:"));
        }
        
        let numeroRandom = (maximo) => {
            const operacion = Math.floor(Math.random()*maximo) + 1;
            return operacion;
        }

        
        document.getElementById("mensaje").innerHTML = "Valor aleatorio entre 1 y " + numero + ": " + numeroRandom(numero);
        