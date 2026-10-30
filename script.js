/* ============================================================================
   PLANTILLA PARA CUALQUIER API — copia esta carpeta al empezar el examen.
  
   Orden: 1) CONFIG  2) dónde está el array  3) adaptadores  4) textos del HTML
   ========================================================================== */

const API_BASE_URL = "http://localhost:3000/api/onepiece";  // 
const LIST_URL = `${API_BASE_URL}/characters?limit=100`;             
const DETAIL_URL = (id) => `${API_BASE_URL}/characters/${id}`;      
const SEARCH_URL = (text) => `${API_BASE_URL}/characters/?name=${encodeURIComponent(text)}`;
const COLLECTION_MAX = 10;                                      
const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#e9ecef"/></svg>');

let items = [];
let selectedItem = null;
let collection = [];

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const statusElement = document.querySelector("#status");
const listElement = document.querySelector("#item-list");
const detailElement = document.querySelector("#item-detail");
const collectionElement = document.querySelector("#collection-list");
const collectionCountElement = document.querySelector("#collection-count");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Error HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

function extractArray(data) {
  if (Array.isArray(data)) return data;     // la respuesta ES el array
  return data.status ?? data.name ?? data.height ?? data.birthday ?? []; // TODO elige la buena
}

function adaptItem(raw) {
  return {
    id: raw.id,                               // TODO ¿id? ¿key? ¿la saco de la url?
    name: raw.name.en ?? raw.title ?? "Sin nombre", // TODO
    image: raw.image ?? raw.image_url ?? PLACEHOLDER_IMAGE, // TODO
    category: raw.status ?? "",             // TODO
  };
}

function createElement(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}
function createImage(src, alt) {
  const img = createElement("img");
  img.src = src || PLACEHOLDER_IMAGE;
  img.alt = alt;
  img.loading = "lazy";
  img.addEventListener("error", () => { img.src = PLACEHOLDER_IMAGE; }, { once: true });
  return img;
}
function showStatus(message, type = "loading") {
  statusElement.textContent = message;
  statusElement.className = `status is-${type}`;
  statusElement.hidden = false;
}
function hideStatus() { statusElement.hidden = true; }
function getErrorMessage(error) {
  if (error.status === 404) return "No se ha encontrado ningún resultado.";
  if (error.status) return `Error del servidor (${error.status}).`;
  return "No se ha podido conectar con la API.";
}

function renderList() {
  if (items.length === 0) {
    listElement.replaceChildren(createElement("li", "muted", "No hay resultados."));
    return;
  }
  listElement.replaceChildren(...items.map((item) => {
    const li = createElement("li");
    const button = createElement("button", "card");
    button.type = "button";
    button.dataset.id = item.id;
    button.append(createImage(item.image, item.name), createElement("span", "name", item.name));
    li.append(button);
    return li;
  }));
}

function renderDetail() {
  if (!selectedItem) {
    detailElement.replaceChildren(createElement("p", "muted", "Selecciona un elemento."));
    return;
  }
  const inCollection = collection.some((c) => c.id === selectedItem.id);
  const full = collection.length >= COLLECTION_MAX;
  const addButton = createElement("button", "", inCollection ? "Ya añadido" : full ? "Colección llena" : "Añadir");
  addButton.type = "button";
  addButton.id = "add-button";
  addButton.disabled = inCollection || full;
  const article = createElement("article", "detail");
  article.append(
    createElement("h3", "", selectedItem.name),
    createImage(selectedItem.image, selectedItem.name),
    createElement("p", "", selectedItem.category), // TODO más datos
    addButton,
  );
  detailElement.replaceChildren(article);
}

function renderCollection() {
  collectionCountElement.textContent = `${collection.length}/${COLLECTION_MAX}`;
  const slots = [];
  for (let i = 0; i < COLLECTION_MAX; i++) {
    const li = createElement("li", "slot");
    const member = collection[i];
    if (member) {
      const remove = createElement("button", "", "Quitar");
      remove.type = "button";
      remove.dataset.index = i;
      li.append(createImage(member.image, member.name), createElement("span", "", member.name), remove);
    } else {
      li.textContent = "Vacío";
    }
    slots.push(li);
  }
  collectionElement.replaceChildren(...slots);
}

async function loadList(url) {
  showStatus("Cargando…");
  try {
    const data = await fetchJson(url);
    items = extractArray(data).map(adaptItem);
    renderList();
    if (items.length === 0) showStatus("No hay resultados.", "empty"); else hideStatus();
  } catch (error) {
    console.error(error);
    if (error.status === 404) { items = []; renderList(); showStatus("No hay resultados.", "empty"); }
    else showStatus(getErrorMessage(error), "error");
  }
}

async function selectItem(id) {
  showStatus("Cargando detalle…");
  try {
    const data = await fetchJson(DETAIL_URL(id));
    selectedItem = adaptItem(data);
    renderDetail();
    hideStatus();
  } catch (error) {
    console.error(error);
    showStatus(getErrorMessage(error), "error");
  }
}

function addToCollection() {
  if (!selectedItem) return;
  if (collection.length >= COLLECTION_MAX) return showStatus("Colección llena.", "error");
  if (collection.some((c) => c.id === selectedItem.id)) return showStatus("Ya está añadido.", "error");
  collection.push(selectedItem);
  renderCollection();
  renderDetail();
}

function removeFromCollection(index) {
  collection = collection.filter((_, position) => position !== index);
  renderCollection();
  renderDetail();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = searchInput.value.trim().toLowerCase();
  if (text === "") return loadList(LIST_URL);
  loadList(SEARCH_URL(text));
});
listElement.addEventListener("click", (event) => {
  const card = event.target.closest("button[data-id]");
  if (card) selectItem(card.dataset.id);  
});
detailElement.addEventListener("click", (event) => {
  if (event.target.closest("#add-button")) addToCollection();
});
collectionElement.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-index]");
  if (btn) removeFromCollection(Number(btn.dataset.index));
});

renderCollection();
loadList(LIST_URL);
