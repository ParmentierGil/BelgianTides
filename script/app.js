const URI = "https://www.worldtides.info/api/v2";
const API_KEY = "5a89bf05-34e6-44f2-9450-08781071574e";

let tidesOostende;
let tidesNieuwpoort;
let tidesZeebrugge;

//#region FUNCTIONS

//#endregion


//#region GET

const getTidesOostende = function(){
  handleData(`${URI}?key=${API_KEY}&heights&lat=51.233299&lon=2.933300&extremes&days=1&step=300`, saveTides);
}

const getTidesZeebrugge = function(){
  handleData(`${URI}?key=${API_KEY}&heights&lat=51.331771&lon=3.178751&extremes&days=1&step=300`, saveTides);
}

const getTidesNieuwpoort = function(){
  handleData(`${URI}?key=${API_KEY}&heights&lat=51.154074&lon=2.731029&extremes&days=1&step=300`, saveTides);
}

//#endregion


//#region SHOW

const saveTides = function(obj){
  localStorage.setItem(obj.station, JSON.stringify(obj));

  if (obj.station == "Oostende"){
    tidesOostende = obj;
    showTides(obj);
  }
  else if (obj.station == "ZEEBRUGGE"){
    tidesZeebrugge = obj;
  }
  else if (obj.station == "Nieuwpoort"){
    tidesNieuwpoort = obj;
  }
}

const showTides = function(obj){
  console.log(obj);

  let heights = obj.heights;
  let extremes = obj.extremes;
  let timeNow = Math.round(Date.now() / 100000) * 100 + 7200;

  let station = obj.station;

  let heightNow;
  let isRising;

  console.log(timeNow);

  for (let i = 0; i < heights.length; i++){
    let h = heights[i];
    if (timeNow - 150 <= h.dt && h.dt <= timeNow + 150){
      console.log(h.height);
      heightNow = h.height;
      let nextHeight = heights[i+1].height;

      if (heightNow > nextHeight){
        isRising = false;
      }
      else if (heightNow <= nextHeight) {
        isRising = true;
      }
      break;
    }
  }

  let highExtreme = 0;
  let lowExtreme = 0;

  for (let e of extremes){
    if (e.type == "High"){
      highExtreme = Math.max(highExtreme, e.height);
    }
    else {
      lowExtreme = Math.min(lowExtreme, e.height);
    }
  }

  let tidePercentage = (heightNow + Math.abs(lowExtreme)) / (highExtreme + Math.abs(lowExtreme));
  console.log(highExtreme + Math.abs(lowExtreme));
  console.log(tidePercentage);

  let waveHeight = tidePercentage * 45;
  let neutralHeight = Math.abs(lowExtreme) / (highExtreme + Math.abs(lowExtreme)) * 45;
  
  document.querySelector('.js-max-value').innerHTML = Math.round(highExtreme * 100) / 100;
  document.querySelector('.js-min-value').innerHTML = Math.round(lowExtreme * 100) / 100;
  document.querySelector('.js-actual-value').innerHTML = Math.round(heightNow * 100) / 100;

  if (isRising) {
    document.querySelector('.js-evolution').innerHTML = "Rising &uarr;";
  }
  else {
    document.querySelector('.js-evolution').innerHTML = "Dropping &darr;"
  }

  if (Math.abs(waveHeight - neutralHeight) < 10 || waveHeight > neutralHeight) {
    document.querySelector('.c-tides__height--neutral').classList.add("darker-text")
  }

  if (tidePercentage > 0.8) {
    document.querySelector('.c-tides__height--max').classList.add("darker-text")
  }

  document.querySelector('.c-tides').style.setProperty('--sea-level-height', waveHeight + "%");
  document.querySelector('.c-tides__cliff').style.setProperty('--sea-level-height', waveHeight + "%");

  document.querySelector('.c-tides__height--neutral').style.setProperty("--neutralHeight", neutralHeight + "%");
  
  document.querySelector('.c-location__text').innerHTML = station + ", Belgium";
}

//#endregion


//#region ListenTo

const listenToLocationButtons = function(){
  let buttons = document.querySelectorAll('.c-selection__button');

  for (let button of buttons){
    button.addEventListener('click', function(){
      if (!button.classList.contains("c-selection__button--selected")){
          let prevSelected = document.querySelector(".c-selection__button--selected");
          let prevSelectedNumber = Number(prevSelected.id.substr(7));
          console.log(prevSelectedNumber);

          let nowSelectedNumber = Number(button.id.substr(7));
          console.log(nowSelectedNumber);

          if (button.classList.contains("left-to-right")){
            button.classList.remove("left-to-right");
          }
          else if (button.classList.contains("right-to-left")){
            button.classList.remove("right-to-left");
          }
          

          if ((prevSelectedNumber - nowSelectedNumber) < 0) {
            button.classList.add("left-to-right");
          }
          else {
            button.classList.add("right-to-left");
          }
          if (Math.abs(prevSelectedNumber - nowSelectedNumber) == 2){
            button.style.setProperty("--selection-transition", "double");
          }
          else {
            button.style.setProperty("--selection-transition", "single");
          }       

          document.querySelector(".c-selection__button--selected").classList.remove("c-selection__button--selected");
          button.classList.add("c-selection__button--selected");         

          if (button.value == "oostende"){
            showTides(tidesOostende);
          }
          else if (button.value == "zeebrugge") {
            showTides(tidesZeebrugge);
          }
          else if (button.value == "nieuwpoort") {
            showTides(tidesNieuwpoort);
          }
      }
    });
  }
}

//#endregion

//#region init


const init = function () { 

  if (localStorage.getItem("Oostende") === null || localStorage.getItem("ZEEBRUGGE") === null || localStorage.getItem("Nieuwpoort") === null){
    console.log("here");
    getTidesOostende();
    getTidesNieuwpoort();
    getTidesZeebrugge();
  }
  else {
    tidesOostende = JSON.parse(localStorage.getItem("Oostende"));
    tidesZeebrugge = JSON.parse(localStorage.getItem("ZEEBRUGGE"));
    tidesNieuwpoort = JSON.parse(localStorage.getItem("Nieuwpoort"));
  
    showTides(tidesOostende);
  }

  listenToLocationButtons();
};

document.addEventListener("DOMContentLoaded", function () {
  console.info("Main app page loaded.");
  init();
});
//#endregion