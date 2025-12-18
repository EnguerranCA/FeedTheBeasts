let Place = {};

let latestPlaces = [];

Place.getAll = function () {
  return data;
};

Place.getRandomPlace = async function () {
  let newPlace;
  // Fetch a random place and fetch again if the place has already been asked
  do {
    let response = await fetch("https://mmi.unilim.fr/~savary23/Let_Him_Quizz/api/place?param=random");
    newPlace = await response.json();
  } while (latestPlaces.includes(newPlace.id));

  // Format place
  let placeImage = newPlace.img;
  let propositions = [
    newPlace.reponse1,
    newPlace.reponse2,
    newPlace.reponse3,
    newPlace.reponse4,
  ];

  // Add the id of the place to the latestPlaces array
  latestPlaces.push(newPlace.id);

  // If the latestPlaces array is greater than 10, remove the first element
  if (latestPlaces.length > 10) {
    latestPlaces.shift();
  }

  return { placeImage, propositions };
};

export { Place };