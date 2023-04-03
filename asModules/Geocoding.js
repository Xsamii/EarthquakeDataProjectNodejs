const searchList = document.querySelector("#results-list");
const searchDiv = document.querySelector(".search-results");
export let gCodingFeatures = [];
let timer;

export async function inputHandler(place) {
  clearInterval(timer);
  timer = setTimeout(() => {
    geoCodingApiHandler(place).then((res) => {
      gCodingFeatures = res.features;
      renderGeoCodingFeature(gCodingFeatures);
    });
  }, 300);
}
async function geoCodingApiHandler(place) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=
    ${place}&format=geojson`);
    return await res.json();
  } catch (err) {
    console.log(err);
  }
}

function renderGeoCodingFeature(gCodingFeatures) {
  searchList.innerHTML = "";
  searchDiv.style.display = "block";
  gCodingFeatures.forEach((feat) => {
    let li = document.createElement("li");
    const fName = feat.properties.display_name.split(",");
    if (fName.length > 1) {
      li.innerHTML = `${fName[0]},${fName[1]}`;
    } else {
      li.innerHTML = `${fName[0]}`;
    }

    li.value = feat.properties.osm_id;
    li.id = "result-place";
    searchList.append(li);
  });
}
