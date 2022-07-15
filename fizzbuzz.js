var players = [];
var addPlayerInput = document.form_players.nickname;
var currentNumber = 1;
var currPlayer;
var singlePlayer = false;
var highestScore = 100;

function playGame() {
    document.getElementById('title').style.fontSize='5vmax';
    document.getElementById('footer').style.display='None';
    document.getElementById('playButton').style.display='None';
    document.getElementById('before-start-game').style.display='block';
}

function addName() {
    var nickname = document.form_players.nickname.value;
    var namelist = document.getElementById('players')
    if (nickname != "") {
        players.push(nickname)
    }
    namelist.innerHTML = players.join('<br class="namelist">');
    document.form_players.nickname.value = '';
    namelist.scrollIntoView({behavior:"smooth", block:"end"});
}
addPlayerInput.addEventListener("keypress", function(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById("addName-button").click();
    }
});

function startGame() {
    if (players.length != 0) {
        // block out current content
        document.getElementById('before-start-game').style.display='None';
        // diplay game content
        document.getElementById('game').style.display='flex';
        document.getElementById('game').style.flexDirection='column';
        currPlayer = players.shift()
        if (players.length == 0) {
            singlePlayer = true;
        }
        document.getElementById('playername').innerHTML = currPlayer;
        document.getElementById('number').innerHTML = currentNumber;
        document.getElementById('neitherOption').innerHTML = currentNumber;
        // display footer
        document.getElementById('footer').style.display='block';
        document.getElementById('game-rules').style.fontSize='1.3vmax';
        var gameRules = document.getElementById('game-rules').innerHTML;
        gameRules = gameRules.split("<br>");
        gameRules = gameRules.shift() + "<br>" + gameRules.slice(0, 2).join(", ") + "<br>" + gameRules.pop();
        document.getElementById('game-rules').innerHTML = gameRules;
        document.getElementById('game-rules-title').style.fontSize='1.6vmax';
    }
}

function choose(option) {
    var correct;
    if (currentNumber % 6 == 0) {
        correct = 'FIZZBUZZ';
    } else if (currentNumber % 2 == 0) {
        correct = 'FIZZ';
    } else if (currentNumber % 3 == 0) {
        correct = 'BUZZ';
    } else {
        correct = 'neither';
    }
    if (option == correct) {
        // yay correct
        players.push(currPlayer);
        currPlayer = players.shift();
        currentNumber += 1;
        if (currentNumber > highestScore) {
            if (singlePlayer == false) {
                currPlayer = "EVERYONE"
            }
            swal({
                title: currPlayer + " WINS!!!",
                text: "WOOHOOOOOOOOOOOO!!!",
                button: {text:"Play Again!", className:"replayButton"},
                className: "popup-text"
            }).then(function () {
                window.location.reload();
            });
        }
        document.getElementById('playername').innerHTML = currPlayer;
        document.getElementById('number').innerHTML = currentNumber;
        document.getElementById('neitherOption').innerHTML = currentNumber;
    } else {
        // oh no
        if (correct == 'neither') {
            correct = currentNumber
        }
        if (singlePlayer == true) {
            swal("Oops... :P", "Correct answer is " + correct + "!", {
                button: {text:"Play Again!", className:"replayButton"},
                className: "popup-text"
            }).then(function () {
                window.location.reload();
            });
        } else {
            swal("Oops... :P", "Correct answer is " + correct + "!", {
                buttons: false,
                className: "popup-text"
            }).then(function() {
                currPlayer = players.shift();
                if (players.length == 0) {
                    swal({
                        title: currPlayer + " WINS!!!",
                        text: "WOOHOOOOOOOOOOOO!!!",
                        button: {text:"Play Again!", className:"replayButton"},
                        className: "popup-text"
                    }).then(function () {
                        window.location.reload();
                    });
                }
                currentNumber += 1;
                document.getElementById('playername').innerHTML = currPlayer;
                document.getElementById('number').innerHTML = currentNumber;
                document.getElementById('neitherOption').innerHTML = currentNumber;
            });
        }
    }
}


/************************ Speech reognition section ***********************/
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
var words = ['FIZZBUZZ' , 'FIZZ' , 'BUZZ', currentNumber.toString()];
var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

document.getElementById("mic-Button").onclick = function() {
    words.pop();
    words.push(currentNumber.toString());
    grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'
    speechRecognitionList.addFromString(grammar, 1);
    
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
}

recognition.onstart = function() {
    document.getElementById("mic-Button").style.borderColor = 'skyblue';
}

recognition.onresult = function(event) {
    // detect speech
    var final_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        final_transcript += event.results[i][0].transcript;
    }
    // clean and deal with common pronounciation errors for fizz & buzz
    final_transcript = final_transcript.toUpperCase();
    if (final_transcript.startsWith("BE")) {
        final_transcript = "FE".concat(final_transcript.substring(2));
    } else if (final_transcript.startsWith("BEA")) {
        final_transcript = "FI".concat(final_transcript.substring(3));
    } else if (final_transcript == "FIFA") {
        final_transcript = "FIBA";
    } else if (final_transcript == "WHEN" && currentNumber == 1) {
        final_transcript = "1";
    }
    // get most similar word out of possible options
    var fuzzyMatchScore = getSimilarity(final_transcript, words[0]);;
    var fuzzyMatchIndex = 0;
    for (var i = 1; i < 4; i++) {
        var score = getSimilarity(final_transcript, words[i]);
        if (score < fuzzyMatchScore) {
            fuzzyMatchScore = score;
            fuzzyMatchIndex = i
        }
    }
    // confirm with player if option is correctly recognised
    swal({
        title: words[fuzzyMatchIndex] + '?',
        text: 'I heard "' + final_transcript + '"!',
        buttons: {
            cancel: 'No you got it wrong!', 
            confirm: 'Yep I said that',
        },
        className: "popup-text",
        closeOnClickOutside: false,
        html: true,
        customClass: 'swal-wide'
    }).then((result => {
        if (result) {
            // submit option
            var option = words[fuzzyMatchIndex];
            if (words[fuzzyMatchIndex] == currentNumber.toString()) {
                option = "neither";
            }
            return choose(option);
        } else {
            // listen again
            document.getElementById("mic-Button").click();
        }
    }));
};

recognition.onend = function() {
    document.getElementById("mic-Button").style.borderColor = '';
}



function soundex(text) {
    if (!isNaN(text)) { // handle numeric cases
        return text
    }
    var s = text.charAt(0).toUpperCase();
    var si = 1;
    var c = 0;
    let mappings = "01230120022455012623010202"
    while ((s.length < 4) && (si < text.length)) {
        c = text.charAt(si).toUpperCase().charCodeAt(0) - 65;
        if ((c >= 0 && c <= 25) && (mappings.charAt(c) != '0') && (mappings.charAt(c) != s.charAt(s.length - 1))) {
            s = s + mappings.charAt(c);
        }
        si++;
    }
    s = s + "000";
    s = s.substring(0, 4);
    return s;
}

function LevenshteinDistance(a, b){
    // initialize matrix
    var matrix = Array(a.length + 1);
    for (var i = 0; i < a.length + 1; i++) {
        matrix[i] = Array(b.length + 1)
        matrix[i].fill(0, 0, b.length + 1);
    }
    for (var i = 0; i < a.length + 1; i++) {
        matrix[i][0] = i;
    }
    for (var j = 0; j < b.length + 1; j++) {
        matrix[0][j] = j;
    }
    // calculations
    var val1;
    var val2;
    var val3;
    for (var i = 1; i < a.length + 1; i++) {
        for (var j = 1; j < b.length + 1; j++) {
            val1 = matrix[i][j - 1] + 1;
            val2 = matrix[i - 1][j] + 1;
            if (a.charAt(i - 1) == b.charAt(j - 1)) {
                val3 = matrix[i - 1][j - 1];
            } else {
                val3 = matrix[i - 1][j - 1] + 1;
            }
            matrix[i][j] = Math.min(val1, val2, val3);
        }
    }
    return matrix[a.length][b.length];
}
function getSimilarity(a, b) {
    a = soundex(a);
    b = soundex(b);
    return LevenshteinDistance(a, b)
}