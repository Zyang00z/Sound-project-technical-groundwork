//Array to upload audio files and control play/pause of sound
let uploadedAudio = [];
let playControl = [];
let pauseControl = [];

//slider control for audio effects
let pitchShiftSlider;
let pitchShifter;
let frequencySlider;

function setup() {
  createCanvas(600, 400);
  background(200);

  /*  
Title: createFileInput()
Author: Lauren Mccarthy
Date: <2013>
Code version: <1.4.0>
Availability: https://p5js.org/reference/#/p5/createFileInput
*/

  // Initialise file input button
  for (let i = 0; i < 2; i++) {
    const fileInput = createFileInput((file) => handleFile(file, i));
    fileInput.position((width / 3) * (i + 1) - 50, height / 2);

    // Initialise play/pause control for two seperate sound inputs
    createPlayPauseButtons(i + 1, fileInput.x, height / 2 + 40);
  }

  // Slider control for pitch shift effect
  pitchShiftSlider = createSlider(-12, 12, 0, 0.1);
  pitchShiftSlider.position(width / 2 - 50, height - 80);

  // Slider control for frequency effect
  frequencySlider = createSlider(0.5, 2, 1, 0.01);
  frequencySlider.position(width / 2 - 50, height - 40);

  /*
Title: Example of Tone.js PitchShift Effect
Author: Anthony T. Marasco
Date: <2018>
Code version: <13.2.0>
Availability: https://pdm.lsupathways.org/3_audio/1_sampler/2_lesson_2/
*/

  // Creating actual pitch shift effect via Tone.js
  pitchShifter = new Tone.PitchShift().toMaster();
}

//Creating play/pause control buttons
function createPlayPauseButtons(fileIndex, x, y) {
  // Create play button
  playControl[fileIndex] = createButton("▶");
  styleButton(playControl[fileIndex]);
  playControl[fileIndex].position(x, y);
  playControl[fileIndex].mousePressed(() => playUploadedFiles(fileIndex));

  pauseControl[fileIndex] = createButton("⏸");
  styleButton(pauseControl[fileIndex]);
  pauseControl[fileIndex].position(x + 55, y);
  pauseControl[fileIndex].mousePressed(() => pauseUploadedFiles(fileIndex));
}

//Customise visuals/positions of button
function styleButton(button) {
  button.style("background-color", "red");
  button.style("border", "none");
  button.style("padding", "10px 15px");
  button.style("text-align", "center");
  button.style("text-decoration", "none");
  button.style("display", "inline-block");
  button.style("font-size", "20px");
  button.style("cursor", "pointer");
  button.style("border-radius", "5px");
  button.style("margin", "10px");
}

//play/pause sound files
function playUploadedFiles(fileIndex) {
  const actualIndex = fileIndex - 1;
  if (uploadedAudio[actualIndex]) {
    const player = uploadedAudio[actualIndex];
    player.connect(pitchShifter);
    player.playbackRate = frequencySlider.value(); // Adjust the frequency
    player.start();
  }
}

function pauseUploadedFiles(fileIndex) {
  const actualIndex = fileIndex - 1;
  if (
    uploadedAudio[actualIndex] &&
    uploadedAudio[actualIndex].state === "started"
  ) {
    uploadedAudio[actualIndex].stop();
  }
}

//file input control
function handleFile(file, index) {
  console.log("File:", file);
  console.log("Index:", index);

  if (file.type === "audio") {
    // Create a player from the file data
    const player = new Tone.Player(file.data, () => {
      // Player loaded callback
      console.log("Player loaded:", player);

      // Store the player in the array
      uploadedAudio[index] = player;
    });
  } else {
    console.error("Invalid file type. Please upload an audio file.");
  }
}

function draw() {
  // Adjusting pitch shift effect value with slider
  const pitchShiftValue = pitchShiftSlider.value();
  pitchShifter.pitch = pitchShiftValue;
}
