const express = require("express");
var server = express();
// const socketIO = require("socket.io");
var http = require('http').Server(server);
var io = require('socket.io')(http);
// var io = socketIO(server);

const path = require("path");
var fs = require('fs');
var logger;

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'public/index.html');

var record = [];
var contentedNum = 0, relaxedNum = 0, calmNum = 0,
fatiguedNum = 0, boredNum = 0, depressedNum = 0, upsetNum = 0, stressedNum =
0, nervousNum = 0, alertNum = 0, excitedNum = 0, happyNum = 0;
var emotionsResult = [];

// Start server
server.get('/', function(req, res){
    res.sendFile(INDEX);
})
server.use(express.static('public'));
http.listen(PORT, () => console.log("Listening on localhost:" + PORT));

io.on('connection', function (socket) {
	console.log('a user connected', socket.id);
	socket.emit('requestData', {allRecord: record, emotionTotal: emotionsResult});

	socket.on('emotionRecord', function(timeData){
		console.log(timeData);
		emotionAnalysis(timeData.emotions);
		var time = timeData.time.toString();
		var emotionType = timeData.emotions;

		writeToFile();
		logger.write('\n');
		logger.write(time);
		logger.write(': ');
		logger.write(emotionType);
		logger.end();

		record.push(timeData);
		socket.emit('requestData', {allRecord: record, emotionTotal: emotionsResult});
	})
});

function emotionAnalysis(emotion){
	var emotionType = "";
	emotionType = emotion;
	switch(emotionType){
		case "contented":
			contentedNum++;
			break;
		case "relaxed":
			relaxedNum++;
			break;
		case "calm":
			calmNum++;
			break;
		case "fatigued":
			fatiguedNum++;
			break;
		case "bored":
			boredNum++;
			break;
		case "depressed":
			depressedNum++;
			break;
		case "upset":
			upsetNum++;
			break;
		case "stressed":
			stressedNum++;
			break;
		case "nervous":
			nervousNum++;
			break;
		case "alert":
			alertNum++;
			break;
		case "excited":
			excitedNum++;
			break;
		case "happy":
			happyNum++;
			break;
		case "blank":
			break;
	}
	emotionsResult = [contentedNum, relaxedNum, calmNum,
fatiguedNum, boredNum, depressedNum, upsetNum, stressedNum, nervousNum, alertNum, excitedNum, happyNum]
}

function writeToFile(){
	logger = fs.createWriteStream('public/emotionReport.txt', {
	    'flags': 'a' // 'a' means appending (old data will be preserved)
	})
}
