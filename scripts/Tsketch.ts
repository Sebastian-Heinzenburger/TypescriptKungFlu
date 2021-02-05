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
let nodeSize;
let globalNodes = [];
let people = [];
let analData = [];
let currentAnalData = {
      HEALTHY: 0,
      INFECTED: 0,
      INFECTIOUS: 0,
      IMMUNE: 0,
      DEAD: 0
};
let view = VIEWS.SIMULATION;
let stopped = false;
let newImg, bg;
// @ts-ignore
let personImage: p5.Image;

function preload() {

    personImage = loadImage('pictures/person.jpg')
    // bg = loadImage('pictures/Klassenzimmer.png');
}

function setup() {
    nodeSize = windowWidth/39;

    for (let x = 0; x <= windowWidth/nodeSize; x++) {
      globalNodes.push([]);
      for (let y = 0; y < windowHeight/nodeSize; y++) {
        globalNodes[x][y] = new PathFinderNode(x, y);
      }
    }

    setupBackground();
    //create 15 Persons and store them in a people array
    for (let i = 0; i < 30; i++) { people.push(new Person()); }
    people[0].infectWith(new Virus());
    createCanvas(windowWidth, windowHeight);


}

function mousePressed(event) {
 //cycle through every person...
    people.forEach(person => {
        //...and check if its under the mousePointer
        if (dist(person.position.x, person.position.y, event.x, event.y) < 30) {
            //if so, then sneeze in his face!
            // person.infectWith(new Virus());
            person.showInfo = Config.fadeTime;
        }
    });
    return false;
}

function keyPressed() {

  switch (key) {
    //just because I got used to pressing a
    case 'a':
    case 'A':
    //////////////////////////////////////
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
    case 'F':
    case 'f':
      view = view === VIEWS.FANCY ? VIEWS.SIMULATION : VIEWS.FANCY;
      break;
    default:
      return (keyCode===123 || keyCode===116)
  }

  return true;

}

function draw() {

    //update...
    for (let i = 0; i < Config.speed; i++) {
          currentAnalData = {
                HEALTHY: 0,
                INFECTED: 0,
                INFECTIOUS: 0,
                IMMUNE: 0,
                DEAD: 0
          };
        people.forEach(person => {
          person.update();
        });
    }

    //draw
    switch(view) {
      case VIEWS.SIMULATION:
        renderSimulation();
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
    if (currentAnalData.IMMUNE + currentAnalData.DEAD + currentAnalData.HEALTHY < people.length) {
      if (frameCount % 2 === 0) analData.push(currentAnalData);
    } else {
      if (!stopped)
        console.log(JSON.stringify(analData));
      stopped=true;
    }

}

function renderSimulation() {
    background(36);
    drawBackground();
    // simulationGraphics.image(bg, 0, 0, windowWidth, windowHeight);

    //...and draw each person
    people.forEach(person => {
      person.draw();
    });

    strokeWeight(1);
    fill(255);
    noStroke();
    text(`${deltaTime.toFixed()} ms per frame`, 5, 15);
    text(`${Math.floor(mouseX/nodeSize)}, ${Math.floor(mouseY/nodeSize)} ${globalNodes[Math.floor(mouseX/nodeSize)][Math.floor(mouseY/nodeSize)].isGood}`, mouseX, mouseY);
    text(`${people.length} people\n${Math.floor(windowWidth/nodeSize)}x${Math.floor(windowHeight/nodeSize)} path nodes`, 5, 35);
    strokeWeight(1);
    stroke(255);
    fill(255);

}
