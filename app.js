import countries from './countries.js';

const fromText = document.querySelector('.from-text');
const toText = document.querySelector('.to-text');
const selectTag = document.querySelectorAll('.selection-table');
const translateBtn = document.querySelector('.translate-btn');
const exchangeBtn = document.querySelector('.exchange');
const icons = document.querySelectorAll('.row i');
const audio = document.querySelector('audio');

selectTag.forEach((tag, id) => {
    for(let key in countries) {
        let selected;
        if(id == 0 && key == 'en-GB') {
            selected = "selected"
        } else if(id == 1 && key == 'vi-VN') {
            selected = "selected"
        }

        tag.innerHTML += `<option 
            value=${key}
            ${selected}
        >
            ${countries[key]}
        </option>`;
    }
})

exchangeBtn.addEventListener('click', function() {
    const tempLang =  selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;

    fromText.value = '';
    toText.value = '';
})

icons.forEach((icon) => {
    icon.addEventListener('click', function(e) {
        if(e.target.classList.contains("copy__icon")) {
            if(e.target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if(e.target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
                (selectTag[0].value == 'vi-VN') ? textToSpeech(fromText.value) : speechSynthesis.speak(utterance);
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
                (selectTag[1].value == 'vi-VN') ? textToSpeech(toText.value) : speechSynthesis.speak(utterance);
            }
        }
    })
})

function checkExists(audioFile, callback) {
    audioFile.onerror = function() {
        callback(false);
    };

    audioFile.onload = function() {
        callback(true);
    };
}

function textToSpeech(text) {
    const apiUrl = 'https://api.fpt.ai/hmi/tts/v5';
    fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'api-key': 'uEMYpPhwQTTT8Fa5H7DFpw5J0ks7738X',
                    'voice': 'banmai',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                body: text
            })
                .then((res) => res.json())
                .then((data)=> {
                    audio.src= data.async;
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(function() {
                            // Automatic playback started!
                        }).catch(function(error) {
                            // Automatic playback failed.
                            // Show a UI element to let the user manually start playback.
                        });
                    }
                    checkExists(audio, function(isCheck) {
                        if(!isCheck) {
                            alert("Wait a while for text-to-speech"); 
                        }
                    })
                })
}

translateBtn.addEventListener('click', function() {
    const text = fromText.value;
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    
    fetch(apiUrl) 
        .then((res) => res.json())
        .then((data) => {
            toText.value = data.matches[0].translation;   
        })
        .catch((error) => {
            alert("Nothing");
        })
})
