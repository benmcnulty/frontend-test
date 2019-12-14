import * as PIXI from 'pixi.js';
const showdownCanvas = new PIXI.Application({
    view: showdownAnimation,
    resolution: 1,
    antialias: true,
    transparent: true,
    interactiveChildren: false
});

const spinnerCanvas = new PIXI.Application({
    view: spinnerAnimation,
    resolution: 1,
    antialias: true,
    transparent: false,
    interactive: true,
    buttonMode: true
});

function canvasResizer() {
    let width  = window.innerWidth || document.documentElement.clientWidth || 
        document.body.clientWidth;
    let height = window.innerHeight|| document.documentElement.clientHeight|| 
        document.body.clientHeight;

    let totalWidth = width;
    let totalHeight = height;
    
    let showdownHeight = Math.round(totalHeight*0.33);
    let spinnerHeight = (totalHeight-showdownHeight);

    showdownCanvas.renderer.autoResize = true;
    spinnerCanvas.renderer.autoResize = true;
    showdownCanvas.renderer.resize(totalWidth, showdownHeight);
    spinnerCanvas.renderer.resize(totalWidth, spinnerHeight);
    console.warn("Available: " + totalHeight);
    console.warn("Showdown: " + showdownHeight);
    console.warn("Spinner: " + spinnerHeight);
    console.warn("Total: " + (spinnerHeight+showdownHeight));
}

window.addEventListener('load', canvasResizer);
window.addEventListener('resize', canvasResizer);
window.addEventListener('orientationchange', canvasResizer);


let jsonResponse = {};

function showData() {
    console.warn(jsonResponse.POSITION);
}

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
}

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
