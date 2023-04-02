// ----------------------------------
// (c) 2023 talonen.dm
// puhesarjis
// ----------------------------------
// 03/2023
// VSCode on Windows - Shift + Alt + F <-- indent code
// ----------------------------------
// setRate: teksti voi lähteä liikkumaan jo ennen kuin valmis
// numeron vari - skaalaa punasesta vihreeseen
// ----------------------------------
var timerValue = 0;
let imgs = [];
var imagenum = 0;
var prev_imagenum = 0;
var prev_image_x = 0;
var prev_image_y = 0;
var animate_speed_y_prev = 0;
var n_image = 9;
var updatePage = true;
var onlypicupdatePage = true;
var speaking = false;
var pagenumcolor = 'green';
let voices;
// ----------------------------------
let speech;
let showThinking = false;
let storytitle;
let lue = [];
let aani = [];
let debug = false; // true; //false; //false;
// ----------------------------------
let voiceBeaver = 'Microsoft David - English (United States)' // 'Microsoft Hazel - English (United Kingdom)'; // 'Microsoft Susan - English (United Kingdom)';
let voiceBear = 'Microsoft George - English (United Kingdom)'; // 'Microsoft Heidi - Finnish (Finland)';
let voiceGeneral = 'Microsoft Susan - English (United Kingdom)'; // 'Microsoft Heidi - Finnish (Finland)';
// ----------------------------------
let speakingRateVector = [160, 170, 175]; // = 175; // 125; // words per minute
let speakingRate = speakingRateVector[0]; // 125; // words per minute
// ----------------------------------
let isMouseClicked = false;

let tekstikuvanpaalla = true;
// Global variable to keep track of whether the audio is playing or paused
let enableSpeaking = false;

let ypos;

var animatePage_i = 0;
var animatePage = false;
var animatePageN = 300;
let animate_speed0 = 3;
var animate_speed_prev = animate_speed0;

var timeleft = 0;
let startTime;
let startTimeText;
let elapsedTime;
let elapsedTimeSpeech = 0;
let elapsedTimeSpeechStart; //  = millis();
let elapsedTimeSpeechStart0;
// ----------------------------------
function preload() {
	imgs[0] = loadImage('pics/02x.jpg');
	imgs[1] = loadImage('pics/01a.jpg');
	imgs[2] = loadImage('pics/02a.jpg');
	imgs[3] = loadImage('pics/03a.jpg');
	imgs[4] = loadImage('pics/04a.jpg');
	imgs[5] = loadImage('pics/05a.jpg');
	imgs[6] = loadImage('pics/06a.jpg');
	imgs[7] = loadImage('pics/07a.jpg');
	imgs[8] = loadImage('pics/08a.jpg'); // png
	imgs[9] = loadImage('pics/09a.jpg');
	// myFont = loadFont('assets/Pokemon Solid.ttf');

	storytitle = "A bear and a beaver, are standing in front of a group of trees. The trees on the left are tall and healthy, while the ones on the right are withering and dead.";

	if (debug) {
		lue[0] = "snakker du engelsk";
		lue[1] = "hvor kan jeg kjøpe øl?";
		lue[2] = "kuva 2";
		lue[3] = "kuva 3";
		lue[4] = "kuva 4";
		lue[5] = "kuva 5";
		lue[6] = "kuva 6";
		lue[7] = "kuva 7";
		lue[8] = "kuva 8";
		lue[9] = "kuva 9";
	} else {
		lue[0] = storytitle;
		lue[1] = "Hey, have you seen those trees over there? They look terrible!";
		lue[2] = "Yeah, I heard it's because of the pests spreading from the nearby forests. Those pesky bark beetles don't know any boundaries!";
		lue[3] = "Well, that's just great. Now our trees are in danger too. What can we do to stop it?";
		lue[4] = "We need to take action and make sure our trees are healthy. Maybe we can put up some barriers to keep the pests out.";
		lue[5] = "But what about the trees that are already infected? We need to cut them down to stop the spread.";
		lue[6] = "I know, it's a tough decision. But if we don't act fast, we could lose all our trees. And that would be a huge economic loss for us.";
		lue[7] = "Yeah, not to mention the loss of our precious carbon sink. We need those trees to fight climate change.";
		lue[8] = "Exactly. We can't afford to lose them. Let's get to work and protect our forests!";
		lue[9] = "Act now!";

	}
	// VOICES in DIALOGUE
	aani[0] = voiceGeneral;
	aani[1] = voiceBear;
	aani[2] = voiceBeaver;
	aani[3] = voiceBear;
	aani[4] = voiceBeaver;
	aani[5] = voiceBear;
	aani[6] = voiceBeaver;
	aani[7] = voiceBear;
	aani[8] = voiceBeaver;
	aani[9] = voiceGeneral;
}
// ----------------------------------


// ----------------------------------
function deviceShaken() {
	// https://p5js.org/reference/#/p5/setShakeThreshold

}
// ----------------------------------
function setup() {
	// cnv = createCanvas(windowWidth, windowHeight, WEBGL);

	createCanvas(windowWidth, windowHeight);


	ypos = round(windowHeight / 2.2);


	// textFont(myFont);
	imageMode(CENTER);
	textSize(60);


	speech = new p5.Speech(voiceReady); //callback, speech
	speech.started(startSpeaking);
	speech.ended(endSpeaking);



	// https://www.youtube.com/watch?v=wf8w1BJb9Xc&embeds_euri=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dp5%2Bspeech%26oq%3Dp5%2Bspeech%26aqs%3Dchrome.0.69i59l3j0i22i30l3j69i60l2.1591j0j7%26sourceid%3Dchrome%26ie%3DUTF-8&feature=emb_rel_pause


	voices = speech.voices;
	print(voices);
	updatePage = true;



	// speech.setVolume(0.7);
	// speech.setRate(2);
	// speech.setPitch(0.2);
	startTime = millis(); // Store the start time



	// Create the play/pause button
	playButton = createButton('Play');
	//playButton.class('my-button'); // button.class('my-button');
	playButton.mousePressed(togglePlay);
	playButton.size(200, 100);
	playButton.position(50, 80);
	//playButton.style("font-family", "Bodoni");
	//playButton.style("font-size", "48px");

	nextPageButton = createButton('>');
	nextPageButton.mousePressed(nextPage);
	nextPageButton.size(100, 100);
	nextPageButton.position(150, 180);
	nextPageButton.style("font-family", "Bodoni");
	nextPageButton.style("font-size", "48px");

	prevPageButton = createButton('<');
	prevPageButton.mousePressed(prevPage);
	prevPageButton.size(100, 100);
	prevPageButton.position(50, 180);
	prevPageButton.style("font-family", "Bodoni");
	prevPageButton.style("font-size", "48px");
}
// ----------------------------------

// ----------------------------------
function nextPage() {

	elapsedTimeSpeechStart = millis();
	elapsedTimeSpeechStart0 = millis();
	speech.stop(endSpeaking);

	prev_imagenum = imagenum;
	imagenum = imagenum + 1;
	prev_image_x = 0;
	prev_image_y = 0;
	if (imagenum > n_image) {
		imagenum = 0;
		animate_speed_y_prev = -animate_speed0;

	} else {
		animate_speed_y_prev = 0;
	}

	updatePage = true;
	animatePage = true;
	animatePage_i = 0;
	animate_speed_prev = animate_speed0;
}
// ----------------------------------

// ----------------------------------
function prevPage() {
	elapsedTimeSpeechStart = millis();
	elapsedTimeSpeechStart0 = millis();
	speech.stop(endSpeaking);

	prev_imagenum = imagenum;
	imagenum = imagenum - 1;
	prev_image_x = 0;
	prev_image_y = 0;
	if (imagenum < 0) {
		imagenum = n_image;
		animate_speed_y_prev = animate_speed0;
	} else {
		animate_speed_y_prev = 0;
	}

	updatePage = true;

	animatePage = true;
	animatePage_i = 0;
	animate_speed_prev = -animate_speed0;
}
// ----------------------------------

// ----------------------------------
function togglePlay() {
	if (!enableSpeaking) {
		// If the audio is currently paused, play it
		// mySound.play();

		elapsedTimeSpeechStart = millis();
		elapsedTimeSpeechStart0 = millis();

		playButton.html('Stop');
		enableSpeaking = true;
		pagenumcolor = 'red';
		speaking = true;
		startPlayingSpeech()
	} else {
		// If the audio is currently playing, pause it
		// mySound.pause();
		playButton.html('Play');
		enableSpeaking = false;

		speech.stop();
		pagenumcolor = 'green';
		// fill(0, 255, 0); // sets the font color to green
		speaking = false;
	}
}
// ----------------------------------

// ----------------------------------
// shiffman has these inside setup:
function startSpeaking() {
	// background(0, 255, 0);
	// fill(255, 0, 0); // sets the font color to red
	pagenumcolor = 'red';
	speaking = true;
}
// ----------------------------------

// ----------------------------------
function endSpeaking() {
	// background(255, 0, 0);
	pagenumcolor = 'green';
	// fill(0, 255, 0); // sets the font color to green
	speaking = false;
	onlypicupdatePage = true;
	// console.log("end speaking - not working?")
}
// .................................

// ----------------------------------
function voiceReady() {
	// https://www.youtube.com/watch?v=v0CHV33wDsI
	console.log(speech.voices);
}
// ----------------------------------

// ----------------------------------
function keyPressed() {
	if (key == 's') {
		speech.stop();
		pagenumcolor = 'green';
		// fill(0, 255, 0); // sets the font color to green
		speaking = false;
	}
}
// ----------------------------------

// ----------------------------------
// DRAW
// ----------------------------------
// auto indect in vscode: shift-alt-f  (and ctrl k f)
function draw() {
	if (animatePage) {
		prev_image_x = prev_image_x - animate_speed_prev;
		prev_image_y = prev_image_y - animate_speed_y_prev * 3;
		animatePage_i = animatePage_i + 1;
		animate_speed_prev = animate_speed_prev * 1.1;


		if (abs(prev_image_x) > windowWidth) {
			animatePage = false;
			print(animatePage_i);
		}

		if (animatePage_i > animatePageN) {

		}
	}


	//fill(0);
	//stroke(0);
	//rect(0, 0, windowWidth, 60);
	//fill(100);
	//textSize(15);
	
	elapsedTime = millis() - startTime; // Calculate the elapsed time


	// -------------------------------------
	// animate page away
	// ----------------------------------

	if (updatePage | onlypicupdatePage | animatePage) {
		background(0);
	}
	timeusageAnalysis()


	if (updatePage | onlypicupdatePage | animatePage) {
		
		textSize(24);

		// ----------------------------------
		// peruskuva
		// ----------------------------------
		push();
		translate(windowWidth / 2, ypos);

		fill(0, 40, 40);
		rectMode(CENTER);
		textAlign(CENTER);
		rect(0, 0, imgs[imagenum].width + 20, imgs[imagenum].height + 20);

		image(imgs[imagenum], 0, 0);

		if (animatePage & showThinking) {
			fill(0, 255, 0);
			let nopeus = 40;
			let anim_logo_koko = 8;
			ellipse(imgs[imagenum].width / 2 - 30 + sin(millis() / nopeus) * anim_logo_koko, imgs[imagenum].height / 2 - 30 + cos(millis() / nopeus) * anim_logo_koko, 5, 5);
		}

		// animation parts: check if locked or not:
		fill(pagenumcolor);
		textSize(32);

		textAlign(LEFT, BOTTOM);
		//let aikaajaljella = round(timeleft - (millis() - startTimeText) / 1000);
		//if (aikaajaljella > 0) {
		//	text(imagenum + ": " + aikaajaljella, 20, 20);
		//} else {
		text(imagenum + 1, 10 - imgs[imagenum].width / 2, imgs[imagenum].height / 2 - 10);
		//}

		pop();
		// Start speaking
		// ----------------------------------


		// ----------------------------------
		// lentava kuva
		// ----------------------------------

		push();
		translate(windowWidth / 2 + prev_image_x, ypos + prev_image_y);
		image(imgs[prev_imagenum], 0, 0, imgs[prev_imagenum].width - animate_speed_prev * 4, imgs[prev_imagenum].height - animate_speed_prev * 4);
		pop();
		// ----------------------------------


		// ----------------------------------
		kuvaTeksti();
		// ----------------------------------


		// ----------------------------------
		// puhe
		// ----------------------------------
		if (updatePage) {
			if (enableSpeaking) {
				startPlayingSpeech();
			}
		}
		// ----------------------------------
		updatePage = false;
		onlypicupdatePage = false;
	}


	// ----------------------------------
	// OLD
	// ----------------------------------
	if (isMouseClicked) {
		if (!speaking) {

		}
		isMouseClicked = false;
	}
	// ----------------------------------



	fill(pagenumcolor);
	//textSize(32);

	//textAlign(LEFT, TOP);
	// animation parts: check if locked or not:
	//fill(pagenumcolor);

	let aikaajaljella = (timeleft * 1000 - (millis() - startTimeText));
	if (aikaajaljella > 0 & speaking) {

		rectMode(CORNER);
		//print(elapsedTimeSpeech);
		// let elapsedTimeSpeechStart0 = elapsedTimeSpeechStart;
		elapsedTimeSpeech = elapsedTimeSpeech + millis() - elapsedTimeSpeechStart;
		elapsedTimeSpeechStart = millis();
		// text(elapsedTimeSpeech, 20, 20);
		let leveyspalkki = map(millis() - elapsedTimeSpeechStart0, 0, timeleft * 1000, 0, imgs[imagenum].width - 8);
		rectMode(CORNER);
		fill(200, 0, 0);
		push();
		translate(windowWidth / 2 - imgs[imagenum].width / 2 + 4, ypos + imgs[imagenum].height / 2 + 3);
		rect(0, 0, leveyspalkki, 3);
		pop();
	}

}

function timeusageAnalysis() {
rectMode(CENTER);
	push();
	translate(windowWidth / 2, ypos);

	//fill(50, 0, 0);
	fill(0, 0, 0);
	rect(0, imgs[imagenum].height / 2 + 24, imgs[imagenum].width, 22);
	fill(4, 70, 40);
	rectMode(CENTER);

	textAlign(CENTER);
	textSize(14);
	text("Speech/Read time: " + floor(elapsedTimeSpeech / 1000) + " / " + floor(elapsedTime / 1000) + " secs", 0, imgs[imagenum].height / 2 + 20); // Display the elapsed time

	pop();
}


function startPlayingSpeech() {

	// chatGPT
	let sentence = lue[imagenum];
	let speakingTime = sentence.split(" ").length / speakingRate * 60; // in seconds
	console.log("The sentence will take " + speakingTime.toFixed(1) + " seconds to speak.");



	timeleft = speakingTime.toFixed(1);
	startTimeText = millis();

	speech.setVoice(aani[imagenum]);
	//speech.setRate(1); // vary for speaker 0-2 1 = normal - LATER: buttons
	// The normal speaking rate for the English language is typically around 125-150 words per minute. In the p5.speech library, the default value for the rate parameter of the setRate() method is 1.0, which corresponds to the normal speaking rate.
	// Therefore, if you set the rate parameter to 1.0 in p5.speech, the speaking rate will be approximately 125-150 words per minute, which is the normal speaking rate for English.
	speech.speak(lue[imagenum]);
}


function kuvaTeksti() {

	rectMode(CORNER);




	let siirray;
	if (tekstikuvanpaalla) {
		siirray = imgs[imagenum].height;
	} else {
		siirray = 0;
	}

	let tekstiy = ypos + imgs[imagenum].height / 2 - siirray;
	let tekstix = imgs[imagenum].width / 2; // windowWidth / 2; // not so wide if wide screen
	let tekstiytila = imgs[imagenum].height; // 200;
	let varjostus = 2;

	if (aani[imagenum] == voiceBear) {
		textAlign(RIGHT, TOP);

		fill(50, 20, 20);
		text(lue[imagenum], windowWidth / 2 - 10 - tekstix, tekstiy, tekstix, tekstiytila);
		fill(240, 90, 90);
		text(lue[imagenum], windowWidth / 2 - 10 - tekstix + varjostus, tekstiy + varjostus, tekstix, tekstiytila);

	} else if ((aani[imagenum] == voiceBeaver)) {
		textAlign(LEFT, TOP);
		fill(43, 50, 43);
		text(lue[imagenum], windowWidth / 2 + 10, tekstiy, tekstix, tekstiytila);
		fill(90, 240, 90);
		text(lue[imagenum], windowWidth / 2 + 10 + varjostus, tekstiy + varjostus, tekstix, tekstiytila);
	} else {
		//rectMode(CORNER);
		textAlign(CENTER, TOP);
		fill(66, 66, 66);
		text(lue[imagenum], windowWidth / 2 - tekstix, tekstiy, tekstix * 2, tekstiytila);

		fill(222, 222, 222);
		text(lue[imagenum], windowWidth / 2 - tekstix + varjostus, tekstiy + varjostus, tekstix * 2, tekstiytila);
	}
	// print(imgs[imagenum].height);
}


// function mousePressed() {
//	if (!isMouseClicked) {
//		isMouseClicked = true;
//	}
//	onlypicupdatePage = true;
// }

function touchStarted() {
	let fs = fullscreen();
	if (!fs) {
		fullscreen(true);
	}

	print("kosketus");
	// if (getAudioContext().state !== 'running') {
	// 	getAudioContext().resume();
	// 	mic = new p5.AudioIn();
	// 	mic.start();
	// 	soundrestarted = soundrestarted + 1;
	// }



}

function centerCanvas() {
	// var x = (windowWidth - width) / 2;
	// var y = (windowHeight - height) / 2;
	resizeCanvas(windowWidth, windowHeight);
	// cnv.position(x, y);
	// cnv.position(0, 0);
	// cnv.style('z-index', '-1'); // https://www.youtube.com/watch?v=OIfEHD3KqCg

	onlypicupdatePage = true;
}

/* full screening will change the size of the canvas */
function windowResized() {
	// resizeCanvas(windowWidth, windowHeight);
	// https://github.com/processing/p5.js/wiki/Positioning-your-canvas
	centerCanvas();

	onlypicupdatePage = true;
}

