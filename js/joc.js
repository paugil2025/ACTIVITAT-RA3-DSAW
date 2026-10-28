const ObjInfo = JSON.parse(sessionStorage.getItem("informacioPropia"));
const spanIdioma = document.querySelector("#idioma-joc");
const btnTornar = document.querySelector("#btn-tornar");
const btnInstr = document.querySelector("#btn-instruccions");
const btnUll = document.querySelector("#btn-ull");
const inputParaula = document.querySelector("#input-paraula");
const btnComencar = document.querySelector("#btn-comencar-partida");
const mostradorP = document.querySelector("#mostrador-paraula");
const contenedorLetres = document.querySelector("#contenedor-lletres");
const imgGlobo = document.querySelector("#img-globus");
const dialog = document.querySelector("#modal-error");
const textDialog = document.querySelector("#texto-modal-error");

const STORAGE_ESTADISTIQUES = "estadistiquesJugadors";
const STORAGE_PUNTUACIO_MAXIMA = "puntuacioMesAlta";

const panellsJugadors = [
    {
        nom: document.querySelector("#nom-panel-j1"),
        punts: document.querySelector("#punts-j1"),
        partides: document.querySelector("#total-j1"),
        victories: document.querySelector("#guanyades-j1"),
        record: document.querySelector("#record-j1"),
        panell: document.querySelector("#panel-j1")
    },
    {
        nom: document.querySelector("#nom-panel-j2"),
        punts: document.querySelector("#punts-j2"),
        partides: document.querySelector("#total-j2"),
        victories: document.querySelector("#guanyades-j2"),
        record: document.querySelector("#record-j2"),
        panell: document.querySelector("#panel-j2")
    }
];

const totalJugades = 9;

let ratxa = 0;
let paraulaAdivinar;
let paraulaNormalitzada;
let guiones;
let jugadesFetes = 0;
let jugadorActualIndex = 0;
let partidaActiva = false;



const LLETRES_EN = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


const LLETRES_ESP = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


const LLETRES_CA = ['a', 'b', 'c', 'ç', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// li pases el nom y te dona el value de la cookie
function llegirCookie(nom) {
    const cookies = document.cookie.split("; ");     // ["idioma=ca", "tema=fosc"]

    for (const cookie of cookies) {
        const [clau, valor] = cookie.split("=");
        if (clau === nom) {
            return decodeURIComponent(valor);
        }
    }
    return null;
}

// Crea un jugador amb les seves estadístiques.
function crearJugador(nom) {
    const estadistiques = JSON.parse(localStorage.getItem(STORAGE_ESTADISTIQUES) || "[]");
    let desades = null;
    for (let i = 0; i < estadistiques.length; i++) {
        if (estadistiques[i].nom === nom) {
            desades = estadistiques[i];
            break;
        }
    }

    let partides = 0;
    let victories = 0;
    let record = 0;
    let dataRecord = null;

    if (desades !== null) {
        partides = desades.partides || 0;
        victories = desades.victories || 0;
        record = desades.record || 0;
        dataRecord = desades.dataRecord || null;
    }

    return {
        nom,
        punts: 0,
        partides: partides,
        victories: victories,
        record: record,
        dataRecord: dataRecord
    };
}

const jugadors = [
    crearJugador(llegirCookie("jugador1"))
];

if (llegirCookie("jugador2")) {
    jugadors.push(crearJugador(llegirCookie("jugador2")));
    panellsJugadors[1].panell.classList.remove("oculto");
}

// Actualitza la informació dels jugadors a la pantalla.
const actualitzarTarjetes = function () {
    document.title = jugadors[0].nom + "(" + jugadors[0].victories + ")";
    document.body.style.backgroundColor = ObjInfo.color;
    spanIdioma.textContent = "Idioma (" + ObjInfo.idioma + ")";
    for (let index = 0; index < jugadors.length; index++) {
        const jugador = jugadors[index];
        const panell = panellsJugadors[index];
        let porcentaje = "0%";
        if (jugador.partides > 0) {
            porcentaje = ((jugador.victories / jugador.partides) * 100).toFixed(2) + "%";
        }

        panell.nom.textContent = jugador.nom;
        panell.punts.textContent = jugador.punts;
        panell.partides.textContent = jugador.partides;
        panell.victories.textContent = jugador.victories + " (" + porcentaje + ")";
        if (jugador.dataRecord) {
            panell.record.textContent = jugador.record + " punts - "
                + new Date(jugador.dataRecord).toLocaleString();
        } else {
            panell.record.textContent = "Sense punts";
        }
        const teElTorn = jugadors.length > 1
            && partidaActiva
            && index === jugadorActualIndex;
        panell.panell.classList.toggle(
            "jugador-activo",
            teElTorn
        );
        panell.panell.classList.toggle(
            "jugador-inactivo",
            !teElTorn
        );
    }
}
btnTornar.addEventListener("click", () => {
    if (confirm("Estàs segur que vols deixar la partida?")) {
        location.href = "../index.html";
    }
});
btnInstr.addEventListener("click", () => {
    window.open('instruccions.html', 'miPopup', 'width=400,height=400');

});

btnUll.addEventListener("mousedown", () => {
    inputParaula.type = "text";
});
btnUll.addEventListener("mouseup", () => {
    inputParaula.type = "password";
});
actualitzarTarjetes();
// valida que la paraula seguixi els requisits
const validarParaula = function () {
    const patro = /\d/;
    if (inputParaula.value.trim() == "") {
        textDialog.textContent = "Has d’afegir una paraula per poder començar a jugar";
        dialog.showModal();
        return false;
    } else if (patro.test(inputParaula.value)) {
        textDialog.textContent = "La paraula no pot contenir números";
        dialog.showModal();
        return false;
    } else if (inputParaula.value.length < 4) {
        textDialog.textContent = "La paraula ha de contenir més de 3 caràcters";
        dialog.showModal();
        return false;
    } else {
        paraulaAdivinar = inputParaula.value;
        inputParaula.value = "";
        inputParaula.disabled = true;
        btnComencar.disabled = true;
        mostradorP.classList.remove("victoria");
        mostradorP.classList.remove("derrota");
        return true;

    }
};
// funcio habilita els botons
const activarBotons = function (estat) {
    const botons = contenedorLetres.querySelectorAll("button");
    for (let i = 0; i < botons.length; i++) {
        botons[i].disabled = estat;
    }
};

btnComencar.addEventListener("click", () => {
    if (!validarParaula()) {
        return
    };
    for (let i = 0; i < jugadors.length; i++) {
        jugadors[i].punts = 0;
    }
    jugadorActualIndex = 0;
    ratxa = 0;
    jugadesFetes = 0;
    partidaActiva = true;
    imgGlobo.src = "../img/img_0.png";
    guions();
    paraulaNormalitzada = normalitzarText(paraulaAdivinar);
    activarBotons(false);
    actualitzarTarjetes();

});

// Genera els guions a traves de la paraula o paraules, si es un simbol es mantindra visible
const guions = function () {
    guiones = "";
    const patro = /\p{L}/u;
    for (let i = 0; i < paraulaAdivinar.length; i++) {
        if (patro.test(paraulaAdivinar[i])) {
            guiones += "_";
        } else {
            guiones += paraulaAdivinar[i];
        }
    }
    mostradorP.textContent = guiones;

}

// Crea els botons de les lletres.
const generarLletres = function () {
    let idiomaLLetres;
    if (ObjInfo.idioma == "ca") {
        idiomaLLetres = LLETRES_CA;
    } else if (ObjInfo.idioma == "es") {
        idiomaLLetres = LLETRES_ESP;
    } else {
        idiomaLLetres = LLETRES_EN;
    }
    for (let i = 0; i < idiomaLLetres.length; i++) {
        let boto = document.createElement("button");
        boto.textContent = idiomaLLetres[i];
        boto.classList.add("contenedor-lletres");
        boto.disabled = true;
        boto.addEventListener("click", () => {
            if (paraulaNormalitzada.includes(idiomaLLetres[i])) {
                ratxa++;
                for (let e = 0; e < paraulaNormalitzada.length; e++) {
                    if (idiomaLLetres[i] == paraulaNormalitzada[e]) {
                        mostrarLletra(e);
                        jugadors[jugadorActualIndex].punts += ratxa;
                    }
                }
            } else {
                jugadesFetes++;
                imgGlobo.src = `../img/img_${jugadesFetes}.png`;
                jugadors[jugadorActualIndex].punts = Math.max(
                    0,
                    jugadors[jugadorActualIndex].punts - 1
                );
                ratxa = 0;
                jugadorActualIndex = (jugadorActualIndex + 1) % jugadors.length;
            }
            boto.disabled = true;
            if (guiones == paraulaAdivinar) {
                mostradorP.classList.add("victoria");
                if (jugadors.length === 1) {
                    jugadors[0].victories++;
                } else if (jugadors[0].punts !== jugadors[1].punts) {
                    if (jugadors[0].punts > jugadors[1].punts) {
                        jugadors[0].victories++;
                    } else {
                        jugadors[1].victories++;
                    }
                }

                finalitzarPartida();
            } else if (jugadesFetes == totalJugades) {
                mostradorP.textContent = paraulaAdivinar.toUpperCase();
                mostradorP.classList.add("derrota");
                finalitzarPartida();
            }
            actualitzarTarjetes();

        });
        contenedorLetres.appendChild(boto);
    }
}
// aixo fa que es generin els botons quan es carga la pagina + el addeventlistener de cada uno de ellos
generarLletres()
// aixo una vegada identificat la ubicacio de la lletra encertada de les paraula normalitzada la intercambia per la real + majus (aixo permiteix accents)
function mostrarLletra(num) {
    let letra = paraulaAdivinar.charAt(num);
    guiones = guiones.slice(0, num) + letra + guiones.slice(num + 1);
    mostradorP.textContent = guiones.toUpperCase();
}
// normalitza la paraula a una sense els accents
function normalitzarText(text) {
    return text.toLowerCase()
        .replace(/[áàä]/g, 'a')
        .replace(/[éèë]/g, 'e')
        .replace(/[íìï]/g, 'i')
        .replace(/[óòö]/g, 'o')
        .replace(/[úùü]/g, 'u');
}

// aixo s'utilitza quan comença la partida per desactivar el imput y activar els botons
function reiniciar() {
    partidaActiva = false;
    activarBotons(true);
    inputParaula.disabled = false;
    btnComencar.disabled = false;
}
// lo que succedeix quan es finalitza la partida
function finalitzarPartida() {
    const dataFinalitzacio = new Date();  // data
    for (let i = 0; i < jugadors.length; i++) {
        const jugador = jugadors[i];
        jugador.partides++;
        if (jugador.punts > jugador.record || !jugador.dataRecord) {
            jugador.record = jugador.punts;
            jugador.dataRecord = dataFinalitzacio.toISOString(); // .toISOString serveix per pasar-ho a string
        }
    }
    guardarEstadistiquesJugadors();
    guardarPuntuacioMesAlta(dataFinalitzacio);
    reiniciar();
}

// Guarda les estadístiques dels jugadors.
function guardarEstadistiquesJugadors() {
    const estadistiques = JSON.parse(localStorage.getItem(STORAGE_ESTADISTIQUES) || "[]");
    for (let i = 0; i < jugadors.length; i++) {
        const jugador = jugadors[i];
        let index = -1;
        for (let i = 0; i < estadistiques.length; i++) {
            if (estadistiques[i].nom === jugador.nom) {
                index = i;
                break;
            }
        }
        const dadesJugador = {
            nom: jugador.nom,
            partides: jugador.partides,
            victories: jugador.victories,
            record: jugador.record,
            dataRecord: jugador.dataRecord
        };
        if (index === -1) {
            estadistiques.push(dadesJugador);
        } else {
            estadistiques[index] = dadesJugador;
        }
    }
    localStorage.setItem(STORAGE_ESTADISTIQUES, JSON.stringify(estadistiques));
}

// Guarda la puntuació més alta.
function guardarPuntuacioMesAlta(dataFinalitzacio) {
    const puntuacioMesAlta = JSON.parse(
        localStorage.getItem(STORAGE_PUNTUACIO_MAXIMA) || "null"
    );
    let millorJugador = jugadors[0];
    if (jugadors.length > 1 && jugadors[1].punts > millorJugador.punts) {
        millorJugador = jugadors[1];
    }

    if (!puntuacioMesAlta || millorJugador.punts > puntuacioMesAlta.punts) {
        localStorage.setItem(STORAGE_PUNTUACIO_MAXIMA, JSON.stringify({
            nom: millorJugador.nom,
            punts: millorJugador.punts,
            data: dataFinalitzacio.toISOString()
        }));
    }
}
// Event tancar dialog
document.querySelector("#btn-tancar-modal").addEventListener("click", () => {
    dialog.close();
});
