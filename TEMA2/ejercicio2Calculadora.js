/*
        * 2. Crear una calculadora con funciones flecha y las operaciones básicas (+ , * , - , / ). Utilizar dos
        * parámetros de entrada y 4 botones. 
        */
        let resultado = 0;
        let suma = document.getElementById("suma");
        suma.addEventListener('click', () => {
            let num1 = parseInt(document.getElementById("numero1").value);
            let num2 = parseInt(document.getElementById("numero2").value);
            calculadora(num1,num2,"+");
        });
        let resta = document.getElementById("resta");
        resta.addEventListener('click', () => {
            let num1 = parseInt(document.getElementById("numero1").value);
            let num2 = parseInt(document.getElementById("numero2").value);
            calculadora(num1,num2,"-");
        });
        let multiplicacion = document.getElementById("multiplicacion");
        multiplicacion.addEventListener('click', () => {
            let num1 = parseInt(document.getElementById("numero1").value);
            let num2 = parseInt(document.getElementById("numero2").value);
            calculadora(num1,num2,"*");
        });
        let division = document.getElementById("division");
        division.addEventListener('click', () => {
            let num1 = parseInt(document.getElementById("numero1").value);
            let num2 = parseInt(document.getElementById("numero2").value);
            calculadora(num1,num2,"/");
        });

        let calculadora = (a, b, operador) => {
            switch(operador) {
                case "+":
                    resultado = a + b;
                    break;
                case "-":
                    resultado = a - b;
                    break;
                case "*":
                    resultado = a * b;
                    break;
                case "/":
                    resultado = a / b;
                    break;
            }
            document.getElementById("resultado").innerHTML = "El resultado es: " + resultado;
        }