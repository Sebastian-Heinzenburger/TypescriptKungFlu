///<reference path="../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="Tutils.ts"/>
///<reference path="TastarLib.ts"/>
///<reference path="TVirus.ts"/>
///<reference path="Tsketch.ts"/>
class Person {


  // @ts-ignore
  private position: p5.Vector;
  // @ts-ignore
  private velocity: p5.Vector;
  private state: number;
  size: number;
  localTimer: number;
  infectRadius: number;
  virus: Virus;
  pathFinder: AStar;
  showInfo: number;
  timeTable: PathFinderNode[];

  constructor() {
    this.position = createVector(random(windowWidth), random(windowHeight));
    this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.state = HEALTH.HEALTHY;
    this.size = 30;
    this.localTimer = 0;
    this.infectRadius = this.size + 2;
    this.virus = null;
    this.pathFinder = new AStar();


    this.pathFinder.nodes = [];
    globalNodes.forEach(n => {
      this.pathFinder.nodes.push(n);
    });
    this.pathFinder.startNode = globalNodes[Math.floor(this.position.x/nodeSize)][Math.floor(this.position.y/nodeSize)+1]

  }

  update() {
    this.handleMovement();
    this.handleOthers();
    this.checkTime();
    this.addSelfToAnalytics();
  }

  addSelfToAnalytics() {
    switch (this.state) {
      case HEALTH.HEALTHY:
        currentAnalData.HEALTHY++;
        break;
      case HEALTH.INFECTED:
        currentAnalData.INFECTED++;
        break;
      case HEALTH.INFECTIOUS:
        currentAnalData.INFECTIOUS++;
        break;
      case HEALTH.IMMUNE:
        currentAnalData.IMMUNE++;
        break;
      case HEALTH.DEAD:
        currentAnalData.DEAD++;
        break;
    }
  }

  checkTime() {

    //wenn du nicht krank bist, lebe glücklich weiter
    if (this.state !== HEALTH.INFECTIOUS && this.state !== HEALTH.INFECTED) return;

    //Symptome?
    if (this.state === HEALTH.INFECTIOUS) {

      //für jedes Symptom
      for (let symptom in this.virus.symptoms) {
        if (random(1) < this.virus.symptoms[symptom]) {
          this.infectRadius = 60;
        }
      }
    }

    //update Timer
    this.localTimer++;

    //update infectRadius
    if (this.infectRadius > this.size + 2) this.infectRadius -= 0.5;

    //Check if gonna die
    if (round(this.virus.tRekonvaleszenz + this.virus.tIncubation) === this.localTimer) {
      if (random(1) < this.virus.rLetalitaet) {
        this.state = HEALTH.DEAD;
      } else {
        this.state = HEALTH.IMMUNE;
      }
    }

    //check if its time to start sneezing
    if (this.state === HEALTH.INFECTED) {
      if (this.localTimer === round(this.virus.tLatenz)) {
        this.state = HEALTH.INFECTIOUS;
      }
    }

  }

  handleOthers() {
    if (this.state === HEALTH.INFECTIOUS) {
      //cycle through every person...
      people.forEach(person => {
        //dont spontaneously self-infect
        if (person === this) return;
        //if in reach
        if (dist(person.position.x, person.position.y, this.position.x, this.position.y) < this.infectRadius) {
          //and not dead
          if (person.state === HEALTH.HEALTHY) {
            person.infectWith(this.virus.get());
          }
        }
      });
    }
  }

  handleMovement() {
    //dont move if ya dead
    if (this.state === HEALTH.DEAD) return;

    //if its the first time, pick a random endnote TODO:
    if (!this.pathFinder.endNode) {
      this.pathFinder.randomEndNode(this);
    }

    //refresh the startNode
    this.pathFinder.startNode = this.pathFinder.nodes[Math.floor(this.position.x / nodeSize)][Math.floor(this.position.y / nodeSize)];


    //
    // this.pathFinder.endNode = this.pathFinder.nodes[Math.floor(mouseX / nodeSize)][Math.floor(mouseY / nodeSize)];
    //

    //falls man den pfad neuberechnen sollte
    if (!this.pathFinder.nextN || ((this.position.x / nodeSize >= this.pathFinder.nextN.x - nodeSize * 0.5)
        && (this.position.x / nodeSize <= this.pathFinder.nextN.x + nodeSize * 0.5)
        &&
        (this.position.y / nodeSize >= this.pathFinder.nextN.y - nodeSize * 0.5)
        && (this.position.y / nodeSize <= this.pathFinder.nextN.y + nodeSize * 0.5))
        //Math.floor(this.position.y / nodeSize) == this.pathFinder.startNode.y && this.pathFinder.startNode.x + nodeSize * 0.2 <= this.position.x / nodeSize <= this.pathFinder.startNode.x - nodeSize * 0.2
    ) {

      this.pathFinder.nodes = [];
      globalNodes.forEach(n => {
        this.pathFinder.nodes.push(n);
      });

      //berechne den Pfad
      if (this.pathFinder.getPath(this.pathFinder.nodes)) {

        //reconstructing the path:
        //the current node we are looking at
        let n = this.pathFinder.endNode;
        //the node before that
        this.pathFinder.nextN = this.pathFinder.endNode;
        //reconstruct the path and store the nodes
        while (n.daddy != null && n.daddy !== this.pathFinder.startNode) {
          this.pathFinder.nextN = n;
          n = n.daddy;
        }
        this.pathFinder.nextN = n;
        //if theres noooo path:
      } else {
        this.pathFinder.nextN = this.pathFinder.startNode;
      }
    }

    //if we didnt reached the goal yet
    if (this.pathFinder.startNode !== this.pathFinder.endNode) {

      //move in the direction of the center of the next node!!
      this.velocity = createVector(
          ((this.pathFinder.nextN.x + 0.5) * nodeSize) - this.position.x,
          ((this.pathFinder.nextN.y + 0.5) * nodeSize) - this.position.y,
      );
      this.velocity.mult(0.2);
      this.position.add(this.velocity);
    } else {
      this.pathFinder.randomEndNode(this);
    }

  }

  infectWith(virus) {
    //if healthy
    if (this.state !== HEALTH.HEALTHY) return;
    //infect self with given Virus
    this.localTimer = 0;
    this.virus = virus;
    this.state = HEALTH.INFECTED;
  }

  getInfo() {
    if (!this.virus) return `
im healthy
`

    return `
______VIRUS_______
- Latenzzeit: ${this.virus.tLatenz.toFixed(1)}
- Incubationszeit:${this.virus.tIncubation.toFixed(1)}
- Rekonvaleszenzzeit:${this.virus.tRekonvaleszenz.toFixed(1)}
- Symptome:
${this.virus.symptoms.toString()}
`

  }

  drawInfo(c) {
    let _m = createVector(mouseX - this.position.x, mouseY - this.position.y);
    _m.limit(60);

    let _h = _m.y > 0 ? 200 : -200;
    let _w = _m.x > 0 ? 160 : -160;
    let _x = this.position.x + _m.x;
    let _y = this.position.y + _m.y;

    let _x_padding = 10;
    let _y_padding = 3;
    let _tx = _w > 0 ? _x + _x_padding : _x + _w - _x_padding + 15;
    let _ty = _h > 0 ? _y + _y_padding : _y + _h - _y_padding + 5;

    if (this.showInfo > 0) {
      this.showInfo--;
      fill(color(60, this.showInfo));
      stroke(red(c), green(c), blue(c), this.showInfo);
      strokeWeight(2);
      rect(_x, _y, _w, _h, 5);
      line(this.position.x, this.position.y, _x, _y);
      noStroke();
      c.setAlpha(this.showInfo);
      fill(c);
      text(this.getInfo(), _tx, _ty);
    }
  }

  draw() {
    //get color according to health
    let c = this.getHealthColor();
    c.setAlpha(100);

    //draw ellipse
    fill(c);
    ellipse(this.position.x, this.position.y, personImage.height * 1.5, personImage.height * 1.5)

    this.drawInfo(c)

    //draw image
    noFill();
    image(personImage, this.position.x - personImage.width * 0.5, this.position.y - personImage.height * 0.5);

    //if not dead
    // if (!(this.state == HEALTH.DEAD || this.state == HEALTH.IMMUNE)) {
    if (this.state === HEALTH.INFECTIOUS) {
      //draw infect radius
      c.setAlpha(90);
      fill(c);
      ellipse(this.position.x, this.position.y, this.infectRadius, this.infectRadius);
    }

    //debug text
    // simulationGraphics.fill(255);
    // simulationGraphics.text(this.state, this.position.x+20, this.position.y);
    // simulationGraphics.text(this.localTimer, this.position.x+20, this.position.y+20);
  }

  //return color according to current health
  getHealthColor() {
    switch (this.state) {
      case HEALTH.HEALTHY:
        return color(0, 0, 255);      //blue
      case HEALTH.IMMUNE:
        return color(255, 255, 0);    //yellow?
      case HEALTH.INFECTED:
        return color(20, 100, 20);      //dark green
      case HEALTH.INFECTIOUS:
        return color(0, 255, 0);    //green
      case HEALTH.DEAD:
        return color(10, 10, 10);     //black
    }
  }

}
