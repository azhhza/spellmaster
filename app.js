
const words = [
  { word: "bag", translation: "תיק", category: "Noun" },
  { word: "cat", translation: "חתול", category: "Noun" },
  { word: "black", translation: "שחור", category: "Adjective" },
  { word: "glass", translation: "כוס", category: "Noun" },
  { word: "class", translation: "כיתה", category: "Noun" },
  { word: "bed", translation: "מיטה", category: "Noun" },
  { word: "left", translation: "שמאל", category: "Adjective/Verb" },
  { word: "egg", translation: "ביצה", category: "Noun" },
  { word: "ten", translation: "עשר", category: "Number" },
  { word: "pen", translation: "עט", category: "Noun" },
  { word: "pill", translation: "גלולה", category: "Noun" },
  { word: "fish", translation: "דג", category: "Noun" },
  { word: "ship", translation: "אונייה", category: "Noun" },
  { word: "pin", translation: "סיכה", category: "Noun" },
  { word: "six", translation: "שש", category: "Number" },
  { word: "fox", translation: "שועל", category: "Noun" },
  { word: "frog", translation: "צפרדע", category: "Noun" },
  { word: "job", translation: "עבודה", category: "Noun" },
  { word: "hot", translation: "חם", category: "Adjective" },
  { word: "doll", translation: "בובה", category: "Noun" },
  { word: "sun", translation: "שמש", category: "Noun" },
  { word: "bus", translation: "אוטובוס", category: "Noun" },
  { word: "truck", translation: "משאית", category: "Noun" },
  { word: "duck", translation: "ברווז", category: "Noun" },
  { word: "run", translation: "לרוץ", category: "Verb" }
];

let currentIndex = 0;
let selectedVoice = null;
let speechRate = 1;
let score = 0;
let wrongAnswers = [];

function populateVoices() {
  const voiceSelect = document.getElementById("voiceSelect");
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes('en'));
  voiceSelect.innerHTML = '';
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
  if (voices.length > 0) selectedVoice = voices[0];
}

function waitForVoices(timeout = 3000) {
  return new Promise(resolve => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve();
      return;
    }
    let interval = setInterval(() => {
      voices = speechSynthesis.getVoices();
      if (voices.length !== 0) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      resolve();
    }, timeout);
  });
}

speechSynthesis.onvoiceschanged = populateVoices;

async function testVoice() {
  await waitForVoices();
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes('en'));
  const index = document.getElementById("voiceSelect").value;
  selectedVoice = voices[index];
  speechRate = parseFloat(document.getElementById("rateRange").value);
  speak("Hello! I will help you spell English words.");
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = speechRate;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function updateRateLabel() {
  const rate = parseFloat(document.getElementById("rateRange").value);
  let label = "רגיל";
  if (rate < 0.7) label = "איטי מאוד";
  else if (rate < 0.9) label = "איטי";
  else if (rate > 1.2) label = "מהיר מאוד";
  else if (rate > 1.05) label = "מהיר";
  document.getElementById("rateLabel").textContent = label;
}

document.getElementById("rateRange").addEventListener("input", updateRateLabel);

async function startTest() {
  await waitForVoices();
  populateVoices();
  const index = document.getElementById("voiceSelect").value;
  const voices = speechSynthesis.getVoices().filter(v => v.lang.includes('en'));
  selectedVoice = voices[index];
  speechRate = parseFloat(document.getElementById("rateRange").value);

  document.getElementById("settings").style.display = "none";
  document.getElementById("question-box").style.display = "block";
  document.getElementById("scoreBox").style.display = "block";
  document.getElementById("totalQuestions").textContent = words.length;
  score = 0;
  currentIndex = 0;
  wrongAnswers = [];
  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  const current = words[currentIndex];
  document.getElementById("questionNumber").textContent = currentIndex + 1;
  document.getElementById("translation").textContent = current.translation;
  document.getElementById("category").textContent = current.category;
  document.getElementById("userInput").value = "";
  document.getElementById("feedback").textContent = "";
  speak(current.word);
}

function submitAnswer() {
  const input = document.getElementById("userInput").value.trim().toLowerCase();
  const correct = words[currentIndex].word.toLowerCase();
  const feedback = document.getElementById("feedback");

  if (input === correct) {
    feedback.textContent = "✔️ נכון!";
    score += 4;
  } else {
    feedback.textContent = `❌ טעות. התשובה הנכונה היא: ${correct}`;
    wrongAnswers.push({ ...words[currentIndex], userAnswer: input });
  }

  updateScoreDisplay();
  currentIndex++;
  if (currentIndex < words.length) {
    setTimeout(showQuestion, 1500);
  } else {
    setTimeout(showFinalResults, 2000);
  }
}

function updateScoreDisplay() {
  document.getElementById("scoreDisplay").textContent = `ניקוד: ${score} / ${words.length * 4}`;
}

function showFinalResults() {
  const resultBox = document.createElement("div");
  resultBox.style.padding = "1rem";
  resultBox.style.backgroundColor = "rgba(255,255,255,0.2)";
  resultBox.style.borderRadius = "10px";
  resultBox.innerHTML = `<h3>🎯 סיימת! הניקוד שלך: ${score} מתוך ${words.length * 4}</h3>`;

  if (wrongAnswers.length > 0) {
    resultBox.innerHTML += "<h4>טעויות שלך:</h4><ul>";
    wrongAnswers.forEach(w => {
      resultBox.innerHTML += `<li>❌ <b>${w.translation}</b> — כתבת: <i>${w.userAnswer}</i> | תשובה נכונה: <b>${w.word}</b></li>`;
    });
    resultBox.innerHTML += "</ul>";
  } else {
    resultBox.innerHTML += "<p>✔️ כל הכבוד! לא טעית בכלל!</p>";
  }

  document.body.appendChild(resultBox);
}

function handleKey(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

function speakCurrentWord() {
  speak(words[currentIndex].word);
}


function saveLastResult() {
  const now = new Date();
  const result = {
    score,
    total: words.length * 4,
    date: now.toLocaleDateString("he-IL"),
    time: now.toLocaleTimeString("he-IL")
  };
  localStorage.setItem("lastSpellMasterResult", JSON.stringify(result));
}

function loadLastResult() {
  const data = localStorage.getItem("lastSpellMasterResult");
  if (!data) return;
  const result = JSON.parse(data);
  const box = document.createElement("div");
  box.style.backgroundColor = "#f8f8f8";
  box.style.border = "1px solid #ccc";
  box.style.borderRadius = "8px";
  box.style.padding = "10px";
  box.style.marginBottom = "10px";
  box.style.textAlign = "right";
  box.style.fontSize = "16px";
  box.innerHTML = `📌 <b>תוצאתך האחרונה:</b> ${result.score} / ${result.total} בתאריך ${result.date}, ${result.time}`;
  document.body.insertBefore(box, document.body.firstChild);
}

window.addEventListener("DOMContentLoaded", loadLastResult);
