
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

speechSynthesis.onvoiceschanged = populateVoices;

function testVoice() {
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

function startTest() {
  document.getElementById("settings").style.display = "none";
  document.getElementById("question-box").style.display = "block";
  document.getElementById("totalQuestions").textContent = words.length;
  currentIndex = 0;
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
  } else {
    feedback.textContent = `❌ טעות. התשובה הנכונה היא: ${correct}`;
  }

  currentIndex++;
  if (currentIndex < words.length) {
    setTimeout(showQuestion, 1500);
  } else {
    setTimeout(() => {
      alert("🎉 סיימת את מבחן האיות!");
      location.reload();
    }, 2000);
  }
}

function handleKey(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

function speakCurrentWord() {
  speak(words[currentIndex].word);
}
