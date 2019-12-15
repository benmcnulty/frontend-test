import * as PIXI from 'pixi.js';
/* Aliases */
window.PIXI = PIXI;
let Application = PIXI.Application,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite;

/* Build Canvas */
const showdownCanvas = new Application({
    view: showdownAnimation,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
    transparent: false,
    interactiveChildren: false
});

const spinnerCanvas = new Application({
    view: spinnerAnimation,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
    transparent: true,
    interactive: true,
    buttonMode: true
});

/* Responsive Canvas */
let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
let totalWidth = width;
let totalHeight = height;
let showdownHeight = Math.round(totalHeight*0.4);
let spinnerHeight = (totalHeight-showdownHeight);

function sizeCheck() {
    let currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let currentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (currentWidth != width || currentHeight != height) {
        canvasResizer(currentWidth, currentHeight);
    }
}

function canvasResizer(newWidth, newHeight) {    
    showdownHeight = Math.round(newHeight*0.4);
    spinnerHeight = (newHeight-showdownHeight);
    showdownCanvas.stage.position.x = 0;
    showdownCanvas.stage.position.y = 0;
    showdownCanvas.stage.width = newWidth;
    showdownCanvas.stage.height = showdownHeight;
    showdownCanvas.renderer.resize(newWidth, showdownHeight);

    spinnerCanvas.stage.position.x = 0;
    spinnerCanvas.stage.position.y = 0;
    spinnerCanvas.stage.width = newWidth;
    spinnerCanvas.stage.height = spinnerHeight;
    spinnerCanvas.renderer.resize(newWidth, spinnerHeight);
}

window.addEventListener('load', sizeCheck);
window.addEventListener('resize', sizeCheck);
window.addEventListener('orientationchange', sizeCheck);

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
        console.warn(spinnerCanvas.loader.resources.spinnerButton.texture);
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

/* Pixi Loaders */
showdownCanvas.loader.add([
    {name: 'headerBack', url: './src/images/header.png'},
    {name: 'showdownOff', url: './src/images/showdown-off.png'}
]).on("progress", loadProgressHandler).load(showdownSetup);

spinnerCanvas.loader.add([
    {name: 'spinnerButton', url: './src/images/btn-spin.png'},
    {name: 'spinnerWheel', url: './src/images/wheel.png'},
    {name: 'spinnerMarker', url: './src/images/marker.png'}
]).on("progress", loadProgressHandler).load(spinnerSetup);

function loadProgressHandler( loader, resource ) {
    console.log("file: " + resource.name);
}

function showdownSetup() {
    showdownHeight = Math.round(totalHeight*0.4);
    let showdownContainerWidth = totalWidth;
    let showdownCenter = showdownContainerWidth/2;
    let showdownMiddle = showdownHeight/2;

    showdownCanvas.stage.position.x = (showdownCenter/2);
    showdownCanvas.stage.position.y = 0;
    showdownCanvas.stage.width = showdownContainerWidth;
    showdownCanvas.stage.height = showdownHeight;

    const showdownContainer = new Container();
    showdownContainer.position.set(showdownCenter, showdownMiddle);

    const headerBackSprite = 
    new Sprite(showdownCanvas.loader.resources.headerBack.texture);
    headerBackSprite.anchor.set(0.5);
    headerBackSprite.width = width;
    headerBackSprite.height = showdownHeight;
    headerBackSprite.position.set(0,0);

    const animationContainer = new Container();
    animationContainer.position.set(0,0);

    const showdownOffSprite = 
    new Sprite(showdownCanvas.loader.resources.showdownOff.texture);
    showdownOffSprite.anchor.set(0.5);
    showdownOffSprite.width = showdownContainerWidth*0.8;
    showdownOffSprite.height = showdownHeight*0.8;
    showdownOffSprite.position.set(0,0);

    animationContainer.addChild(showdownOffSprite);
    
    showdownContainer.addChild(headerBackSprite);
    showdownContainer.addChild(animationContainer);
    showdownCanvas.stage.addChild(showdownContainer);
    canvasResizer(totalWidth, totalHeight);
};

function spinnerSetup() {
    spinnerHeight = (height-showdownHeight);

    let spinnerContainerWidth = totalWidth;
    let spinnerCenter = (spinnerContainerWidth/2);
    let spinnerMiddle = (spinnerHeight/2);

    const spinnerContainer = new Container();
    spinnerContainer.position.set(spinnerCenter,spinnerMiddle);
    spinnerContainer.scale.set(1,1);
    
    const wheelSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerWheel.texture);
    wheelSprite.anchor.set(0.5);
    wheelSprite.width = (wheelSprite.width)*0.6;
    wheelSprite.height = wheelSprite.width;
    wheelSprite.pivot.x = 0;
    wheelSprite.pivot.y = 0;
    wheelSprite.position.x = 0;
    wheelSprite.position.y = (wheelSprite.width)*0.2;
    spinnerCanvas.ticker.add((delta) => {
        if (spinRequested || spinTime) {
            wheelSprite.rotation += 0.02 * delta;
        } else {
            return;
        }
    });

    const buttonSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerButton.texture);
    let halfWidth = (buttonSprite.width/2);
    buttonSprite.anchor.set(0.5);
    buttonSprite.width = buttonSprite.width;
    buttonSprite.height = (buttonSprite.width*0.2);
    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.position.x = 10;
    buttonSprite.position.y = -150;
    buttonSprite.on(touchType, (event) => {
        if (!spinRequested) {
            spinRequested = true;
            setData();
        } else {
            return;
        }
    });

    const markerSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerMarker.texture);
    markerSprite.anchor.set(0.5);
    markerSprite.pivot.x = 0;
    markerSprite.pivot.y = 0;
    markerSprite.position.x = 100;
    markerSprite.position.y = -90;
    markerSprite.rotation = 0.5;
    
    spinnerContainer.addChild(wheelSprite);
    spinnerContainer.addChild(buttonSprite);
    spinnerContainer.addChild(markerSprite);
    spinnerCanvas.stage.addChild(spinnerContainer);
    canvasResizer(totalWidth, totalHeight);
};
