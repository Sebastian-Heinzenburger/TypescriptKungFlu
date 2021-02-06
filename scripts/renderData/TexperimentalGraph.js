///<reference path="../../../../.config/JetBrains/WebStorm2020.3/javascript/extLibs/global-types/node_modules/@types/p5/global.d.ts"/>
///<reference path="../Tutils.ts"/>
function renderFancy() {
    background(60);
    noFill();
    strokeWeight(3);
    stroke(0, 0, 255);
    drawCurve("HEALTHY");
    stroke(20, 100, 20);
    drawCurve("INFECTED");
    stroke(0, 255, 0);
    drawCurve("INFECTIOUS");
    stroke(255, 255, 0);
    drawCurve("IMMUNE");
    stroke(10, 10, 10);
    drawCurve("DEAD");
    noStroke();
    fill(255);
    text(deltaTime, 10, 10);
}