import * as PIXI from 'pixi.js';
/* Aliases */
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
let showdownHeight = Math.round(totalHeight*0.25);
let spinnerHeight = (totalHeight-showdownHeight);

function sizeCheck() {
    let currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let currentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if (currentWidth != width || currentHeight != height) {
        canvasResizer(currentWidth, currentHeight);
    }
}

function canvasResizer(newWidth, newHeight) {    
    showdownHeight = Math.round(newHeight*0.25);
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
    console.log("resized: " + showdownHeight);
}

window.addEventListener('load', sizeCheck);
window.addEventListener('resize', sizeCheck);
window.addEventListener('orientationchange', sizeCheck);

/* Get JSON Data */
let jsonResponse = {};

function showData() {
    console.warn(jsonResponse.POSITION);
};

function setData() {
    const url = "./src/data.json";
    let req = new XMLHttpRequest();
    req.overrideMimeType("application/json");
    req.open('GET', url, true);
    req.onload = function() {
        jsonResponse = JSON.parse(req.responseText);
        console.warn(jsonResponse);
        showData();
    };
    req.send(null);
    console.warn(message);
};

/* Handle Input */
let touchType = "click";
let message = "no message";

if ('ontouchstart' in window) {
    touchType = "touchstart";
    message = "touched";
} else {
    touchType = "click";
    message = "clicked";
}

document.getElementById("spinnerAnimation").addEventListener(touchType, setData);

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
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
    console.log("loading: " + resource.name);
}

function showdownSetup() {
    showdownHeight = Math.round(totalHeight*0.25);
    let showdownContainerWidth = totalWidth;
    let showdownCenter = showdownContainerWidth/2;
    let showdownMiddle = showdownHeight/2;

    showdownCanvas.stage.position.x = 0;
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
    let spinnerCenter = spinnerContainerWidth/2;
    let spinnerMiddle = spinnerHeight/2;

    spinnerCanvas.stage.position.x = 0;
    spinnerCanvas.stage.position.y = 0;
    spinnerCanvas.stage.width = spinnerContainerWidth;
    spinnerCanvas.stage.height = spinnerHeight;

    const spinnerContainer = new Container();
    spinnerContainer.position.set(spinnerCenter,spinnerMiddle);
    
    const wheelSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerWheel.texture);
    wheelSprite.anchor.set(0.5);
    wheelSprite.width = 0.9*(spinnerContainerWidth);
    wheelSprite.height = wheelSprite.width;
    wheelSprite.pivot.x = 0;
    wheelSprite.pivot.y = 0;
    wheelSprite.position.x = 0;
    wheelSprite.position.y = 0;

    const buttonSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerButton.texture);
    buttonSprite.anchor.set(0.5);
    buttonSprite.width = 0.9*(spinnerContainerWidth);
    buttonSprite.height = (buttonSprite.width*0.2);
    buttonSprite.position.x = 0;
    buttonSprite.position.y = (wheelSprite.height)/-1.75;    

    const markerSprite = 
    new Sprite(spinnerCanvas.loader.resources.spinnerMarker.texture);
    markerSprite.anchor.set(0.5);
    markerSprite.pivot.x = 0;
    markerSprite.pivot.y = 0;
    markerSprite.position.set((spinnerContainerWidth*0.3),-(spinnerContainerWidth*0.3));
    markerSprite.rotation = 0.5;
    
    spinnerContainer.addChild(wheelSprite);
    spinnerContainer.addChild(buttonSprite);
    spinnerContainer.addChild(markerSprite);
    spinnerCanvas.stage.addChild(spinnerContainer);
    canvasResizer(totalWidth, totalHeight);
};
