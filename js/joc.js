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
const nomPanellJ1 = document.querySelector("#nom-panel-j1");
const puntsPanellJ1 = document.querySelector("#punts-j1");
const partidesPanelJ1 = document.querySelector("#total-j1");
const victoriesPanelJ1 = document.querySelector("#guanyades-j1");
const recordPanelJ1 = document.querySelector("#record-j1");
const totalJugades = 9;

let puntuacioJ1 = 0;
let puntsJ1 = 0;
let ratxa = 0;
let paraulaAdivinar;
let paraulaNormalitzada;
let guiones;
let jugadesFetes = 0;
let partidesTotal=0 ;
let maxpuntsJ1 = 0;



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
const AlFinalSoloSeremosHistoria = function(){
    let porcentaje = partidesTotal > 0 ? ((puntuacioJ1 / partidesTotal) * 100).toFixed(2) + "%": "0%";

    partidesPanelJ1.textContent = partidesTotal;
    victoriesPanelJ1.textContent = puntuacioJ1 + "(" + porcentaje + ")";
    recordPanelJ1.textContent = maxpuntsJ1;
}

const actualitzarTarjetes = function () {

    document.title = llegirCookie("jugador1") + "(" + puntuacioJ1 + ")";
    document.body.style.backgroundColor = ObjInfo.color;
    spanIdioma.textContent = "Idioma (" + ObjInfo.idioma + ")";
    nomPanellJ1.textContent = llegirCookie("jugador1");
    puntsPanellJ1.textContent = puntsJ1;
 
    
    

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
    botons.forEach(boto => boto.disabled = estat);
};

btnComencar.addEventListener("click", () => {
    if (!validarParaula()) {
        return
    };
    puntsJ1 = 0;
    ratxa = 0;
    guions();
    paraulaNormalitzada = normalitzarText(paraulaAdivinar);
    activarBotons(false);
    partidesTotal++;
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

const generarLletres = function () {
    let idiomaLLetres;
    if (ObjInfo.idioma == "ca") {
        idiomaLLetres = LLETRES_CA;
    } else if (ObjInfo.idioma == "es") {
        idiomaLLetres = LLETRES_ESP;
    } else if (ObjInfo.idioma == "en") {
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
                        puntsJ1 += ratxa;
                    }
                }
            } else {
                jugadesFetes++;
                imgGlobo.src = `../img/img_${jugadesFetes}.png`;
                puntsJ1--;
                ratxa = 0;

            }
            boto.disabled = true;
            if (guiones == paraulaAdivinar) {
                puntuacioJ1++;
                reiniciar();
                mostradorP.classList.add("victoria");
                if (maxpuntsJ1<=puntsJ1){
                    maxpuntsJ1=puntsJ1;
                }

            } else if (jugadesFetes == totalJugades) {
                reiniciar();
                mostradorP.classList.add("derrota");
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
    AlFinalSoloSeremosHistoria();
    activarBotons(true);
    inputParaula.disabled = false;
    btnComencar.disabled = false;
}
// Event tancar dialog
document.querySelector("#btn-tancar-modal").addEventListener("click", () => {
    dialog.close();
});
