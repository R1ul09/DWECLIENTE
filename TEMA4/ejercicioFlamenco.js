let palosFlamencos = {
    solea: {
        palo: "Soleá",
        tempo: "Lento y solemne",
        letra: "Soledad, amor y desengaño",
        descripcion: "Palo fundamental del flamenco, considerado la columna vertebral del cante jondo. Su ritmo es lento y compasado (doce tiempos), transmitiendo una profunda sensación de pena, soledad y tragedia. Es la base rítmica de muchos otros estilos.",
        acentos: [1, 4, 7, 10],
        compasTotal: 12
    },

    alegrias: {
        palo: "Alegrías",
        tempo: "Rápido y alegre",
        letra: "Temas festivos y luminosos",
        descripcion: "Palo festivo originario de Cádiz, caracterizado por su ritmo vivo y marcado, perfecto para el baile. Se enmarca en el compás de doce tiempos de la Soleá, pero se ejecuta a una velocidad muy superior. Sus letras suelen tratar sobre temas luminosos, la alegría de vivir y la belleza de su tierra natal.",
        acentos: [1, 4, 7, 10],
        compasTotal: 12
    },

    bulerias: {
        palo: "Bulerías",
        tempo: "Rápido y festero",
        letra: "Picardía, humor y cierre de fiestas",
        descripcion: "El palo más rápido, alegre y festero del flamenco, asociado a Jerez de la Frontera. Es el más complicado de bailar e interpretar debido a su compás irregular y contratiempo, aunque se mantiene dentro de los doce tiempos. Se utiliza típicamente para finalizar las fiestas y reuniones flamencas por su carácter espontáneo y pícaro.",
        acentos: [1, 4, 7, 10],
        compasTotal: 12
    },

    tientos: {
        palo: "Tientos",
        tempo: "Lento y marcado",
        letra: "Temas profundos y expresivos",
        descripcion: "Palo de gran seriedad y elegancia, a menudo considerado como el 'padre' del Tango. Su ritmo es lento y muy marcado (compás de cuatro tiempos), permitiendo al cantaor una gran expresividad y sentimiento. Las letras son de carácter reflexivo y profundo, sin ser tan dramáticas como la Seguiriyas.",
        acentos: [1, 4],
        compasTotal: 4
    },

    tangos: {
        palo: "Tangos",
        tempo: "Vivo y rítmico",
        letra: "Letras bailables y animadas",
        descripcion: "Uno de los palos fundamentales y más bailables del flamenco. Deriva del Tiento, pero se ejecuta a un ritmo más vivo y alegre con un compás de cuatro tiempos. Sus letras son variadas, desde temas jocosos y cotidianos hasta temas de amor y despecho. Es popular en toda Andalucía, especialmente en Cádiz y Triana.",
        acentos: [1, 3],
        compasTotal: 4
    },

    seguiriyas: {
        palo: "Seguiriyas",
        tempo: "Lento y dramático",
        letra: "Dolor, tragedia y lamento",
        descripcion: "Palo cumbre del cante jondo, expresando el dolor y el lamento más profundo del alma flamenca. Su compás es complejo e irregular (doce tiempos) y su ejecución es lenta y desgarradora. Es un cante de raíz gitana que históricamente trata temas de muerte, desolación y sufrimiento.",
        acentos: [1, 3, 6, 8, 10],
        compasTotal: 12
    },

    fandango: {
        palo: "Fandangos",
        tempo: "Libre o semilibre",
        letra: "Muy melódicas y variadas",
        descripcion: "Un estilo melódico de compás ternario que tiene muchas variantes regionales (Huelva, Málaga, etc.). Existen dos tipos principales: el Fandango *a palo seco* (sin acompañamiento rítmico) y el Fandango *abandolao* (con acompañamiento). Es uno de los estilos más antiguos y populares del folklore andaluz, con letras muy líricas.",
        acentos: [1, 3],
        compasTotal: 4
    }
};

// Función que dibuja el compás marcando en negrita los acentos
function dibujarCompas(acentos, compasTotal) {
    
    // Variable donde se guarda el compás generado
    let compas = "";

    // Bucle que crea cada número del compás
    for (let i = 1; i <= compasTotal; i++) {
        // Si el número es un acento, lo pongo en negrita
        if (acentos.includes(i)) {
            compas += `<b>${i}</b> `;
        } else {
            // Si no es acento, lo pongo normal
            compas += `${i} `;
        }
    }

    // Devuelvo el comps limpio
    return compas.trim();
}

// Guardamos el select de los palos
let select = document.getElementById("palos");

// Guardamos el div donde están los botones
const botonesDiv = document.getElementById("botones");

// Guardamos el div donde sale la informacion
const resultadoDiv = document.getElementById("resultado"); 

// Evento que se ejecuta cuando se elige un palo
select.addEventListener("change", () => {

    // Guardo el palo elegido
    let palo = select.value;
    
    // Si no se ha elegido nada, oculto todo
    if (!palo) {
        resultadoDiv.innerHTML = "";
        botonesDiv.style.display = "none";
        resultadoDiv.style.display = "none";
        return;
    }

    // Cojo la info del palo seleccionado
    let datos = palosFlamencos[palo];

    // Muestro botones y resultado
    botonesDiv.style.display = "block";
    resultadoDiv.style.display = "block"; 
    
    // Pongo el título y la descripcion del palo
    let html = `
        <h3>${datos.palo}</h3>
        <b>Descripción:</b> ${datos.descripcion}<br>
        <hr>
    `;

    // Lo meto en el div de resultado
    resultadoDiv.innerHTML = html;
});

// Evento del botón que añade el tempo
document.getElementById("btnTempo").addEventListener("click", () => {
    // Cojo el palo elegido
    let palo = select.value;
    if (!palo) return;

    // Cojo el div del resultado
    let resultadoDiv = document.getElementById("resultado");

    // Creo el texto del tempo
    const tempoTexto = `<b>Tempo:</b> ${palosFlamencos[palo].tempo}<br>`;

    // Evito que se repita si ya está puesto
    if (resultadoDiv.innerHTML.includes(tempoTexto)) {
        return; 
    }

    // Lo añado al resultado
    resultadoDiv.innerHTML += tempoTexto;
});

// Evento del botón que añade la letra
document.getElementById("btnLetra").addEventListener("click", () => {
    // Cojo el palo elegido
    let palo = select.value;
    if (!palo) return;

    // Cojo el div del resultado
    let resultadoDiv = document.getElementById("resultado");

    // Creo el texto de la letra
    const letraTexto = `<b>Tipo de letra:</b> ${palosFlamencos[palo].letra}<br>`;

    // Evito que se repita si ya está puesto
    if (resultadoDiv.innerHTML.includes(letraTexto)) {
        return; 
    }

    // Lo añado
    resultadoDiv.innerHTML += letraTexto;
});

// Evento del botón que añade el compás dibujado
document.getElementById("btnCompas").addEventListener("click", () => {
    // Cojo el palo elegido
    let palo = select.value;
    if (!palo) return;

    // Cojo el div del resultado
    let resultadoDiv = document.getElementById("resultado");

    // Cojo todos los datos del palo
    const datos = palosFlamencos[palo];
    
    // Creo el HTML del compas con acentos
    const compasHTML = `
        <div class="compas-section">
            <b>Compás con acentos:</b><br>
            ${dibujarCompas(datos.acentos, datos.compasTotal)}
        </div>
        <hr>
    `;

    // Evito repetirlo si ya está puesto
    if (resultadoDiv.innerHTML.includes("Compás con acentos:")) {
        return; 
    }

    // Lo añado al resultado
    resultadoDiv.innerHTML += compasHTML;
});