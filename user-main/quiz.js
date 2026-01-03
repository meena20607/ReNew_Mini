document.addEventListener("DOMContentLoaded", function () {

  const allQuestions = [
    { q: "What is the best way to deal with an old, working phone?", options: ["Throw it in the trash", "Give it away or sell it", "Store it in a drawer forever"], answer: 1 },
    { q: "Which of these contains a battery that can catch fire if damaged?", options: ["Smartphone", "TV Remote", "Flashlight"], answer: 0 },
    { q: "What should you do with personal data before recycling a laptop?", options: ["Nothing", "Delete files and wipe the drive", "Just turn it off"], answer: 1 },
    { q: "Which symbol on a product means it should NOT be thrown in a regular bin?", options: ["A green leaf", "A crossed-out wheelie bin", "A recycling triangle"], answer: 1 },
    { q: "Which part of a computer is most valuable for recycling?", options: ["The plastic case", "The glass screen", "The circuit board"], answer: 2 },
    { q: "What is e-waste?", options: ["Electronic trash", "Enviromental waste", "Energy waste"], answer: 0 },
    { q: "Why is it bad to burn e-waste?", options: ["It smells good", "It releases toxic fumes", "It creates electricity"], answer: 1 },
    { q: "Can most parts of a mobile phone be recycled?", options: ["No, only the screen", "Yes, up to 80-90%", "None of it"], answer: 1 },
    { q: "Where is the safest place to drop off old chargers?", options: ["Local park", "E-waste collection center", "Side of the road"], answer: 1 },
    { q: "What harmful metal is often found in old bulky TVs?", options: ["Gold", "Lead", "Silver"], answer: 1 },
    { q: "Which of these is NOT e-waste?", options: ["Old iPad", "Used alkaline battery", "A wooden chair"], answer: 2 },
    { q: "What does 'Repair' help with in e-waste management?", options: ["Makes more waste", "Extends product life", "Increases price"], answer: 1 },
    { q: "Small electronics like headphones are e-waste.", options: ["True", "False", "Only if they have wires"], answer: 0 },
    { q: "What should you do with a leaking battery?", options: ["Touch it with bare hands", "Put it in a bag and take it to a pro", "Flush it"], answer: 1 },
    { q: "Recycling 1 million laptops saves energy equivalent to powering how many homes?", options: ["10 homes", "Over 3,000 homes", "0 homes"], answer: 1 }
  ];

  allQuestions.sort(() => Math.random() - 0.5);
  const quizData = allQuestions.slice(0, 3);

  let current = 0;
  let selected = -1;
  let userResults = []; // To track answers

  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  const nextBtn = document.getElementById("nextBtn");
  const counterEl = document.getElementById("quizCounter");
  const progressEl = document.getElementById("quizProgress");

  function loadQuestion() {
    selected = -1;
    optionsEl.innerHTML = ""; 

    const q = quizData[current];
    questionEl.innerText = q.q;

    q.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        selected = index;
        document.querySelectorAll("#quizOptions button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
      optionsEl.appendChild(btn);
    });

    counterEl.innerText = `Question ${current + 1} of 3`;
    progressEl.style.width = ((current + 1) / 3) * 100 + "%";
  }

  nextBtn.onclick = () => {
    if (selected === -1) {
      alert("Select an option first 🙂");
      return;
    }

    // Store current result
    userResults.push({
      question: quizData[current].q,
      selectedAnswer: quizData[current].options[selected],
      correctAnswer: quizData[current].options[quizData[current].answer],
      isCorrect: selected === quizData[current].answer
    });

    current++;
    if (current < 3) {
      loadQuestion();
    } else {
      showResults();
    }
  };

  function showResults() {
  questionEl.innerText = "Quiz Results Summary";
  optionsEl.innerHTML = ""; 
  nextBtn.style.display = "none";
  progressEl.style.width = "100%";
  counterEl.innerText = "Completed";

  let resultsHTML = "<div class='results-container'>";
  
  userResults.forEach((res, i) => {
    const statusIcon = res.isCorrect ? "✅" : "❌";
    const color = res.isCorrect ? "#28a745" : "#dc3545";
    
    resultsHTML += `
      <div style="margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; text-align: left;">
        <p><strong>Q${i+1}: ${res.question}</strong></p>
        <p style="color: ${color};">${statusIcon} Your Answer: ${res.selectedAnswer}</p>
        ${!res.isCorrect ? `<p style="color: #28a745; font-weight: bold;">✔️ Correct: ${res.correctAnswer}</p>` : ""}
      </div>
    `;
  });

  // Added IDs to buttons and a container for styling
  resultsHTML += `
    <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
      <button id="retryBtn" class="final-btn">Try New Questions</button>
      <button id="doneBtn" class="final-btn done-style">Done</button>
    </div>
  </div>`;
  
  optionsEl.innerHTML = resultsHTML;

  // --- BUTTON LOGIC ---

  // 1. Try New Questions (Reloads the quiz)
  document.getElementById("retryBtn").onclick = () => window.location.reload();

  // 2. Done (Goes back to the user main page)
  document.getElementById("doneBtn").onclick = () => {
    // This path goes back to the index.html in the user-main folder
    window.location.href = "index.html"; 
  };
}

  loadQuestion();
});