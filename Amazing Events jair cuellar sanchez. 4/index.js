let colCard = document.getElementById("colCard");
let cardsLength = document.getElementById("cardsLength");
let contentCheck = document.getElementById("contenCheck");
let friendlyMessage = document.getElementById("friendlyMessage");

const datos = () => {
  fetchData()
    .then((res) => res.events)
    .then((data) => {
      console.log("data >> ", data);
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      data.sort((a, b) => b.price - a.price);

      renderCards(data, colCard);
      initializeFilters(data);
      classFavoriteHome(favorites);
      cardsLength.innerHTML = data.length;

      const showAside = document.getElementById("show-fav");
      showAside.addEventListener("click", toggleAside);
      showFavoriteAside(favorites);
    })
    .catch((err) => console.log(err));
};

const initializeFilters = (data) => {
  let filterCategories = [...new Set(data.map((item) => item.category))].sort();
  renderChecks(filterCategories, contentCheck);
  renderSearch(contentCheck);

  contentCheck.addEventListener("change", () => handlerChange(data, colCard));
  contentCheck.addEventListener("submit", (e) => {
    e.preventDefault();
    handlerChange(data, colCard);
  });
};

function classFavoriteHome(favorites) {
  const favEvent = document.getElementById("fav-cards");
  let cards = colCard.querySelectorAll(".card");
  cards.forEach((card) => {
    let eventId = card.getAttribute("key");
    let isFavorite = favorites.some((fav) => fav._id === Number(eventId));
    let heartIcon = card.querySelector(".biFavorite");
    if (isFavorite) {
      heartIcon.classList.add("biFavRed");
    } else {
      heartIcon.classList.remove("biFavRed");
    }
  });
  renderCardsFavorite(favorites, favEvent);
}

function toggleAside() {
  const asideFavorite = document.getElementById("fav-aside");
  asideFavorite.classList.toggle("open");
}

function showFavoriteAside(favorites) {
  let asideFavorite = document.getElementById("fav-aside");
  let favEvent = document.getElementById("fav-cards");

  if (favorites.length > 0) {
    asideFavorite.classList.add("open");
    renderCardsFavorite(favorites, favEvent);
  }
}

let createTemplate = (item) => `
  <div class="col-md-6 px-2 mb-3">
    <div class="card h-100" key="${item._id}" data-favorite="false">
      <img src="${item.image}" class="card-img-top" alt="imagen 2">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.description}</p>
      </div>
      <div class="hstack gap-3 text-center px-2 py-3">
        <div class="p-2 fw-bold">$ ${item.price}</div>
        <div class="p-2 ms-auto">
          <a href="details.html?id=${item._id}">Details</a>
        </div>
      </div>
    </div>
  </div>`;

const renderCards = (array, elementHTML) => {
  elementHTML.innerHTML = array.map(createTemplate).join("");
  arrangeCards();
};

const arrangeCards = () => {
  let container = colCard;
  let items = container.querySelectorAll(".col-md-6");
  items.forEach((item) => (item.style.marginBottom = "0")); // Remove bottom margin
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
};

const createCheckTemplate = (item) => `
  <div class="form-check-inline px-2">
    <input class="form-check-input" type="checkbox" id="${item}" value="${item}">
    <label class="form-check-label" for="${item}">${item}</label>
  </div>`;

const renderChecks = (array, elementHTML) => {
  elementHTML.innerHTML = array.map(createCheckTemplate).join("");
};

const createSearchTemplate = () => `
  <form class="d-inline-block" role="search" method="post">
    <div class="input-group">
      <input class="form-control" type="search" placeholder="Search" aria-label="search" name="search">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
    </div>
  </form>`;

const renderSearch = (elementHTML) => {
  elementHTML.innerHTML += createSearchTemplate();
};

const cheksFiltered = (arr) => {
  let nodeListChecks = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const arrChecks = Array.from(nodeListChecks).map((input) => input.value);
  return arrChecks.length > 0
    ? arr.filter((item) => arrChecks.includes(item.category))
    : arr;
};

const searchFiltered = (arr) => {
  const inputValue = document
    .querySelector('input[type="search"]')
    .value.toLowerCase();
  const normalizedValue =
    inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
  return normalizedValue !== ""
    ? arr.filter((item) => item.name.includes(normalizedValue))
    : arr;
};

const combineFilters = (arr) => {
  const checksFilterResults = cheksFiltered(arr);
  const searchFilterResult = searchFiltered(arr);
  return checksFilterResults.filter((item) =>
    searchFilterResult.includes(item)
  );
};

const handlerChange = (arr, elementHTML) => {
  let combineResults = combineFilters(arr);
  friendlyMessage.style.display = "none";

  const cards = elementHTML.querySelectorAll(".card");

  if (combineResults.length === 0) {
    friendlyMessage.innerHTML =
      "No se encontraron eventos. Intenta con otro nombre o selecciona otras categorías.";
    friendlyMessage.style.display = "block";

    cards.forEach((card) => {
      card.style.display = "none";
    });
  } else {
    combineResults.sort((a, b) => b.price - a.price);

    cards.forEach((card) => {
      const eventId = card.getAttribute("key");
      let matchingEvent = combineResults.find(
        (item) => item._id === Number(eventId)
      );
      card.style.display = matchingEvent ? "block" : "none";
    });

    renderCards(combineResults, elementHTML);
  }
};

const createTemplateFavorite = (item) => `
  <li>
    <div class="card h-100" key="${item._id}" data-favorite="true">
      <img src="${item.image}" class="card-img-top" alt="imagen 2">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text">${item.description}</p>
      </div>
      <div class="hstack gap-3 text-center px-2 py-3">
        <div class="p-2 fw-bold">$ ${item.price}</div>
        <div class="p-2 ms-auto">
          <a href="details.html?id=${item._id}">Details</a>
        </div>
      </div>
    </div>
  </li>`;

const renderCardsFavorite = (array, elementHTML) => {
  elementHTML.innerHTML = array.map(createTemplateFavorite).join("");
};

datos();
