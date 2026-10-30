const caja = document.querySelector("#caja");
const botonBuscar = document.querySelector("#botonBuscar");
const mensaje = document.querySelector("#mensaje");
const lista = document.querySelector("#lista");
const detalle = document.querySelector("#detalle");
const divCapturados = document.querySelector("#capturados");
const btnAnterior = document.querySelector("#btnAnterior");
const btnSiguiente = document.querySelector("#btnSiguiente");
const infoPagina = document.querySelector("#infoPagina");


const API_URL = "http://localhost:3000/api/onepiece/characters";
const PAGINA_MAximo = 10;

    // array de los piratas que capturemos la cual no podra tener repetir piratas capturados
let captura = [];
let pagina = 1;
let cargando = false;
let idPeticion = 0;

async function cargarLista(){
    mensaje.textContent = "Cargando lista de piratas...";

        const respuesta = await fetch("API_URL");
        const data = await respuesta.json();
        // Vaciamos la lista por si acaso
         lista.innerHTML = "";
        const piratas = data.characters;

                piratas.forEach(p => { const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                <p>${p.name}</p>
                <button class="btnVeure">Veure</button>
                <button class="btnAfegir">Afegir</button>`;
                card.querySelector(".btnVeure").addEventListener("click", () => mostrar(p.name));
                card.querySelector(".btnAfegir").addEventListener("click", () => afegirCapturados(p.name));
                lista.appendChild(card);
                });
                
                piratas.forEach(p => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `<p>${p.name}</p>`;
                lista.appendChild(card);
                });

                  }  

async function getPirata(nom){
    const resp = await fetch(`http://localhost:3000/api/onepiece/characters/${nom}`);
    if (!resp.ok) return null;
    return await resp.json();
}

async function mostrar(nom) {
  const p = await getPirata(nom);
  const status = p.status.map(t => t.status.name).join(", ");

  document.getElementById("detalles").innerHTML = `
    <h2>${p.name} #${p.id}</h2>
    <img src="${p.image_url}" alt="${p.name}">
    <p>Viu?: ${status}</p>`;
}

 document.getElementById("btnBuscar").addEventListener("click", async () => {
    const nom = document.getElementById("buscador").value.toLowerCase().trim();
    const msg = document.getElementById("mensaje");
    const detall = document.getElementById("detalle");

    const p = await getPokemon(nom);

    if (!p) {
        msg.textContent = "No s'ha trobat cap personatge";
        detall.innerHTML = "";
        return;
    }

    msg.textContent = "";
    mostrar(nom);
});

cargarLista();



async function afegirCapturados(nom) {
  
  const p = await getPirata(nom);
  captura.push(p);
  pintarCaptura();
}

function pintarCaptura() {
  const div = document.getElementById("capturados");
  div.innerHTML = "";
  captura.forEach(p => {
    const status = p.status.map(t => t.status.name).join(", ");
    div.innerHTML += `
      <div class="card">
        <img src="${p.sprites.other['official-artwork'].front_default}" alt="${p.name}">
        <p>${p.name} #${p.id}</p>
        <p>${status}</p>
      </div>`;
  });
}