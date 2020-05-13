


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
var vector = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial(
    {
            color: "rgb(3, 197, 221)",
            wireframe: true,
            wireframeLinewidth: 1
    });
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);
camera.position.z = 5;


var animate = function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};
animate();



const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");


let imgindex = 1;
let isVideo = false;
let model = null;



const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 0.5,
    scoreThreshold: 0.7
};

handTrack.load(modelParams).then(lmodel => {
    model = lmodel;
    updateNote.innerText = "Loaded Model!";
    trackButton.disabled = false;
});


function startVideo() {
    handTrack.startVideo(video).then(function(status) {
        if (status) {
            updateNote.innerText = "Video started. Now tracking";
            isVideo = true;
            runDetection();
        } else {
            updateNote.innerText = "Please enable video";
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video";
        startVideo();
    } else {
        updateNote.innerText = "Stopping video";
        handTrack.stopVideo(video);
        isVideo = false;
        updateNote.innerText = "Video stopped";
    }
}


function runDetection() {
    model.detect(video).then(predictions => {
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
        if (predictions.length > 0) {
            changeData(predictions[0].bbox);
        }
    });
}

function changeData(value) {
    let midvalX = value[0] + value[2] / 2;
    let midvalY = value[1] + value[3] / 2;

    document.querySelector(".hand-1 #hand-x span").innerHTML = midvalX;
    document.querySelector(".hand-1 #hand-y span").innerHTML = midvalY;

    moveTheBox({ x: (midvalX - 300) / 600, y: (midvalY - 250) / 500 });
}

function moveTheBox(value) {
    cube.position.x = ((window.innerWidth * value.x) / window.innerWidth) * 6;
    cube.position.y = -((window.innerHeight * value.y) / window.innerHeight) * 6;
    renderer.render(scene, camera);
}