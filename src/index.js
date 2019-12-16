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
    {name: 'spinnerMarker', url: './src/images/marker.png'},
    {name: 'boltOff', url: './src/images/bolt-off@2x.png'},
    {name: 'boltOn', url: './src/images/bolt@2x.png'},
    {name: 'mustDrop', url: './src/images/must_drop.png'},
    {name: 'slots', url: './src/images/slots@2x.png'},
    {name: 'vegas', url: './src/images/vegas@2x.png'},
    {name: 'sLet', url: './src/images/s@2x.png'},
    {name: 'hLet', url: './src/images/h@2x.png'},
    {name: 'o1Let', url: './src/images/o-1@2x.png'},
    {name: 'w1Let', url: './src/images/w-1@2x.png'},
    {name: 'dLet', url: './src/images/d@2x.png'},
    {name: 'o2Let', url: './src/images/o-2@2x.png'},
    {name: 'w2Let', url: './src/images/w-2@2x.png'},
    {name: 'nLet', url: './src/images/n@2x.png'}
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

    const mustDropSprite = new PIXI.Sprite(app.loader.resources.mustDrop.texture);
    const vegasSprite = new PIXI.Sprite(app.loader.resources.vegas.texture);
    const slotsSprite = new PIXI.Sprite(app.loader.resources.slots.texture);
    const boltOnSprite = new PIXI.Sprite(app.loader.resources.boltOn.texture);
    const boltOffSprite = new PIXI.Sprite(app.loader.resources.boltOff.texture);

    const sLetSprite = new PIXI.Sprite(app.loader.resources.sLet.texture);
    const hLetSprite = new PIXI.Sprite(app.loader.resources.hLet.texture);
    const o1LetSprite = new PIXI.Sprite(app.loader.resources.o1Let.texture);
    const w1LetSprite = new PIXI.Sprite(app.loader.resources.w1Let.texture);

    const dLetSprite = new PIXI.Sprite(app.loader.resources.dLet.texture);
    const o2LetSprite = new PIXI.Sprite(app.loader.resources.o2Let.texture);
    const w2LetSprite = new PIXI.Sprite(app.loader.resources.w2Let.texture);
    const nLetSprite = new PIXI.Sprite(app.loader.resources.nLet.texture);

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
    keepLightsScaled(showdownOffSprite);

    vegasSprite.anchor.set(0.5);
    alignToSign(vegasSprite, showdownOffSprite, -0.4, -0.33, 1);

    slotsSprite.anchor.set(0.5);
    alignToSign(slotsSprite, showdownOffSprite, 0.5, -0.33, 1);

    mustDropSprite.anchor.set(0.5);
    alignToSign(mustDropSprite, showdownOffSprite, 0, 0.4, 0.65);

    boltOffSprite.anchor.set(0.5);
    alignToSign(boltOffSprite, showdownOffSprite, 0.05, -0.34, 0.75);
    boltOnSprite.anchor.set(0.5);
    alignToSign(boltOnSprite, showdownOffSprite, 0.05, -0.355, 1);

    sLetSprite.anchor.set(0.5);
    alignToSign(sLetSprite, showdownOffSprite, -0.85, 0.1, 1);
    hLetSprite.anchor.set(0.5);
    alignToSign(hLetSprite, showdownOffSprite, -0.6, 0.1, 1);
    o1LetSprite.anchor.set(0.5);
    alignToSign(o1LetSprite, showdownOffSprite, -0.41, 0.095, 1);
    w1LetSprite.anchor.set(0.5);
    alignToSign(w1LetSprite, showdownOffSprite, -0.135, 0.058, 1);

    dLetSprite.anchor.set(0.5);
    alignToSign(dLetSprite, showdownOffSprite, 0.152, 0.03, 1);
    o2LetSprite.anchor.set(0.5);
    alignToSign(o2LetSprite, showdownOffSprite, 0.365, 0.045, 1);
    w2LetSprite.anchor.set(0.5);
    alignToSign(w2LetSprite, showdownOffSprite, 0.575, 0.09, 1);
    nLetSprite.anchor.set(0.5);
    alignToSign(nLetSprite, showdownOffSprite, 0.85, 0.1, 1);

    spinnerBox.width = innerWidth;
    spinnerBox.height = innerHeight*0.6;
    spinnerBox.pivot.x = (innerWidth/2);
    spinnerBox.pivot.y = (innerHeight*0.6)/2;
    moveSpinnerToBottom(spinnerBox);

    wheelSprite.anchor.set(0.5);
    keepWheelSquare(wheelSprite);
    wheelSprite.position.set(0,(wheelSprite.width*0.125));

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

    

    let buttonOffset = wheelWidth/-2.1;
    buttonSprite.anchor.set(0.5);
    buttonSprite.position.set(0,buttonOffset)
    buttonSprite.width = wheelWidth*0.9;
    buttonSprite.height = buttonSprite.width*0.2;
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

    // Responsiveness
    if (innerWidth > 1200 && innerHeight > 900) {
        wheelSprite.position.set((-0.25*innerHeight),(wheelSprite.width*0.125));
        markerSprite.position.set(markerOffsetX-(0.25*innerHeight), markerOffsetY);
        buttonSprite.position.set((0.33*innerHeight),0);
    }

    if (innerWidth > 1600 && innerHeight > 900) {
        keepWheelSquare(wheelSprite);
        let xPos = -1.2*wheelSprite.width*0.5;
        let yPos = innerHeight*0;
        wheelSprite.position.set(xPos,yPos);
        markerSprite.position.set(markerOffsetX+(xPos), markerOffsetY-(wheelSprite.width*0.125));
        buttonSprite.position.set((0.33*innerHeight),0);
    }

    // attach
    spinnerBox.addChild(wheelSprite);
    spinnerBox.addChild(markerSprite);
    spinnerBox.addChild(buttonSprite);

    headerAnimationBox.addChild(showdownOffSprite);
    headerAnimationBox.addChild(mustDropSprite);
    headerAnimationBox.addChild(slotsSprite);
    headerAnimationBox.addChild(vegasSprite);
    headerAnimationBox.addChild(boltOffSprite);
    headerAnimationBox.addChild(boltOnSprite);

    headerAnimationBox.addChild(sLetSprite);
    headerAnimationBox.addChild(hLetSprite);
    headerAnimationBox.addChild(o1LetSprite);
    headerAnimationBox.addChild(w1LetSprite);

    headerAnimationBox.addChild(dLetSprite);
    headerAnimationBox.addChild(o2LetSprite);
    headerAnimationBox.addChild(w2LetSprite);
    headerAnimationBox.addChild(nLetSprite);

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
    let vertPos = innerHeight*0.975;
    obj.position.set(centerWidth, vertPos);
}

function keepWheelSquare(obj) {
    let scaler = 0.5;
    if (innerWidth < (innerHeight*scaler)) {
        obj.width = innerWidth*0.9;
        obj.height = innerWidth*0.9;
    } else if (innerWidth > (innerHeight*scaler)) {
        obj.width = innerHeight*scaler;
        obj.height = innerHeight*scaler;
    }

    if (innerWidth > 1600) {
        obj.width = 1.25*innerHeight*scaler;
        obj.height = 1.25*innerHeight*scaler;
    }
}

function keepLightsScaled(obj) {
    let scaler = 0.5;
    obj.position.set(0,0);
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
    obj.position.set(0,0);
}

function alignToSign(obj, sign, xFactor, yFactor, baseFactor) {
    let baseScaler = baseFactor;
    let baseScaleX = sign.scale.x*baseScaler;
    let baseScaleY = sign.scale.y*baseScaler;

    obj.scale.set(baseScaleX, baseScaleY);

    let xOffset = sign.height * xFactor;
    let yOffset = sign.height * yFactor;
        
    obj.position.set(xOffset, yOffset);
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
