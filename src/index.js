import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
const canvasDOM = document.getElementById("viewerCanvas");

let density = window.devicePixelRatio || 1;
let innerWidth = window.innerWidth;
let innerHeight = window.innerHeight;

let first = true;
let spinRequested = false;
let spinning = false;
let stopping = false;
let done = false;
let positionData;
let radHolder;
let currentRads;
let saltyPos;
let saltyEntry;
let altyPos;
let altyEntry;
let stradle = false;
let passed = false;
let passedTwice = false;

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
    {name: 'btnShadow', url: './src/images/btn-shadow.png'},
    {name: 'spinnerShadow', url: './src/images/wheel-shadow.png'},
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

function loadProgressHandler(loader, resource) {
    console.log("file: " + resource.name);
}

const stage = new PIXI.Container();
stage.width = app.renderer.width;
stage.height = app.renderer.height;
app.stage.addChild(stage);

function spriteSetup() {
    // declare
    const headerBox = new PIXI.Container();
    const headerAnimationBox = new PIXI.Container();
    
    const headerSprite = new PIXI.Sprite(app.loader.resources.headerBack.texture);
    const showdownOffSprite = new PIXI.Sprite(app.loader.resources.showdownOff.texture);
    const spinnerBox = new PIXI.Container();
    const wheelSprite = new PIXI.Sprite(app.loader.resources.spinnerWheel.texture);
    const wheelShadow = new PIXI.Sprite(app.loader.resources.spinnerShadow.texture);
    const markerSprite = new PIXI.Sprite(app.loader.resources.spinnerMarker.texture);
    const buttonSprite = new PIXI.Sprite(app.loader.resources.spinnerButton.texture);
    const buttonShadow = new PIXI.Sprite(app.loader.resources.btnShadow.texture);

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
    if (innerWidth < 600) {
        headerSprite.width = innerWidth*1.5;
    } else if (innerWidth < 900) {
        headerSprite.width = innerWidth*1.2;
    } else {
        headerSprite.width = innerWidth;
    }
    
    headerSprite.height = innerHeight*0.4;
    let currentCenterX = (innerWidth)/2;
    let currentCenterY = (innerHeight)/2;
    headerSprite.position.set(currentCenterX,currentCenterY);

    centerAtMiddle(headerAnimationBox);

    showdownOffSprite.anchor.set(0.5);
    keepLightsScaled(showdownOffSprite);



    boltOffSprite.anchor.set(0.5);
    hideThis(boltOffSprite);
    alignToSign(boltOffSprite, showdownOffSprite, 0.05, -0.34, 0.75);

    boltOnSprite.anchor.set(0.5);
    hideThis(boltOnSprite);
    alignToSign(boltOnSprite, showdownOffSprite, 0.05, -0.356, 1);

    vegasSprite.anchor.set(0.5);
    hideThis(vegasSprite);
    alignToSign(vegasSprite, showdownOffSprite, -0.49, -0.33, 1);

    slotsSprite.anchor.set(0.5);
    hideThis(slotsSprite);
    alignToSign(slotsSprite, showdownOffSprite, 0.59, -0.33, 1);



    sLetSprite.anchor.set(0.5);
    hideThis(sLetSprite);
    alignToSign(sLetSprite, showdownOffSprite, -1.01, 0.1, 1);

    hLetSprite.anchor.set(0.5);
    hideThis(hLetSprite);
    alignToSign(hLetSprite, showdownOffSprite, -0.7, 0.1, 1);

    o1LetSprite.anchor.set(0.5);
    hideThis(o1LetSprite);
    alignToSign(o1LetSprite, showdownOffSprite, -0.48, 0.095, 1);

    w1LetSprite.anchor.set(0.5);
    hideThis(w1LetSprite);
    alignToSign(w1LetSprite, showdownOffSprite, -0.155, 0.058, 1);

    dLetSprite.anchor.set(0.5);
    hideThis(dLetSprite);
    alignToSign(dLetSprite, showdownOffSprite, 0.18, 0.035, 1);

    o2LetSprite.anchor.set(0.5);
    hideThis(o2LetSprite);
    alignToSign(o2LetSprite, showdownOffSprite, 0.43, 0.048, 1);

    w2LetSprite.anchor.set(0.5);
    hideThis(w2LetSprite);
    alignToSign(w2LetSprite, showdownOffSprite, 0.68, 0.094, 1);

    nLetSprite.anchor.set(0.5);
    hideThis(nLetSprite);
    alignToSign(nLetSprite, showdownOffSprite, 1.01, 0.1, 1);



    mustDropSprite.anchor.set(0.5);
    hideThis(mustDropSprite);
    alignToSign(mustDropSprite, showdownOffSprite, 0, 0.4, 0.65);



    spinnerBox.width = innerWidth;
    spinnerBox.height = innerHeight*0.6;
    spinnerBox.pivot.x = (innerWidth/2);
    spinnerBox.pivot.y = (innerHeight*0.6)/2;
    moveSpinnerToBottom(spinnerBox);

    wheelSprite.anchor.set(0.5);
    keepWheelSquare(wheelSprite);
    wheelSprite.position.set(0,(wheelSprite.width*0.125));
    addWheelShadow(wheelSprite, wheelShadow);

    let wheelWidth = wheelSprite.width;
    let markerOffsetX = wheelWidth/2.8;
    let markerOffsetY = (wheelWidth/-2.8)+(wheelSprite.width*0.1);
    markerSprite.anchor.set(0.5);
    markerSprite.position.set(markerOffsetX, markerOffsetY)
    markerSprite.height = wheelWidth*0.3;
    markerSprite.width = markerSprite.height*0.455;
    markerSprite.rotation = 0.75;

    let buttonOffset = wheelWidth/-2;
    buttonSprite.anchor.set(0.5);
    buttonSprite.position.set(0,buttonOffset)
    buttonSprite.width = wheelWidth*0.9;
    buttonSprite.height = buttonSprite.width*0.222;

    // Responsiveness
    if (innerWidth >= 1200 && innerHeight >= 900 && innerWidth > innerHeight) {
        wheelSprite.position.set((-0.25*innerHeight),(wheelSprite.width*0.05));
        markerSprite.position.set(markerOffsetX-(0.25*innerHeight), markerOffsetY);
        buttonSprite.position.set((0.33*innerHeight),0);
        addWheelShadow(wheelSprite, wheelShadow);
    }

    if (innerWidth >= 1600 && innerHeight >= 900 && innerWidth > innerHeight) {
        keepWheelSquare(wheelSprite, wheelShadow);
        let xPos = -1.2*wheelSprite.width*0.5;
        let yPos = innerHeight*0;
        wheelSprite.position.set(xPos,yPos);
        markerSprite.position.set(markerOffsetX+(xPos), markerOffsetY-(wheelSprite.width*0.125));
        buttonSprite.position.set((0.33*innerHeight),0);
        addWheelShadow(wheelSprite, wheelShadow);
    }

    if (innerWidth > (innerHeight*1.75)) {
        keepWheelSquare(wheelSprite, wheelShadow);
        let xPos = -1.2*wheelSprite.width*0.5;
        let yPos = innerHeight*0;
        wheelSprite.position.set(xPos,yPos);
        markerSprite.position.set(markerOffsetX+(xPos), markerOffsetY-(wheelSprite.width*0.125));
        buttonSprite.position.set((0.33*innerHeight),0);
        addWheelShadow(wheelSprite, wheelShadow);
    }

    if (innerHeight >= (innerWidth*1.75) && innerWidth < 500 && innerHeight >= (innerWidth*2)) {
        buttonOffset = wheelWidth/-1.65;
        buttonSprite.position.set(0,buttonOffset)
    } else if (innerHeight > (innerWidth*1.75) && innerWidth < 500 && innerHeight < (innerWidth*2)) {
        buttonOffset = wheelWidth/-2;
        buttonSprite.position.set(0,buttonOffset)
    }

    addButtonShadow(buttonSprite, buttonShadow);

    // attach
    spinnerBox.addChild(wheelShadow);
    spinnerBox.addChild(buttonShadow);
    spinnerBox.addChild(wheelSprite);
    spinnerBox.addChild(markerSprite);
    spinnerBox.addChild(buttonSprite);

    headerAnimationBox.addChild(showdownOffSprite);

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

    headerAnimationBox.addChild(mustDropSprite);

    headerBox.addChild(headerSprite);
    headerBox.addChild(headerAnimationBox);
    
    if (!first) {
        stage.removeChildren();
    }

    first = false;

    stage.addChild(headerBox);
    stage.addChild(spinnerBox);

    addInteractions(buttonSprite, wheelSprite);
}

function addInteractions(buttonObj, wheelObj) {
    buttonObj.interactive = true;
    buttonObj.buttonMode = true;
    buttonObj.on(touchType, () => {
        if (!spinRequested) {
            spinRequested = true;
            spinning = true;
            positionData = setData(wheelObj);
        } else {
            return;
        }
    });
    app.ticker.add((delta) => {
        if (spinning) {
            wheelObj.rotation += 0.04 * delta;
        } else if (stopping) {
            wheelObj.rotation += 0.02 * delta;
            checkData(wheelObj);
        } else if (done) {
            wheelObj.rotation = wheelObj.rotation;
        }
    });
}

/* Get JSON Data */
function setData(wheelObj) {
    function requestData(wheelObj) {
        const url = "./src/data.json";
        let req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open('GET', url, true);
        req.onload = function() {
            let jsonResponse = JSON.parse(req.responseText);
            positionData = jsonResponse.POSITION;
            positionData = parseFloat(positionData, 2);
            console.log(positionData);
            handleData(positionData, wheelObj);
        };
        req.send(null);
    }

    function handleData(data, wheel) {
        let positionRads;
        let entryRads;
        let altPositionRads;
        let altEntryRads;
        
    
        if (data == 1) {
            positionRads = 1.75;
            entryRads = 1.25;
        } else if (data == 2) {
            positionRads = 0.25;
            entryRads = 0;
            stradle = true;
            altPositionRads = 2;
            altEntryRads = 1.75;
        } else if (data == 3) {
            positionRads = 0.75;
            entryRads = 0.25;
        } else if (data == 4) {
            positionRads = 1.25;
            entryRads = 0.75;
        } else {
            return;
        }
        
        let currentRot = wheel.rotation;
        radHolder = Number((currentRot % 2).toFixed(2));
        currentRads = parseFloat(radHolder,2);
    
        if ((spinning) && (currentRads <= positionRads) && (currentRads > entryRads)) {
            spinning = false;
            stopping = true;
        } else if ((spinning) && (stradle) && (currentRads <= altPositionRads) && (currentRads >= altEntryRads)) {
            spinning = false;
            stopping = true;
        } else {
            checkData(wheel);
        }
    }

    requestData(wheelObj);
};

function checkData (wheel) {
    radHolder = Number((wheel.rotation % 2).toFixed(2));
    currentRads = parseFloat(radHolder);

    if (stopping && (currentRads <= positionRads) && (currentRads > entryRads)) {
        done = true;
    } else if ((stradle) && (stopping) && (currentRads <= positionRads) && (currentRads > entryRads)) {
        done = true;
    } else if ((stopping) && (stradle) && (currentRads <= altPositionRads) && (currentRads >= altEntryRads)) {
        done = true;
    } else {
        setTimeout(function(){
            checkData(wheel);
            clearTimeout();
        }, 500);
    }
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

function addWheelShadow(wheel,shadow) {
    let wheelWidth = wheel.width;
    let wheelHeight = wheel.height;
    let wheelX = wheel.position.x;
    let wheelY = wheel.position.y;
    let offsetX = innerHeight * 0.005;
    let offsetY = innerHeight * 0.015;

    shadow.width = wheelWidth * 1.1;
    shadow.height = wheelHeight * 1.1;
    shadow.anchor.set(0.5);
    shadow.position.x = wheelX + offsetX;
    shadow.position.y = wheelY + offsetY;
}



function addButtonShadow(button,shadow) {
    let buttonWidth = button.width;
    let buttonHeight = button.height;
    let buttonX = button.position.x;
    let buttonY = button.position.y;
    let offsetX = innerHeight * 0.005;
    let offsetY = innerHeight * 0.015;

    shadow.anchor.set(0.5);
    shadow.width = buttonWidth * 1;
    shadow.height = buttonHeight * 1.2;
    shadow.position.x = buttonX + offsetX;
    shadow.position.y = buttonY + offsetY;
}

function keepLightsScaled(obj) {
    let scaler = 0.42;
    if (innerWidth < (innerHeight*0.75)) {
        obj.width = innerWidth*0.9;
        obj.height = (obj.width)*scaler;
    } else if ((innerWidth < innerHeight) && (innerWidth > 620)) {
        obj.width = innerWidth*0.75;
        obj.height = (obj.width)*scaler;
    } else if (innerWidth < (innerHeight*1.5)) {
        obj.width = innerWidth*0.5;
        obj.height = (obj.width)*scaler;
    } else if (innerWidth > (innerHeight*2)) {
        obj.width = innerHeight*0.75;
        obj.height = (obj.width)*scaler;
    } else {
        obj.width = innerWidth*0.4;
        obj.height = (obj.width)*scaler;
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

function hideThis(obj) {
    obj.alpha = 1;
}

/* Handle Input */
let touchType;
if ('ontouchstart' in window) {
    touchType = "touchstart";
} else {
    touchType = "click";
}

window.addEventListener('load', consolidatedScaler);
window.addEventListener('orientationChange', consolidatedScaler);
window.addEventListener('resize', consolidatedScaler);
