let currentLevel = 1;
let score = 0;
let timer = 60;
let timerInterval;
let heroName = '';

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  if (screenId === 'game-screen') startTimer();
}

function startAdventure() {
  heroName = document.getElementById('hero-name').value || 'Hero';
  showScreen('castle-screen');
}

function startLevel(level) {
  currentLevel = level;
  score = 0;
  timer = 60;
  document.getElementById('score').textContent = score;
  document.getElementById('timer').textContent = timer;
  document.getElementById('level-info').textContent = `Level ${level}: ${getLevelName(level)}`;
  generateQuestion();
  showScreen('game-screen');
}

function getLevelName(level) {
  const names = ['Addition', 'Subtraction', 'Multiplication', 'Division', 'Mixed'];
  return names[level - 1];
}

function generateQuestion() {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  let op, question, answer;

  if (currentLevel === 1) {
    op = '+';
    answer = a + b;
  } else if (currentLevel === 2) {
    op = '-';
    answer = a - b;
  } else if (currentLevel === 3) {
    op = '*';
    answer = a * b;
  } else if (currentLevel === 4) {
    answer = a;
    a = a * b;
    op = '/';
  } else {
    const ops = ['+', '-', '*', '/'];
    op = ops[Math.floor(Math.random() * 4)];
    if (op === '+') answer = a + b;
    else if (op === '-') answer = a - b;
    else if (op === '*') answer = a * b;
    else {
      answer = a;
      a = a * b;
    }
  }

  document.getElementById('question').textContent = `Solve: ${a} ${op} ${b} = ?`;
  generateAnswerOptions(answer);
}

function generateAnswerOptions(correctAnswer) {
  const options = [correctAnswer];
  // Generate 3 incorrect answers
  while (options.length < 4) {
    let wrongAnswer;
    do {
      wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5; // Random offset ±5
    } while (options.includes(wrongAnswer) || wrongAnswer < 0);
    options.push(wrongAnswer);
  }
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  // Assign to buttons
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach((btn, index) => {
    btn.textContent = options[index];
    btn.dataset.value = options[index];
  });
}

function submitAnswer(button) {
  const userAnswer = parseFloat(button.dataset.value);
  const correctAnswer = parseFloat(document.querySelector('.answer-btn[data-value="' + userAnswer + '"]').dataset.value);

  if (userAnswer === correctAnswer) {
    score += 10;
    document.getElementById('feedback').textContent = 'Correct!';
  } else {
    document.getElementById('feedback').textContent = 'Try again!';
  }

  document.getElementById('score').textContent = score;

  if (score >= 50) {
    clearInterval(timerInterval);
    document.getElementById('victory-hero').textContent = heroName;
    document.getElementById('victory-score').textContent = score;
    showScreen('victory-screen');
  } else {
    generateQuestion();
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 60;
  document.getElementById('timer').textContent = timer;
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      alert('Time’s up!');
      showScreen('home-screen');
    }
  }, 1000);
}