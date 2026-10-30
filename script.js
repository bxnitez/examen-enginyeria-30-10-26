const caja = document.querySelector("#caja");
const botonBuscar = document.querySelector("#botonBuscar");
const mensaje = document.querySelector("#mensaje");
const lista = document.querySelector("#lista");
const detalle = document.querySelector("#detalle");
const divCapturados = document.querySelector("#capturados");

    // array de los piratas que capturemos la cual no podra tener repetir piratas capturados
let captura = [];

async function cargarLista(){
    mensaje.textContent = "Cargando lista de piratas...";

    try{
        const respuesta = await fetch("https://onepieceapi.com/api/characters?limit=12");
        const datos = await respuesta.json();

        const piratas = datos.results;
        // Vaciamos la lista por si acaso
         lista.innerHTML = "";
         for (let i = 0; i < piratas.length; i++) {
      const nombre = piratas[i].name;
      const id = i + 1; 

      
    }

}