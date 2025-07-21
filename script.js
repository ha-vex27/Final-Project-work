let currentLevel = 1;
let score = 0;
let timer = 60;
let timerInterval;
let heroName = '';
let correctAnswers = 0;
let currentCorrectAnswer = 0;
const totalQuestions = 10;
let completedLevels = [false, false, false, false, false];
const progressImages = [
  'images/c1.jpeg',
  'images/c2.jpg',
  'images/c3.jpg',
  'images/c4.jpeg',
  'images/c5.jpeg',
  'images/Dragon.png'
];

// Audio elements
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');
const dragonSound = new Audio('sounds/dragon.mp3');
const clappingSound = new Audio('sounds/clapping.mp3');

// Load saved progress
function loadProgress() {
  const saved = localStorage.getItem('mathQuestProgress');
  if (saved) {
    completedLevels = JSON.parse(saved);
  }
}

// Save progress
function saveProgress() {
  localStorage.setItem('mathQuestProgress', JSON.stringify(completedLevels));
}

// Reset progress
function resetProgress() {
  completedLevels = [false, false, false, false, false];
  saveProgress();
}

function sanitizeInput(input) {
  return input.replace(/</g, '<').replace(/>/g, '>').trim();
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'game-screen') {
    updateCastleMarkers();
    updateQuestionCounter();
    startTimer();
  }
  if (screenId === 'castle-screen') {
    updateCastleButtons();
    document.getElementById('hero-greeting').innerHTML = `Hero <span class="hero-name">${heroName}</span>, conquer each castle to reach the final challenge:`;
  }
  if (screenId === 'victory-screen') {
    clappingSound.play().catch(() => {});
    setTimeout(() => {
      clappingSound.pause();
      clappingSound.currentTime = 0;
    }, 5000);
  }
  if (screenId === 'home-screen') {
    resetProgress();
  }
}

function validateNameInput() {
  const heroNameInput = document.getElementById('hero-name').value.trim();
  const startBtn = document.getElementById('startAdventureBtn');
  startBtn.disabled = heroNameInput.length === 0;
}

function updateCastleMarkers() {
  const currentCastleImg = document.getElementById('current-castle');
  const nextCastleImg = document.getElementById('next-castle');
  const currentLabel = document.getElementById('current-castle-label');
  const nextLabel = document.getElementById('next-castle-label');
  const currentIndex = currentLevel - 1;
  const nextIndex = currentLevel < 5 ? currentLevel : 5;
  currentCastleImg.src = progressImages[currentIndex];
  currentCastleImg.title = `Castle ${currentLevel}`;
  currentCastleImg.classList.remove('dragon');
  nextCastleImg.src = progressImages[nextIndex];
  nextCastleImg.title = nextIndex === 5 ? 'Dragon' : `Castle ${nextIndex + 1}`;
  nextCastleImg.classList.toggle('dragon', nextIndex === 5);
  const startPercent = (currentLevel - 1) * 20;
  const endPercent = startPercent + 20;
  currentCastleImg.style.left = `${startPercent}%`;
  nextCastleImg.style.left = `${endPercent}%`;
  currentLabel.style.left = `${startPercent}%`;
  currentLabel.textContent = `${startPercent}%`;
  nextLabel.style.left = `${endPercent}%`;
  nextLabel.textContent = `${endPercent}%`;
  if (nextIndex === 5) {
    dragonSound.play().catch(() => {});
  }
}

function updateQuestionCounter() {
  document.getElementById('question-number').textContent = correctAnswers + 1;
}

function startAdventure() {
  heroName = sanitizeInput(document.getElementById('hero-name').value);
  if (heroName) {
    loadProgress();
    showScreen('castle-screen');
  }
}

function startLevel(level) {
  if (!isLevelUnlocked(level)) return;
  currentLevel = level;
  score = 0;
  correctAnswers = 0;
  timer = 60;
  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timer;
  document.getElementById('level-number').textContent = level;
  document.getElementById('level-type').textContent = getLevelName(level);
  updateProgress();
  updateQuestionCounter();
  generateQuestion();
  showScreen('game-screen');
}

function getLevelName(level) {
  const names = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Mixed'];
  return names[level - 1];
}

function isLevelUnlocked(level) {
  if (level === 1) return true;
  return completedLevels[level - 2];
}

function updateCastleButtons() {
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`castle-btn-${i}`);
    btn.disabled = !isLevelUnlocked(i);
  }
}

function generateQuestion() {
  let a, b, op, answer;
  if (currentLevel === 1) {
    // Addition: 1–10
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    op = '+';
    answer = a + b;
  } else if (currentLevel === 2) {
    // Subtraction: 1–20
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    if (a < b) [a, b] = [b, a];
    op = '-';
    answer = a - b;
  } else if (currentLevel === 3) {
    // Multiplication: 1–12
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    op = '*';
    answer = a * b;
  } else if (currentLevel === 4) {
    // Division: Dividend up to 100, divisor 1–10
    b = Math.floor(Math.random() * 10) + 1;
    answer = Math.floor(Math.random() * 10) + 1;
    a = answer * b;
    op = '/';
  } else {
    // Mixed: Randomly select from above ranges
    const ops = ['+', '-', '*', '/'];
    op = ops[Math.floor(Math.random() * 4)];
    if (op === '+') {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      answer = a + b;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      if (a < b) [a, b] = [b, a];
      answer = a - b;
    } else if (op === '*') {
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
    } else {
      b = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;
      a = answer * b;
    }
  }

  currentCorrectAnswer = answer;
  document.getElementById('question').textContent = `Solve: ${a} ${op} ${b} = ?`;
  generateAnswerOptions();
}

function generateAnswerOptions() {
  const options = [currentCorrectAnswer];
  while (options.length < 4) {
    let wrongAnswer;
    do {
      wrongAnswer = currentCorrectAnswer + Math.floor(Math.random() * 20) - 10;
    } while (options.includes(wrongAnswer) || wrongAnswer < 0);
    options.push(wrongAnswer);
  }
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach((btn, index) => {
    btn.textContent = options[index];
    btn.dataset.value = options[index];
  });
}

function submitAnswer(button) {
  const userAnswer = parseFloat(button.dataset.value);

  if (userAnswer === currentCorrectAnswer) {
    score += 10;
    correctAnswers++;
    timer += 15;
    document.getElementById('feedback').textContent = 'Correct! +15 seconds';
    document.getElementById('timer').textContent = timer;
    correctSound.play().catch(() => {});
    updateProgress();
    updateQuestionCounter();
  } else {
    score = Math.max(0, score - 10);
    timer = Math.max(0, timer - 10);
    document.getElementById('feedback').textContent = `Incorrect! The correct answer is ${currentCorrectAnswer}. -10 points, -10 seconds`;
    document.getElementById('timer').textContent = timer;
    incorrectSound.play().catch(() => {});
  }

  document.getElementById('score').textContent = score;

  if (correctAnswers >= totalQuestions) {
    completedLevels[currentLevel - 1] = true;
    saveProgress();
    clearInterval(timerInterval);
    if (currentLevel < 5) {
      showScreen('castle-screen');
    } else {
      document.getElementById('victory-hero').textContent = heroName;
      document.getElementById('victory-score').textContent = score;
      showScreen('victory-screen');
    }
  } else {
    generateQuestion();
  }
}

function updateProgress() {
  const levelProgress = (correctAnswers / totalQuestions) * 20;
  const totalProgress = ((currentLevel - 1) * 20) + levelProgress;
  document.getElementById('progress-percent').textContent = Math.round(totalProgress);
  document.getElementById('progress-fill').style.width = `${totalProgress}%`;
  document.getElementById('prince-progress').style.left = `${totalProgress}%`;
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 60;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timer--;
    updateTimerDisplay();
    if (timer <= 0) {
      clearInterval(timerInterval);
      alert('Time’s up!');
      showScreen('home-screen');
    }
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById('timer').textContent = timer;
}