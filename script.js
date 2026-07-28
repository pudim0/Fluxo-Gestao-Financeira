// Relógio digital 
const currentDateEl = document.getElementById("current_date");
if (currentDateEl) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  currentDateEl.innerHTML = day + "/" + month + "/" + year;
}

// Renderização dos ícones Lucide
if (typeof lucide !== "undefined") {
  lucide.createIcons();
}

// Sidebar
const sidebar = document.querySelector(".sidebar");
const hamburger = document.querySelector(".hamburger");
const closeMobile = document.querySelector(".close-mobile");
const overlay = document.querySelector(".overlay");

if (hamburger && sidebar && overlay) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  });
}

if (closeMobile && sidebar && overlay) {
  closeMobile.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
}

if (overlay && sidebar) {
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
}

//Renderização dinâmica do menu de categorias

//Lista de Categorias

const categoryList = document.querySelector(".cat-list");

p