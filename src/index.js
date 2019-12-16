import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
const canvasDOM = document.getElementById("viewerCanvas");

let density = window.devicePixelRatio || 1;
let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;

let first = true;

const app = new PIXI.Application({
    view: viewerCanvas,
    resolution: density,
    autoDensity: true,
    antialias: true,
    transparent: true,
    width: innerWidth,
    height: innerHeight
});
app.renderer.autoResize = true;
app.renderer.resize(innerWidth, innerHeight);

app.loader.add([
    {name: 'headerBack', url: 'src/images/header.png'},
    {name: 'showdownOff', url: 'src/images/showdown-off.png'},
    {name: 'spinnerButton', url: './src/images/btn-spin.png'},
    {name: 'spinnerWheel', url: './src/images/wheel.png'},
    {name: 'spinnerMarker', url: './src/images/marker.png'}
]).on("progress", loadProgressHandler).load(spriteSetup);

const stage = new PIXI.Container();
stage.width = app.renderer.width;
stage.height = app.renderer.height;
app.stage.addChild(stage);

// const holder = app.stage.addChild(new PIXI.Container());
// centerThis(holder);

// const showdownContainer = new PIXI.Container();
// centerThis(showdownContainer);

// const backgroundContainer = new PIXI.Container();
// centerThis(backgroundContainer);

function spriteSetup() {
    // declare
    const headerBox = new PIXI.Container();
    const headerAnimationBox = new PIXI.Container();
    
    const headerSprite = new PIXI.Sprite(app.loader.resources.headerBack.texture);
    const showdownOffSprite = new PIXI.Sprite(app.loader.resources.showdownOff.texture);
    const spinnerBox = new PIXI.Container();
    const wheelSprite = new PIXI.Sprite(app.loader.resources.spinnerWheel.texture);
    const markerSprite = new PIXI.Sprite(app.loader.resources.spinnerMarker.texture);
    const buttonSprite = new PIXI.Sprite(app.loader.resources.spinnerButton.texture);

    // modify
    headerBox.width = innerWidth;
    headerBox.height = innerHeight*0.4;
    headerBox.pivot.x = (innerWidth)/2;
    headerBox.pivot.y = (innerHeight*0.4)/2;
    moveHeaderToTop(headerBox);
    
    headerSprite.anchor.set(0.5);
    headerSprite.width = innerWidth*1.2;
    headerSprite.height = innerHeight*0.4;
    centerAtMiddle(headerSprite);

    centerAtMiddle(headerAnimationBox);

    showdownOffSprite.anchor.set(0.5);
    showdownOffSprite.position.set(0,0);
    keepLightsScaled(showdownOffSprite);

    spinnerBox.width = innerWidth;
    spinnerBox.height = innerHeight*0.6;
    spinnerBox.pivot.x = (innerWidth/2);
    spinnerBox.pivot.y = (innerHeight*0.6)/2;
    moveSpinnerToBottom(spinnerBox);

    wheelSprite.anchor.set(0.5);
    keepWheelSquare(wheelSprite);
    wheelSprite.position.set(0,(wheelSprite.width*0.1));

    app.ticker.add((delta) => {
        if (spinRequested || spinTime) {
            wheelSprite.rotation += 0.02 * delta;
        } else {
            return;
        }
    });

    let wheelWidth = wheelSprite.width;
    let markerOffsetX = wheelWidth/2.8;
    let markerOffsetY = (wheelWidth/-2.8)+(wheelSprite.width*0.1);
    markerSprite.anchor.set(0.5);
    markerSprite.position.set(markerOffsetX, markerOffsetY)
    markerSprite.width = wheelWidth*0.15;
    markerSprite.height = wheelWidth*0.3;
    markerSprite.rotation = 0.75;

    let buttonOffset = wheelWidth/-1.75;
    buttonSprite.anchor.set(0.5);
    buttonSprite.position.set(0,buttonOffset)
    buttonSprite.width = wheelWidth;
    buttonSprite.height = wheelWidth*0.2;
    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.on(touchType, (event) => {
        if (!spinRequested) {
            spinRequested = true;
            setData();
        } else {
            return;
        }
    });

    spinnerBox.addChild(wheelSprite);
    spinnerBox.addChild(markerSprite);
    spinnerBox.addChild(buttonSprite);

    headerAnimationBox.addChild(showdownOffSprite);

    headerBox.addChild(headerSprite);
    headerBox.addChild(headerAnimationBox);
    
    if (!first) {
        stage.removeChildren();
    }
    first = false;

    stage.addChild(headerBox);
    stage.addChild(spinnerBox);
}

function fillWindow() {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;
    canvasDOM.style.width = innerWidth;
    canvasDOM.style.height = innerHeight;
    app.view.style.width = innerWidth;
    app.view.style.height = innerHeight;
    app.view.width = innerWidth;
    app.view.height = innerHeight;
    app.renderer.resize(innerWidth, innerHeight);
};

function consolidatedScaler () {
    fillWindow();
    spriteSetup();
}

function centerAtMiddle(obj) {
    let centerWidth = (innerWidth)/2;
    let centerHeight = (innerHeight)/2;
    obj.position.set(centerWidth,centerHeight);
}

function moveHeaderToTop(obj) {
    let centerWidth = (innerWidth)/2;
    let vertOffset = (innerHeight*0.4)/4;
    let vertPos = 0-vertOffset;
    obj.position.set(centerWidth, vertPos);
}

function moveSpinnerToBottom(obj) {
    let centerWidth = innerWidth;
    let vertPos = innerHeight;
    obj.position.set(centerWidth, vertPos);
}

function keepWheelSquare(obj) {
    let scaler = 0.5;
    if (innerWidth < (innerHeight*scaler)) {
        obj.width = innerWidth*0.9;
        obj.height = innerWidth*0.9;
    } else {
        obj.width = innerHeight*scaler;
        obj.height = innerHeight*scaler;
    }
}

function keepLightsScaled(obj) {
    let scaler = 0.5;
    if (innerWidth < (innerHeight*0.75)) {
        obj.width = innerWidth*0.9;
        obj.height = (obj.width)*scaler;
    } else if (innerWidth < (innerHeight*1.5)) {
        obj.width = innerWidth*0.5;
        obj.height = (obj.width)*0.5;
    } else if (innerWidth > (innerHeight*2)) {
        obj.height = innerHeight*0.35;
        obj.width = obj.height*2;
    } else {
        obj.width = innerWidth*0.3;
        obj.height = (obj.width)*0.5;
    }
}

function loadProgressHandler(loader, resource) {
    console.log("file: " + resource.name);
}

window.addEventListener('DOMContentLoaded', consolidatedScaler);
window.addEventListener('orientationChange', consolidatedScaler);
window.addEventListener('resize', consolidatedScaler);

/* Get JSON Data */
let jsonResponse = {};
let spinRequested = false;
let spinTime = false;
let result = false;

function showData() {
    if (!result) {
        let spinfo = jsonResponse.POSITION;
        console.warn(spinfo);
        setTimeout(function(){ spinTime = false; }, 5000);
    }
};

function setData() {
    const url = "./src/data.json";
    let req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', url, true);
    req.onload = function() {
        jsonResponse = JSON.parse(req.responseText);
        showData();
        spinRequested = false;
        spinTime = true;
        console.warn("Spin done? " + !spinRequested);
    };
    req.send(null);
    console.warn("Spin done? " + !spinRequested);
};

/* Handle Input */
let touchType;
let message = "no message";

if ('ontouchstart' in window) {
    touchType = "touchstart";
    message = "touched";
} else {
    touchType = "click";
    message = "clicked";
}
