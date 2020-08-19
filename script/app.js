const URI = "https://www.worldtides.info/api/v2";
const API_KEY = "5a89bf05-34e6-44f2-9450-08781071574e";

const MAX_HEIGHT_WAVE = 200;
const MIN_HEIGHT_WAVE = 10;

//#region FUNCTIONS

//#endregion


//#region GET

const getTides = function(){
  handleData(`${URI}?key=${API_KEY}&heights&lat=51.233299&lon=2.933300&extremes&days=1&step=300`,showTides);
}

//#endregion


//#region SHOW

const showTides = function(obj){
  console.log(obj);

  let heights = obj.heights;
  let extremes = obj.extremes;
  let timeNow = Math.round(Date.now() / 100000) * 100 + 7200;

  let station = obj.station;

  let heightNow;

  console.log(timeNow);

  for (let h of heights){
    if (timeNow - 150 <= h.dt && h.dt <= timeNow + 150){
      console.log(h.height);
      heightNow = h.height;
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

  let waveHeight = tidePercentage * MAX_HEIGHT_WAVE;
  let neutralHeight = Math.abs(lowExtreme) / (highExtreme + Math.abs(lowExtreme)) * MAX_HEIGHT_WAVE;
  
  document.querySelector('.js-max-value').innerHTML = highExtreme;
  document.querySelector('.js-min-value').innerHTML = lowExtreme;
  document.querySelector('.js-actual-value').innerHTML = heightNow;

  document.querySelector('.c-tides').style.setProperty('--sea-level-height', waveHeight + "px");
  document.querySelector('.c-tides__cliff').style.setProperty('--sea-level-height', waveHeight + "px");

  document.querySelector('.c-tides__neutral').style.top = "calc(100% - " + (neutralHeight + 13) + "px)";
  
  document.querySelector('.c-location__text').innerHTML = station + ", Belgium";
}

//#endregion


//#region ListenTo

//#endregion

//#region init


const init = function () {
  getTides();
};

document.addEventListener("DOMContentLoaded", function () {
  console.info("Main app page loaded.");
  init();
});
//#endregion