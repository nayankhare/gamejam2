async function init() {

    /* This function loads the camera stream into the defined video element in the HTML Document
       Loads the toggle button to know if the model is ready to be executed

                                                                                                */
    video = document.getElementById('video_frame');
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: true,
            width: 610,
            height: 470,
        }).then(function(stream) {
            video.srcObject = stream;
            video.play();
        });

        start_game_button = document.getElementById('startGame_button');
        start_game_button.innerHTML = "Please wait";
    }

    model = await handpose.load();
    console.log("Handpose loaded");
    start_game_button.innerHTML = "Ready!";
}



init();


async function get_predictions() {
  /* Asynchronous Function which estimates position of hand and returns predictions
  */
  if(isPredicting == true) {
    const predictions = await model.estimateHands(document.getElementById('video_frame'), true);
    return predictions;
  }
}
function make_prediction() {
  /*
      Waits for predictions. When predictions are received, the coordinates are extracted.
  */

  predictions = get_predictions();
  predictions.then(function(val) {
    if (val.length > 0) {
      var preds = val[0]
      const keypoints = preds.landmarks;
      const [x, y, z] = keypoints[5];
      indexFingerX = x;
      indexFingerY = y;
      console.log(`${indexFingerX} and ${indexFingerY}`);  
      createVector();
      }
    else {
      magnitude = 0;
    } 
  });
}

function toggleGameState() {
  /* 
  
  */
  if(isPredicting == true) {
    isPredicting = false;
    magnitude = 0;
    start_game_button.innerHTML = "Start";
    window.clearInterval(intervalID);
  }
  else {
    
    isPredicting = true;
    start_game_button.innerHTML = "Pause";
    intervalID = window.setInterval(() => make_prediction(), 100);
  }

}