const datos = () => {
  fetchData()
    .then((res) => res)
    .then((data) => {
      const dataEvents = data.events;
      const currentDate = data.currentDate;

      let cell1 = document.querySelector(
        "#table-1 tbody tr:nth-child(2) td:nth-child(1)"
      );
      let cell2 = document.querySelector(
        "#table-1 tbody tr:nth-child(2) td:nth-child(2)"
      );
      let cell3 = document.querySelector(
        "#table-1 tbody tr:nth-child(2) td:nth-child(3)"
      );

      const table2 = document.getElementById("table-2");
      const table3 = document.getElementById("table-3");

      let filterPast = dataEvents.filter((item) => item.date < currentDate);

      let filterUpcoming = dataEvents.filter((item) => item.date > currentDate);

      let eventPlusAssistance = plusAssistanceEvent(filterPast);
      let percentAssistPlus = (
        (eventPlusAssistance.assistance / eventPlusAssistance.capacity) *
        100
      ).toFixed(2);

      let minusAssistance = minusAssistanceEvent(filterPast);
      let percentAssistMinus = (
        (minusAssistance.assistance / minusAssistance.capacity) *
        100
      ).toFixed(2);

      let highestCapacityEvent = plusCapacityEvent(dataEvents);

      let highestAssistanceEvent = `${eventPlusAssistance.name} - ${percentAssistPlus}%`;
      let lowestAssistanceEvent = `${minusAssistance.name} - ${percentAssistMinus}%`;
      let highestCapacity = `${
        highestCapacityEvent.name
      } - ${highestCapacityEvent.capacity.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`;

      cell1.textContent = highestAssistanceEvent;
      cell2.textContent = lowestAssistanceEvent;
      cell3.textContent = highestCapacity;

      const arrTotalUpCategories = comingEventsStatistics(filterUpcoming);
      renderTable2Template(arrTotalUpCategories, table2);

      const arrTotalPerCategories = pastEventsStatistics(filterPast);
      renderTable3Template(arrTotalPerCategories, table3);
    })
    .catch((err) => console.log("err :", err));
};
datos();

function plusAssistanceEvent(arr) {
  let plusAssistanceEvent = null;
  let plusNumberAssistance = 0;

  arr.forEach((item) => {
    if (item.assistance / item.capacity > plusNumberAssistance) {
      plusNumberAssistance = item.assistance / item.capacity;
      plusAssistanceEvent = item;
    }
  });
  return plusAssistanceEvent;
}

function minusAssistanceEvent(arr) {
  let minusAssistanceEvent = null;
  let minusNumberAssistance = Infinity;

  arr.forEach((item) => {
    if (
      item.assistance >= 0 &&
      item.assistance / item.capacity < minusNumberAssistance
    ) {
      minusNumberAssistance = item.assistance / item.capacity;
      minusAssistanceEvent = item;
    }
  });

  return minusAssistanceEvent;
}

function plusCapacityEvent(arr) {
  let capacityEvent = null;
  let capacityNumber = 0;

  arr.forEach((item) => {
    if (item.capacity > capacityNumber) {
      capacityNumber = item.capacity;
      capacityEvent = item;
    }
  });
  return capacityEvent;
}

function comingEventsStatistics(arr) {
  const statistics = arr.reduce((acc, item) => {
    const { category, price, estimate, capacity } = item;

    if (!acc[category]) {
      acc[category] = {
        revenues: 0,
        estimate: 0,
        capacity: 0,
        eventCount: 0,
        percentageEstimate: 0,
      };
    }

    acc[category].revenues += price * estimate;
    acc[category].estimate += estimate;
    acc[category].capacity += capacity;
    acc[category].eventCount += 1;

    const eventPercentage = (estimate / capacity) * 100;
    acc[category].percentageEstimate += eventPercentage;

    return acc;
  }, []);

  for (let category in statistics) {
    const { percentageEstimate, eventCount } = statistics[category];
    //accedo a propiedad y le seteo el porcentaje
    statistics[category].percentageEstimate = percentageEstimate / eventCount;
  }

  return statistics;
}

function createTable2Template(keyItem, item) {
  let template = "";
  template += `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${item.revenues.toLocaleString()}</td>
            <td>${item.percentageEstimate.toFixed(2)} %</td>
        </tr>
        `;
  return template;
}

function renderTable2Template(item, elementHTML) {
  let structure = "";
  for (let category in item) {
    structure += createTable2Template(category, item[category]);
  }
  elementHTML.innerHTML = structure;
  return structure;
}

function pastEventsStatistics(arr) {
  let statistics = arr.reduce((acc, item) => {
    const { category, price, assistance, capacity } = item;

    if (!acc[category]) {
      acc[category] = {
        revenues: 0,
        assistance: 0,
        capacity: 0,
        eventCount: 0,
        percentageAssistance: 0,
      };
    }

    acc[category].revenues += price * assistance;
    acc[category].assistance += assistance;
    acc[category].capacity += capacity;
    acc[category].eventCount += 1;

    const eventPercentage = (assistance / capacity) * 100;
    acc[category].percentageAssistance += eventPercentage;

    return acc;
  }, []);

  for (let category in statistics) {
    const { percentageAssistance, eventCount } = statistics[category];
    //accedo a propiedad y le seteo el porcentaje
    statistics[category].percentageAssistance =
      percentageAssistance / eventCount;
  }

  return statistics;
}

function createTable3Template(keyItem, item) {
  let template = "";
  template += `
        <tr>
            <td>${keyItem}</td>
            <td>$ ${item.revenues.toLocaleString()}</td>
            <td>${item.percentageAssistance.toFixed(2)} %</td>
        </tr>
        `;
  return template;
}

function renderTable3Template(item, elementHTML) {
  let structure = "";
  for (let category in item) {
    structure += createTable3Template(category, item[category]);
  }
  elementHTML.innerHTML = structure;
  return structure;
}
