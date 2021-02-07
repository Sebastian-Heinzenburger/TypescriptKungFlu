///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tutils.ts"/>
///<reference path="renderData/Tcirclediagram.ts"/>
///<reference path="renderData/TexperimentalGraph.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tobstacles.ts"/>
///<reference path="renderData/Tbardiagram.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TPerson.ts"/>
///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/src/image/p5.Image.d.ts"/>
var canvas;
var nodeSize;
var globalNodes = [];
var people = [];
var analData = [];
var currentAnalData = {
    HEALTHY: 0,
    INFECTED: 0,
    INFECTIOUS: 0,
    IMMUNE: 0,
    DEAD: 0,
    R: 0,
};
var view = VIEWS.SIMULATION;
var stopped = false;
var paused = false;
var newImg, bg;
// @ts-ignore
var personImage;
function preload() {
    personImage = loadImage('pictures/person.jpg');
    // bg = loadImage('pictures/Klassenzimmer.png');
}
function setup() {
    alert("\nNachricht f\u00FCr Joni\n------------------\nDas ganze ist (immernoch nicht) fertig\nz.B. fehlen noch Schutzma\u00DFnahmen\nHier ist ne Liste mit den Keybindings:\nB: Blockgraph\nF: Fancygraphen\nC: Kreisdiagram\nA: Einstellungen\nP: Pausieren\n\nAu\u00DFerdem kann man f\u00FCr Informationen auf die Leute klicken :)\n    ");
    nodeSize = windowWidth / 39;
    hideSliders();
    for (var x = 0; x <= windowWidth / nodeSize; x++) {
        globalNodes.push([]);
        for (var y = 0; y < windowHeight / nodeSize; y++) {
            globalNodes[x][y] = new PathFinderNode(x, y);
        }
    }
    setupBackground();
    initTimetables();
    //create 15 Persons and store them in a people array
    for (var i = 0; i < 24; i++) {
        people.push(new Person());
    }
    people[0].infectWith(new Virus());
    canvas = createCanvas(windowWidth, windowHeight);
    frameRate(60);
}
function mousePressed(event) {
    if (canvas.style("display") == "none")
        return true;
    //cycle through every person...
    people.forEach(function (person) {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            // person.infectWith(new Virus());
            person.showInfo = Config.fadeTime;
        }
    });
    return true;
}
function keyPressed() {
    switch (key) {
        //just because I got used to pressing a
        case 'a':
        case 'A':
            if (canvas.style("display") == "none") {
                hideSliders();
                canvas.show();
            }
            else {
                canvas.hide();
                showSliders();
            }
            break;
        case 'B':
        case 'b':
            view = view === VIEWS.BARS ? VIEWS.SIMULATION : VIEWS.BARS;
            break;
        case 'S':
        case 's':
            view = VIEWS.SIMULATION;
            break;
        case 'C':
        case 'c':
            view = view === VIEWS.CIRCLE ? VIEWS.SIMULATION : VIEWS.CIRCLE;
            break;
        case 'P':
        case 'p':
            paused = !paused;
            break;
        case 'F':
        case 'f':
            if (view === VIEWS.FANCY2) {
                view = VIEWS.FANCY;
            }
            else {
                view = view === VIEWS.SIMULATION ? VIEWS.FANCY2 : VIEWS.SIMULATION;
            }
            break;
        default:
            return true;
    }
    return true;
}
function draw() {
    if (paused)
        return;
    updateSliderValues();
    //update...
    for (var i = 0; i < Config.speed; i++) {
        currentAnalData = {
            HEALTHY: 0,
            INFECTED: 0,
            INFECTIOUS: 0,
            IMMUNE: 0,
            DEAD: 0,
            // @ts-ignore
            R: parseFloat(getR())
        };
        globalNodes.forEach(function (_gN) {
            _gN.isGood = true;
        });
        baseNodeIndexes.forEach(function (_bNI) {
            try {
                globalNodes[_bNI[0]][_bNI[1]].isGood = false;
            }
            catch (_a) { }
        });
        people.forEach(function (person) {
            person.update();
            // globalNodes[Math.floor(person.position.x/nodeSize)][Math.floor(person.position.y/nodeSize)].isGood = false;
        });
        if (currentAnalData.INFECTIOUS + currentAnalData.INFECTED >= 1) {
            if (frameCount % 2 === 0)
                analData.push(currentAnalData);
        }
        else {
            if (!stopped)
                console.warn(JSON.stringify(analData));
            analData.push(currentAnalData);
            stopped = true;
        }
    }
    //draw
    switch (view) {
        case VIEWS.SIMULATION:
            renderSimulation();
            break;
        case VIEWS.FANCY2:
            renderFancy2();
            break;
        case VIEWS.BARS:
            if (stopped && newImg !== undefined) {
                image(newImg, 0, 0, windowWidth, windowHeight);
                return;
            }
            renderBars();
            break;
        case VIEWS.CIRCLE:
            renderCircle();
            break;
        case VIEWS.FANCY:
            renderFancy();
            break;
    }
}
function renderSimulation() {
    background(36);
    drawBackground();
    // simulationGraphics.image(bg, 0, 0, windowWidth, windowHeight);
    //...and draw each person
    people.forEach(function (person) {
        person.draw();
    });
    strokeWeight(1);
    fill(255);
    noStroke();
    text(deltaTime.toFixed() + " ms per frame", 5, 15);
    text(people.length + " people\n" + Math.floor(windowWidth / nodeSize) + "x" + Math.floor(windowHeight / nodeSize) + " path nodes\ncurrent R: " + getR().toFixed(2), 5, 35);
    try {
        text(Math.floor(mouseX / nodeSize) + ", " + Math.floor(mouseY / nodeSize) + " " + globalNodes[Math.floor(mouseX / nodeSize)][Math.floor(mouseY / nodeSize)].isGood, mouseX, mouseY);
    }
    catch (_a) { }
    strokeWeight(1);
    stroke(255);
    fill(255);
}
