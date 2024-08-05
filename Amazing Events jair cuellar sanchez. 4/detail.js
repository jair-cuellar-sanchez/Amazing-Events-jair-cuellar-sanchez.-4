const queryString = location.search;
let param = new URLSearchParams(queryString);
//* Parametro identificador
let dataDetail = param.get("id");
//* Card
let detailCard = document.getElementById("detailCard");
//* Favorite
let biClassFav = document.querySelector(".biFavorites");

const datos = () => {
  fetchData()
    .then((res) => res)
    .then((data) => {
      let dataEvents = data.events;
      const currentDate = data.currentDate;

      let detail = dataEvents.find(
        (item) => Number(dataDetail) === Number(item._id)
      );

      renderDetailTemplate(detail, currentDate, detailCard);

      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      function saveFavoritesToLocalStorage(favorites) {
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }

      function favoriteToggleColor(biClassFav, arr) {
        let toggleColor = biClassFav.classList.toggle("biFavRed");
        let cardItem = biClassFav.closest(".card");

        let eventItem = arr.find(
          (ev) => Number(cardItem.getAttribute("key")) === ev._id
        );

        if (toggleColor) {
          favorites.push(eventItem);
        } else {
          favorites = favorites.filter(
            (fav) => fav._id !== Number(eventItem._id)
          );
        }

        saveFavoritesToLocalStorage(favorites);
      }

      function addCardFavoriteEvent() {
        document.addEventListener("click", (e) => {
          if (e.target.classList.contains("biFavorite")) {
            favoriteToggleColor(e.target, dataEvents);
          }
        });
      }

      addCardFavoriteEvent();
    })
    .catch((err) => console.log(err));
};

datos();

function createDetailTemplate(item, current) {
  let template = "";
  template = `
        <div class="card " key=${item._id}>
            <div class="row g-0 align-item-center justify-content-evenly align-content-around">
                <div class="col-md-6">
                    <img
                        src=${item.image}
                        class="img-fluid w-100 h-100"
                        alt=${item.name}
                    >
                </div>
                <div class="col-md-4">
                    <div class="card-body dataBody">
                    
                        <h4 class="card-title text-center">
                            ${item.name}
                        </h4>
                        <ul>
                            <li>Date: <span>${item.date}</span></li>
                            <li>Place: <span>${item.place}</span></li>
                            <li>Capacity: <span>${item.capacity}</span></li>
                            <li>
                                ${
                                  item.date < current
                                    ? `Assistance: <span>${item.assistance}</span>`
                                    : `Estimate: <span>${item.estimate}</span>`
                                }
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
  return template;
}

function renderDetailTemplate(item, current, elementHTML) {
  let structure = "";
  structure += createDetailTemplate(item, current);
  elementHTML.innerHTML = structure;
  return structure;
}

//*--------------------------------------------
