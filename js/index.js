const infoPun = document.querySelector("#info-puntuacio");
const infoNav = document.querySelector("#info-navegador");
const idiomaJoc = document.querySelector("#info-idioma");
const infoUrl = document.querySelector("#info-url");
const btnCom = document.querySelector("#btn-comencar-inici");
const btnBor= document.querySelector("#btn-borrar-puntuacio");

const radios = document.querySelectorAll('input[name="numJugadors"]');

let opcio;
const contenedor2 = document.querySelector("#contenedor-j2");


const nomJ1 = document.querySelector("#nom-j1");
const msgJ1 = document.querySelector("#msg-j1");
const nomJ2 = document.querySelector("#nom-j2");
const msgJ2 = document.querySelector("#msg-j2");



// identifiquem que radios esta actiu
radios.forEach(radio => {
  radio.addEventListener('change', (event) => {
    // event.target conté el radio especific que s'acaba de seleccionar
    opcio = event.target.value;
    if (opcio==1){
      contenedor2.classList.add("oculto");
    }else{
      contenedor2.classList.remove("oculto");
    }
  });
});


// validacio dels usuaris
function validarJugador(){

    const jugador1 = comprovarJugador(nomJ1.value, nomJ1, msgJ1);
    if (opcio==2){
      const jugador2 = comprovarJugador(nomJ2.value, nomJ2, msgJ2);
      return (jugador1&&jugador2);
    }
    return jugador1;

};

// validacio de caracters input
function comprovarJugador(jugador, lloc, msg){
  let missatge = "";
  const patro = /^\w+$/;
  let valid;
  if (lloc == nomJ2){
    if(nomJ1.value == nomJ2.value){
      missatge = "Els dos jugadors han de tenir noms diferents"
    }
  }

  if (jugador.trim()== ""){
      missatge= "Has d'informar el nom d'un jugador";
  }else if (jugador.length<4){
      missatge="El nom ha de tenir més de 3 caràcters";
  }else if (jugador.length>14){
      missatge="El nom ha de tenir menys de 15 caràcters"
  }else if (!patro.test(jugador)){
      missatge="Només es poden introduir lletres sense accents, números i _";
  }
  if (missatge){
    msg.classList.add("texto-error");
    msg.classList.remove("texto-correcto");
    lloc.classList.add("input-error");
    lloc.classList.remove("input-correcto");
    valid = false;
    
  }else{
    msg.classList.remove("texto-error");
    msg.classList.add("texto-correcto");
    lloc.classList.remove("input-error");
    lloc.classList.add("input-correcto");
    missatge = "Correcte";
    valid = true;
    
  }
  msg.textContent = missatge;
  msg.classList.add("mensaje-validacion");
  return valid;
}

nomJ1.addEventListener("input", validarJugador);
nomJ1.addEventListener("change", validarJugador);
nomJ2.addEventListener("input", validarJugador);
nomJ2.addEventListener("change", validarJugador);


// Identifica el navegador concret a traves del userAgent
const navegatorUsat = function () {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Desconegut";
};
const changeBackgroundColor = function(){
    // Utiliza variables CSS definidas en style.css para los colores de fondo
    const colors = {
      Firefox: "#ffe8cc",    // Melocotón / naranja pastel (inspirado en el logo de Firefox)
      Edge: "#d0ebff",       // Azul cielo pastel (inspirado en Edge)
      Chrome: "#f4fce3",     // Verde lima muy suave (el tono exacto de las capturas del PDF con Chrome)
      Safari: "#e3fafc",     // Cian / turquesa muy claro (inspirado en Safari)
      Desconegut: "#f3f0ff"  // Lavanda / grisáceo muy suave por defecto
    };

    const color = colors[navegatorUsat()];
    document.body.style.backgroundColor = color;
    return color;
    
}

// objecte
const informacioPropia= {
  navegador: navegatorUsat(),
  idioma: navigator.language.slice(0,2),
  url: location.origin,
  color: changeBackgroundColor()
};

infoNav.textContent = informacioPropia.navegador;
idiomaJoc.textContent= informacioPropia.idioma;
infoUrl.textContent = informacioPropia.url;


sessionStorage.setItem("informacioPropia", JSON.stringify(informacioPropia));


const redireccionar = function(){
if (validarJugador()) {
  document.cookie = `jugador1=${encodeURIComponent(nomJ1.value)}; path=/`;
  if (opcio == 2) {
    document.cookie = `jugador2=${encodeURIComponent(nomJ2.value)}; path=/;`;
  }
  location.href = "html/joc.html";
  }
}

btnCom.addEventListener("click", (e) =>{
  e.preventDefault();
  redireccionar();
});

btnBor.addEventListener("click", (e) =>{
  e.preventDefault();
  if(confirm("Estàs segur que vols esborrar la informació de la puntuació?")){
    infoPun.textContent = "No hi ha puntuació actual";
  }

});
