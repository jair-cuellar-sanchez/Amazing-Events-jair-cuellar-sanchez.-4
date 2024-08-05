async function fetchData() {
  return await fetch("https://aulamindhub.github.io/amazing-api/events.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("err >> ", err);
      throw err;
    });
}

fetchData();
