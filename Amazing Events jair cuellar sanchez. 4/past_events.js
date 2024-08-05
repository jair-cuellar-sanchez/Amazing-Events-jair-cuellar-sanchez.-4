let colCard = document.getElementById("colCard");

let contentCheck = document.getElementById("contenCheck");

let biClassFav = document.querySelector(".biFavorites");

const cardsLength = document.getElementById("cardsLength");
let friendlyMessage = document.getElementById("friendlyMessage"); // Nuevo elemento para

const datos = () => {
  fetchData()
    .then((res) => res)
    .then((data) => {
      let dataEvents = data.events;
      let currentDate = data.currentDate;

      let filterPast = dataEvents.filter((item) => item.date < currentDate);

      renderCards(filterPast, colCard);

      const filterCategories = [
        ...new Set(dataEvents.map((item) => item.category)),
      ].sort();

      renderChecks(filterCategories, contentCheck);
      renderSearch(contentCheck);

      let handlerSubmit = (e) => {
        e.preventDefault();
        contentCheck.addEventListener("input", () =>
          handlerChange(filterPast, colCard)
        );
      };
      contentCheck.addEventListener("change", () =>
        handlerChange(filterPast, colCard)
      );
      contentCheck.addEventListener("submit", handlerSubmit);

      //! Favorites
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      function saveFavoritesToLocalStorage() {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }

      function favoriteToggleColor(biClassFav, data) {
        let toggleColor = biClassFav.classList.toggle("biFavRed");
        let cardItem = biClassFav.closest(".card");
        let favEvent = document.getElementById("fav-cards");

        if (!cardItem) return;

        let eventId = cardItem.getAttribute("key");
        let eventItem = data.find((ev) => ev._id === Number(eventId));
        let isFavorite = favorites.some((fav) => fav._id === Number(eventId));

        if (toggleColor && eventItem && !isFavorite) {
          favorites.push(eventItem);
        } else if (!toggleColor && isFavorite) {
          favorites = favorites.filter((fav) => fav._id !== Number(eventId));
        }

        saveFavoritesToLocalStorage();

        if (favorites.length === 0) {
          const asideFavorite = document.getElementById("fav-aside");
          asideFavorite.classList.remove("open");
        }
        return favorites;
      }

      function addCardFavoriteEvent() {
        document.addEventListener("click", (e) => {
          if (e.target.classList.contains("biFavorite")) {
            favoriteToggleColor(e.target, dataEvents);
          }
        });
      }
      addCardFavoriteEvent();

      let dataLength = filterPast.length;
      cardsLength.innerHTML = dataLength;
    })
    .catch((err) => console.log("err >> ", err));
};
datos();

const createCardTemplate = (item) => {
  let template = "";
  template += `<div class="col-md-6">
        <div class="card h-100" id="card" key=${item._id}>
            <img src=${item.image} class="card-img-top" alt="imagen 2">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">
                    ${item.description}
                </p>
            </div>
            <div class="hstack gap-3 text-center px-2 py-3">
                <div class="p-2 fw-bold">$ ${item.price}</div>
                <div class="p-2 ms-auto">
                <a href="details.html?id=${item._id}">Details</a>      
                </div>
            </div>
        </div>
    </div>`;
  return template;
};

const renderCards = (arr, elementHTML) => {
  let structure = "";
  arr.forEach((item) => {
    structure += createCardTemplate(item);
  });
  elementHTML.innerHTML = structure;
};

const createCheckTemplates = (item) => {
  let template = "";
  template += `
        <div class="form-check-inline px-2">
            <input
                class="form-check-input"
                type="checkbox"
                id="${item}"
                value="${item}"
            >
            <label class="form-check-label" for=${item}
                >${item}</label
            >
        </div>
    `;
  return template;
};

const renderChecks = (arr, elementHTML) => {
  let structure = "";
  arr.forEach((item) => {
    structure += createCheckTemplates(item);
  });
  elementHTML.innerHTML = structure;
};

const createSearchTemplate = () => {
  let template = "";
  template = template += `
        <form class="d-inline-block" role="search" method="post">
            <div class="input-group">
                <input
                    class="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    name="search"
                    value=""
                >
                <span class="input-group-text">
                    <i class="bi bi-search"></i>
                </span>
            </div>
        </form>
    `;
  return template;
};

const renderSearch = (elementHTML) => {
  let structure = "";
  structure += createSearchTemplate();
  elementHTML.innerHTML += structure;
  return structure;
};

function checksFilter(arrPast) {
  // checks seleccionados
  const nodeListChecks = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  let arrChecks = Array.from(nodeListChecks).map((input) => input.value);

  let itemFiltered =
    arrChecks.length > 0
      ? arrPast.filter((item) => arrChecks.includes(item.category))
      : arrPast;

  return itemFiltered;
}

function searchFilter(arrPast) {
  const inputValue = document.querySelector('input[type="search"]');
  const valueSearch = inputValue.value.toLowerCase();
  const normalizedValue =
    valueSearch.charAt(0).toUpperCase() + valueSearch.slice(1) || valueSearch;

  let inputSearch =
    normalizedValue !== ""
      ? arrPast.filter((item) => item.name.includes(normalizedValue))
      : arrPast;

  return inputSearch;
}

function combineFilters(arrPast) {
  let checksFilterResults = checksFilter(arrPast);
  let searchFilterResult = searchFilter(arrPast);

  let combined = checksFilterResults.filter((item) =>
    searchFilterResult.includes(item)
  );

  let cardsLength = document.getElementById("cardsLength");
  let dataLength = combined.length;
  cardsLength.innerHTML = dataLength;

  return combined;
}

const handlerChange = (arr, elementHTML) => {
  let combineResults = combineFilters(arr);

  combineResults.sort((a, b) => a.price - b.price);

  friendlyMessage.style.display = "none";

  const cards = elementHTML.querySelectorAll(".card");

  if (combineResults.length === 0) {
    // Mostrar el mensaje amigable
    friendlyMessage.innerHTML =
      "No se encontraron eventos. Intenta con otro nombre o selecciona otras categorías.";
    friendlyMessage.style.display = "block";

    // Ocultar todas las tarjetas
    cards.forEach((card) => {
      card.style.display = "none";
    });
  } else {
    cards.forEach((card) => {
      const eventId = card.getAttribute("key");
      const matchingEvent = combineResults.find(
        (item) => item._id === Number(eventId)
      );
      if (matchingEvent) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

    renderCards(combineResults, elementHTML);
  }
};
