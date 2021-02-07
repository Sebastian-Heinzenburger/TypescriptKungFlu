///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tsketch.ts"/>
var HEALTH;
(function (HEALTH) {
    HEALTH[HEALTH["HEALTHY"] = 0] = "HEALTHY";
    HEALTH[HEALTH["INFECTED"] = 1] = "INFECTED";
    HEALTH[HEALTH["INFECTIOUS"] = 2] = "INFECTIOUS";
    HEALTH[HEALTH["IMMUNE"] = 3] = "IMMUNE";
    HEALTH[HEALTH["DEAD"] = 4] = "DEAD";
})(HEALTH || (HEALTH = {}));
// let Tables = [
//
//     [globalNodes[2][5],
//     globalNodes[5][5],
//     globalNodes[2][7],
//     globalNodes[7][7],
//     globalNodes[3][9],
//     globalNodes[6][9]],
//
//     [globalNodes[23][4],
//     globalNodes[23][7],
//     globalNodes[30][4],
//     globalNodes[30][8]],
//
// ]
var timeTables = [];
function hideSliders() {
    select("#sliderD").hide();
}
function showSliders() {
    console.log("shippingw");
    select("#sliderD").show();
}
function updateSliderValues() {
    Config.speed = select("#speedSlider").value();
    Config.fadeTime = select("#fadeoutSlider").value();
    while (people.length > select("#people").value()) {
        people.pop();
    }
    while (people.length < select("#people").value()) {
        people.push(new Person());
    }
    // @ts-ignore
    if (select("#override").checked()) {
        people.forEach(function (person) {
            person.virus.tLatenz = select("#latenz").value();
            person.virus.tIncubation = select("#incubation").value();
            person.virus.tRekonvaleszenz = select("#recon").value();
            person.virus.rLetalitaet = select("#letalitaet").value() / 100;
        });
    }
}
Object.freeze(HEALTH);
var VIEWS;
(function (VIEWS) {
    VIEWS[VIEWS["SIMULATION"] = 0] = "SIMULATION";
    VIEWS[VIEWS["BARS"] = 1] = "BARS";
    VIEWS[VIEWS["CIRCLE"] = 2] = "CIRCLE";
    VIEWS[VIEWS["FANCY"] = 3] = "FANCY";
    VIEWS[VIEWS["FANCY2"] = 4] = "FANCY2";
})(VIEWS || (VIEWS = {}));
var Config = {
    speed: 1,
    fadeTime: 400,
};
function neq(o, t) {
    if (!o || !t)
        return true;
    if (o.x != t.x) {
        return true;
    }
    return o.y != t.y;
}
function listCopy(_from) {
    var _new = [];
    for (var x = 0; x < _from.length - 1; x++) {
        _new.push([]);
        for (var y = 0; y < _from[x].length - 1; y++) {
            _new[x][y] = _from[x][y].copy();
        }
    }
    return _new;
}
function getR() {
    var _r = 0;
    people.forEach(function (person) {
        _r += person.infectedPeople;
    });
    return (_r / (people.length - currentAnalData.HEALTHY - currentAnalData.INFECTED)).toFixed(2);
}
// function drawCurve(_healthtype) {
//   beginShape();
//   let o, n;
//   for (let i = 1; i < windowWidth && i < analData.length; i++) {
//     n = windowHeight-analData[Math.floor(i*(analData.length/windowWidth))][_healthtype]*(windowHeight/people.length);
//     console.log(n)
//     if (o && o!= n)
//       vertex(i, o)
//       vertex(i, n);
//     o = n;
//   }
//   endShape();
// }
function drawLines(_healthType) {
    // beginShape()
    var o = analData[0][_healthType];
    var io = 0;
    for (var i = 0; i < analData.length; i++) {
        if (o !== analData[i][_healthType]) {
            line((windowWidth / analData.length) * io, windowHeight - (windowHeight / people.length) * o, (windowWidth / analData.length) * i, windowHeight - (windowHeight / people.length) * analData[i][_healthType]);
            o = analData[i][_healthType];
            io = i;
        }
    }
    line((windowWidth / analData.length) * io, windowHeight - (windowHeight / people.length) * o, windowWidth, windowHeight - (windowHeight / people.length) * currentAnalData[_healthType]);
}
function drawCurve(_healthType) {
    var o = analData[0][_healthType];
    var io = 0;
    for (var i = 0; i < analData.length; i++) {
        if (o !== analData[i][_healthType]) {
            line((windowWidth / analData.length) * io, windowHeight - (windowHeight / people.length) * o, (windowWidth / analData.length) * i, windowHeight - (windowHeight / people.length) * o);
            line((windowWidth / analData.length) * i, windowHeight - (windowHeight / people.length) * o, (windowWidth / analData.length) * i, windowHeight - (windowHeight / people.length) * analData[i][_healthType]);
            o = analData[i][_healthType];
            io = i;
        }
    }
    line((windowWidth / analData.length) * io, windowHeight - (windowHeight / people.length) * o, windowWidth, windowHeight - (windowHeight / people.length) * currentAnalData[_healthType]);
}
//
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
