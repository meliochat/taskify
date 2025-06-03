// 🌙 Toggle tema claro/oscuro
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 🧭 Tabs de navegación
const tabs = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ✅ Mantener tema guardado
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '🌞';
  }
  loadTasks(); // cargar tareas al iniciar
});

// 📝 CRUD de tareas
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (text !== '') {
    const newTask = { id: Date.now(), text, done: false };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.addEventListener('click', () => {
      task.done = !task.done;
      saveTasks();
      renderTasks();
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// ⏱️ Pomodoro
let pomodoroTime = 25 * 60; // tiempo en segundos
let breakTime = 5 * 60;
let currentTime = pomodoroTime;
let interval = null;
let isBreak = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-timer');
const resetBtn = document.getElementById('reset-timer');
const modeButtons = document.querySelectorAll('.mode-selector button');

function updateTimerDisplay() {
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (interval) return;
  interval = setInterval(() => {
    if (currentTime > 0) {
      currentTime--;
      updateTimerDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      isBreak = !isBreak;
      currentTime = isBreak ? breakTime : pomodoroTime;
      updateTimerDisplay();
      alert(isBreak ? "¡Tiempo de descanso!" : "¡Hora de trabajar!");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isBreak = false;
  currentTime = pomodoroTime;
  updateTimerDisplay();
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = parseInt(btn.getAttribute('data-time'), 10);
    pomodoroTime = mode * 60;
    breakTime = mode === 25 ? 5 * 60 : 10 * 60;
    resetTimer();
  });
});

updateTimerDisplay();
