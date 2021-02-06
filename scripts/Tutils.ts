///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tsketch.ts"/>
enum HEALTH {
    HEALTHY,
    INFECTED,
    INFECTIOUS,
    IMMUNE,
    DEAD
}

let SLIDERS = {
    // @ts-ignore
    speedSlider: p5.Element,
    // @ts-ignore
    fadeoutSlider: p5.Element,
}

function hideSliders() {
    select("#sliderD").hide();
}

function showSliders() {
    select("#sliderD").show();
}

function updateSliderValues() {
    Config.speed = SLIDERS.speedSlider.value();
    Config.fadeTime = SLIDERS.fadeoutSlider.value();
}

Object.freeze(HEALTH);

enum VIEWS {
    SIMULATION,
    BARS,
    CIRCLE,
    FANCY
}

 const Config = {
    speed:  1,
    fadeTime: 400,

 }

 function neq(o, t) {
   if (!o || !t) return true;
    if (o.x != t.x) {
        return true;
    }
    return o.y != t.y;

 }

 function listCopy(_from: PathFinderNode[][]): PathFinderNode[][] {
     let _new = [];

     for (let x = 0; x < _from.length-1; x++) {
         _new.push([]);
         for (let y = 0; y < _from[x].length-1; y++) {
            _new[x][y] = _from[x][y].copy();
         }
     }
     return _new;
 }


 function getR(){
    let _r = 0;
    people.forEach(person => {
        _r += person.infectedPeople;
    });
    return (_r/(people.length - currentAnalData.HEALTHY - currentAnalData.INFECTED)).toFixed(2)
 }


function drawCurve(_healthtype) {
  beginShape();
  let o, n;
  for (let i = 1; i < windowWidth && i < analData.length; i++) {
    n = windowHeight-analData[Math.floor(i*(analData.length/windowWidth))][_healthtype]*(windowHeight/people.length);
    if (o && o!= n)
      vertex(i, o)
      vertex(i, n);
    o = n;
  }
  endShape();
}

// function drawCurve(_healthType) {
//   var scaleY = (windowHeight/people.length);
//   var n = (analData.length/100)+1;
//   var scaleX = windowWidth/(analData.length/n);
//   for (var i = Math.floor(n); analData.length>i+n+n; i+=Math.floor(n)) {
//     //one
//     var x1 = i-Math.floor(n);
//     var y1 = analData[x1][_healthType] * scaleY;
//     //two
//     var x2 = i;
//     var y2 = analData[x2][_healthType] * scaleY;
//
//     line(x1*scaleX, windowHeight - y1, x2*scaleX, windowHeight - y2);
//     // curve(x1*scaleX, windowHeight-y1, x2*scaleX,windowHeight-y2, x3*scaleX,windowHeight-y3, x4 *scaleX,windowHeight-y4);
//   }
// }




// function drawCurve(_healthType) {
//
//   var scaleY = (windowHeight/people.length);
//   var stepSize = 1;
//   var scaleX = 2;
//   for (var i = stepSize; i < analData.length-stepSize; i+=stepSize) {
//       var x1 = i-stepSize;
//       var y1 = analData[x1][_healthType] * scaleY;
//
//       var x2 = i;
//       var y2 = analData[x2][_healthType] * scaleY;
//
//       line(x1 * scaleX, windowHeight - y1, x2 * scaleX, windowHeight - y2);
//   }
// }


//
// function drawCurve(_healthType) {
//
//   var scaleY = (windowHeight/people.length);
//   var stepSize = analData.length/4;
//   var scaleX = 1;
//   // var scaleX = windowWidth/10;
//
//   var x1;
//   var y1;
//
//   beginShape();
//   for (var i = stepSize; i < analData.length-stepSize; i+=stepSize) {
//       x1 = Math.floor(i);
//       y1 = analData[x1][_healthType] * scaleY;
//
//       vertex((x1) * scaleX, windowHeight - y1);
//       console.log((x1) * scaleX, windowHeight - y1);
//   }
//   // vertex(x1*scaleX, windowHeight);
//   endShape();
// }
