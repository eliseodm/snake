// Score de la pantalla
const scoreScreen = document.querySelector(".score");



//Ancho y alrot de mi canvas
const CONSCANVAS = 500;
// Intervalo del loop
let INTERVALO = 110;
// Tamano de mi cuadrado
const PESO = 20;
// Config de direcciones
const DIRECCION = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  W: [0, -1],
  A: [-1, 0],
  S: [0, 1],
  D: [1, 0],
  w: [0, -1],
  a: [-1, 0],
  s: [0, 1],
  d: [1, 0],
};

// Controles y Seteo de direccion (init derecha por default) y de bicho
let seteos = {
  direccion: { x: 1, y: 0 },
  bicho: [{ x: 0, y: 0 }],
  victima: { x: 0, y: 250 },
  jugando: false,
  crecimiento: 0,
  score: 0
};

// Variable con las direcciones
let padonde;

// referencio el camvas en JS
let papel = document.querySelector("canvas");

// Referencia el contexto del canvas
let ctx = papel.getContext("2d");

let looper = () => {
  //Armar objeto vacio de cola
  let cola = {};
  //Referencio la cabeza del bicho

  //clonar la ultima posicion de bicho en cola
  Object.assign(cola, seteos.bicho[seteos.bicho.length - 1]);

  //instancio la cabeza del bicho
  const sq = seteos.bicho[0];

  //verifico que bicho atrapo a la victima
  let atrapado = sq.x === seteos.victima.x && sq.y === seteos.victima.y;

  //dectecto si en este frame hay choque
  if (detectarChoque()) {
    //pongo en false el juego
    seteos.jugando = false;
    alert("GAME OVER SCORE: " + seteos.score);

    //llamo a reiniciar parametros (se agrego boton reiniciar)
    reiniciar();
  }

  //Referencio la direccion actual
  let dx = seteos.direccion.x;
  let dy = seteos.direccion.y;

  //Guardo el tamanio del bicho
  let tamanio = seteos.bicho.length - 1;

  //pregunto si el juego corre
  if (seteos.jugando) {
    //hago For de atras para adelante
    for (let idx = tamanio; idx > -1; idx--) {
      //Referencio la cabeza del bicho actual
      const sq = seteos.bicho[idx];

      //pregunto si esta es la cabeza
      if (idx === 0) {
        //si es la cabeza avanzo por la misma direccion
        sq.x += dx;
        sq.y += dy;
      } else {
        //si no es la cabeza asigno posicion del miembro anterior
        sq.x = seteos.bicho[idx - 1].x;
        sq.y = seteos.bicho[idx - 1].y;
      }
    }
  }

  //verifico si atrape algo
  if (atrapado) {
    //le digo a la serpiente que cresca 10 unidades
    seteos.crecimiento += 5;
    //Aumenta la velocidad
    INTERVALO -= 2;
    //sumo el score
    seteos.score += 250;
    //Muestro el cuadro de Score
    scoreScreen.innerHTML = `SCORE: ${seteos.score}`;
    // y llamo a revictima y reposiciono al conejo blanco
    revictima();
  }

  // pregunto si tengo que crecer
  if (seteos.crecimiento > 0) {
    //agrego a mi bicho el clon de cola creado anteriormente y le resto 1 a crecimiento
    seteos.bicho.push(cola);
    seteos.crecimiento -= 1;
  }
  //Llamo a la animacion a dibujar
  requestAnimationFrame(dibujar);
  //Llamar a la funcion luego de X intervalo
  setTimeout(looper, INTERVALO);
};

//Detecto la colicion con paredes y sobre si misma
let detectarChoque = () => {
  //instancia a la cabeza
  const head = seteos.bicho[0];
  //pregunto si choca con los bordes o si se sale
  if (
    head.x < 0 ||
    head.x >= CONSCANVAS / PESO ||
    head.y < 0 ||
    head.y >= CONSCANVAS / PESO
  ) {
    return true; // si algun choque pasa tira un true
  }

  //detecto si choca contra si misma
  for (let idx = 1; idx < seteos.bicho.length; idx++) {
    const sq = seteos.bicho[idx];
    if (sq.x === head.x && sq.y === head.y) {
      return true;
    }
  }
};

document.onkeydown = (e) => {
  //Guardo en padonde la nueva direccion
  let padonde = DIRECCION[e.key];
  // Deconstruyo x y de padonde
  const [x, y] = padonde;
  //Valido que no se pueda ir en la direccion contraria
  if (-x !== seteos.direccion.x && -y !== seteos.direccion.y) {
    //Asigno las direcciones a los controles
    seteos.direccion.x = x;
    seteos.direccion.y = y;
  }
};

let dibujar = () => {
  // borra mi canvas
  ctx.clearRect(0, 0, CONSCANVAS, CONSCANVAS);
  //Recorro todo el bicho
  for (let idx = 0; idx < seteos.bicho.length; idx++) {
    const { x, y } = seteos.bicho[idx];
    dibujarActores("green", x, y);
  }

  //mando a dibujar la victima
  const victima = seteos.victima;
  dibujarActores("lime", victima.x, victima.y);
};

//dibuja todos los cuadros
let dibujarActores = (color, x, y) => {
  // Indico cual sera el color del dibujo a crear
  ctx.fillStyle = color;
  // Creo un rectangulo (posicionX, posicionY, ancho, alto)
  ctx.fillRect(x * PESO, y * PESO, PESO, PESO);
};

// cualquier lado crea posicion y direccion random
let cualquierLado = () => {
  let direccion = Object.values(DIRECCION);
  return {
    x: parseInt((Math.random() * CONSCANVAS) / PESO),
    y: parseInt((Math.random() * CONSCANVAS) / PESO),
    d: direccion[parseInt(Math.random() * 11)],
  };
};

//REvictima posiciona a la victima cuando fue capturada
let revictima = () => {
  let nuevaPosicion = cualquierLado();
  let victima = seteos.victima;
  victima.x = nuevaPosicion.x;
  victima.y = nuevaPosicion.y;
};

//reiniciar reinicia el juego y sus valores
let reiniciar = () => {
  //Parametros en 0
  INTERVALO = 110;
  seteos = {
    direccion: { x: 1, y: 0 },
    bicho: [{ x: 0, y: 0 }],
    victima: { x: 0, y: 250 },
    jugando: false,
    crecimiento: 0,
    score: 0,
  };
  //Reinicio el cuadro de Score
  scoreScreen.innerHTML = `SCORE: ${seteos.score}`;
  //Posicion y direccion de la Cabeza
  posiciones = cualquierLado();
  let head = seteos.bicho[0];
  head.x = posiciones.x;
  head.y = posiciones.y;
  seteos.direccion.x = posiciones.d[0];
  seteos.direccion.y = posiciones.d[1];

  /* // validacion de posicion y direccion de la cabeza
    if ( (posiciones.d === DIRECCION.W) && (head.y < 10)){
        
        controles.direccion.x = DIRECCION.S[0];
        controles.direccion.y = DIRECCION.S[1];
    }else{
        controles.direccion.x = posiciones.d[0];
        controles.direccion.y = posiciones.d[1];
    } */

  //Posicion ramdome de la victima
  posicionVictima = cualquierLado();
  let victima = seteos.victima;
  victima.x = posicionVictima.x;
  victima.y = posicionVictima.y;
  seteos.jugando = true;
};
// Cuando el documento se carga llamo al Looper
window.onload = () => {
  looper()
};