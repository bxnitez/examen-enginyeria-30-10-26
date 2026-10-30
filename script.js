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
        const respuesta = await fetch("https://bn9ct5dd-3000.uks1.devtunnels.ms/");
        const data = await respuesta.json();
        // Vaciamos la lista por si acaso
         lista.innerHTML = "";
        const piratas = data.characters;

                data.characters.forEach(p => {
               
    }   

      
    }

}