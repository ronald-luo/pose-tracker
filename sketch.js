// Post estimation UI, adapted from The Coding Train
// ml5.js: Pose Estimation with PoseNet


let video;
let poseNet;
let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);

  // gain access to webcam
  video = createCapture(VIDEO);
  video.hide();

  // load posenet model
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

// get data from posenet model 
function gotPoses(poses) {
    // console.log(poses)
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    console.log('poseNet ready');

    let container = document.querySelector('body')

    // init title
    let title = document.createElement('h3')
    title.textContent = "Stats [x, y]"
    title.setAttribute('style', 'text-align: center; color: white; margin: 0 0 20px 0;')

    // init stats
    let leftList = document.createElement('div')
    leftList.setAttribute('style', 'width: 640px; margin: 0 auto 2em auto;')
            
    leftList.innerHTML = `
    <ul class="list-group">
        <li class="list-group-item list-group-item-dark" id="leftWrist">Left wrist: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="leftShoulder">Left shoulder: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="leftHip">Left hip: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="leftKnee">Left knee: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="leftAnkle">Left ankle: [N/A, N/A]</li>
    </ul>
    `

    let rightList = document.createElement('div')
    rightList.setAttribute('style', 'width: 640px; margin: 0 auto 2em auto;')

    rightList.innerHTML = `
    <ul class="list-group">
        <li class="list-group-item list-group-item-dark" id="rightWrist">Right wrist: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="rightShoulder">Right shoulder: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="rightHip">Right hip: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="rightKnee">Right knee: [N/A, N/A]</li>
        <li class="list-group-item list-group-item-dark" id="rightAnkle">Right ankle: [N/A, N/A]</li>
    </ul>
    `

    container.appendChild(title)
    container.appendChild(leftList)
    container.appendChild(rightList)
}

function draw() {
    push()
    translate(width,0);
    scale(-1, 1);
    image(video, 0, 0, 640, 480);
    pop()

  if (pose) {
    push()
    translate(width,0);
    scale(-1, 1);

    // Cover head
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(0, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, 3*d);


    document.getElementById('leftWrist').textContent = `Left wrist: [${Math.round(pose.leftWrist.x)}, ${Math.round(pose.leftWrist.y)}]`
    document.getElementById('leftShoulder').textContent = `Left shoulder: [${Math.round(pose.leftShoulder.x)}, ${Math.round(pose.leftShoulder.y)}]`
    document.getElementById('leftHip').textContent = `Left hip: [${Math.round(pose.leftHip.x)}, ${Math.round(pose.leftHip.y)}]`
    document.getElementById('leftKnee').textContent = `Left knee: [${Math.round(pose.leftKnee.x)}, ${Math.round(pose.leftKnee.y)}]`
    document.getElementById('leftAnkle').textContent = `Left ankle: [${Math.round(pose.leftAnkle.x)}, ${Math.round(pose.leftAnkle.y)}]`

    document.getElementById('rightWrist').textContent = `Right wrist: [${Math.round(pose.rightWrist.x)}, ${Math.round(pose.rightWrist.y)}]`
    document.getElementById('rightShoulder').textContent = `Right shoulder: [${Math.round(pose.rightShoulder.x)}, ${Math.round(pose.rightShoulder.y)}]`
    document.getElementById('rightHip').textContent = `Right hip: [${Math.round(pose.rightHip.x)}, ${Math.round(pose.rightHip.y)}]`
    document.getElementById('rightKnee').textContent = `Right knee: [${Math.round(pose.rightKnee.x)}, ${Math.round(pose.rightKnee.y)}]`
    document.getElementById('rightAnkle').textContent = `Right ankle: [${Math.round(pose.rightAnkle.x)}, ${Math.round(pose.rightAnkle.y)}]`


    
    // draw vertices: skeletal points for skeleton
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255,255,255);
      ellipse(x,y,16,16);
    }
    
    // draw edges: line between points for skeleton
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
    pop()
  }
}