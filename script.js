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



async function getPirata(nom){
    const resp = await fetch(`http://localhost:3000/api/onepiece/characters/${nom}`);
    if (!resp.ok) return null;
    return await resp.json();
}

function nombrePirata(p) {
    const n = p.name;
    if (!n) return "Nombre desconocido";
    if (typeof n === "string") return n;
    return n.en || "Nombre desconocido";
}
async function cargarLista(n) {
    const miPeticion = ++idPeticion;
    pagina = n;
    cargando = true;
    lista.innerHTML = "";            
    mensaje.textContent = "Cargando lista de piratas...";
    actualizarBotones(false);
 
        const respuesta = await fetch(`${API_URL}?page=${n}&limit=${PAGINA_MAximo}`);
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        const data = await respuesta.json();
        if (miPeticion !== idPeticion) return;   
        const piratas = Array.isArray(data) ? data : data.characters;
        
 
        mensaje.textContent = piratas.length ? "" : "No hay más piratas.";
 
        piratas.forEach(p => {
            const nombre = nombrePirata(p);
            const card = document.createElement("div");
            card.className = "card";
 
            const img = document.createElement("img");
            img.className = "foto";
            img.alt = nombre;
            img.loading = "lazy";
            img.src = p.image_url || "";
            if (!p.image_url) img.style.visibility = "hidden";
 
            const pNombre = document.createElement("p");
            pNombre.className = "nombre";
            pNombre.textContent = nombre;
 
            const pRecompensa = document.createElement("p");
            pRecompensa.className = "recompensa";
            pRecompensa.textContent = textoRecompensa(p);
 
            const btnVer = document.createElement("button");
            btnVer.className = "btnVeure";
            btnVer.textContent = "Ver";
            btnVer.addEventListener("click", () => mostrar(p.id));
 
            const btnAñadir = document.createElement("button");
            btnAñadir.className = "btnAfegir";
            btnAñadir.textContent = "Añadir";
            btnAñadir.addEventListener("click", () => afegirCapturados(p));
 
            card.append(img, pNombre, pRecompensa, btnVer, btnAñadir);
            lista.appendChild(card);
        });
 
        cargando = false;
        actualizarBotones(piratas.length === PAGINA_MAximo);
    
}
 
btnAnterior.addEventListener("click", () => {
    if (pagina > 1 && !cargando) {
        cargarLista(pagina - 1);
        window.scrollTo({ top: 0 });
    }
});
 
btnSiguiente.addEventListener("click", () => {
    if (!cargando) {
        cargarLista(pagina + 1);
        window.scrollTo({ top: 0 });
    }
});
 


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

    const p = await getPirata(nom);

    if (!p) {
        msg.textContent = "No s'ha trobat cap personatge";
        detall.innerHTML = "";
        return;
    }

    msg.textContent = "";
    mostrar(nom);
});

async function mostrar(id) {
    const data = await getPirata(id);
    if (!data) {
        detalle.textContent = "No se pudo cargar el pirata.";
        return;
    }
    const p = data.character || data;
    const nombre = nombrePirata(p);
    const epiteto = p.extra_data && p.extra_data.epithet ? p.extra_data.epithet : "—";
 
    detalle.innerHTML = `
        <h2></h2>
        ${p.image_url ? `<img class="foto" src="${p.image_url}" alt="">` : ""}
        <p>Recompensa: ${textoRecompensa(p)}</p>
        <p>Estado: ${p.status || "—"}</p>
        <p>Edad: ${p.age ?? "—"}</p>
        <p>Alias: ${epiteto}</p>`;
    detalle.querySelector("h2").textContent = nombre;
    const im = detalle.querySelector("img");
    if (im) im.alt = nombre;
}
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