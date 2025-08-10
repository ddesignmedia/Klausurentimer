// DOM-Elemente
const settingsView = document.getElementById('settings-view');
const timerView = document.getElementById('timer-view');
const timeInput = document.getElementById('time-input');
const startBtn = document.getElementById('start-btn');
const timeDisplay = document.getElementById('time-display');
const errorMessage = document.getElementById('error-message');
const timerControls = document.getElementById('timer-controls');
const pauseBtn = document.getElementById('pause-btn');
const plusOneBtn = document.getElementById('plus-one-btn');
const minusOneBtn = document.getElementById('minus-one-btn');
const checklistInput = document.getElementById('checklist-input');
const checklistDisplayContainer = document.getElementById('checklist-display-container');
const checklistDisplay = document.getElementById('checklist-display');

// Timer-Variablen
let timerInterval, totalSeconds, initialTotalSeconds;
let isPaused = false;

function startTimer() {
    const minutes = parseInt(timeInput.value, 10);
    if (isNaN(minutes) || minutes <= 0) {
        errorMessage.textContent = 'Bitte eine gültige Zahl > 0 eingeben.';
        timeInput.focus();
        return;
    }
    errorMessage.textContent = '';

    totalSeconds = minutes * 60;
    initialTotalSeconds = totalSeconds;
    isPaused = false;

    renderChecklist();
    settingsView.style.display = 'none';
    timerView.style.display = 'flex';
    timerControls.style.display = 'flex';
    pauseBtn.textContent = 'Pause';

    updateDisplay(totalSeconds);
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    if (isPaused) return;
    totalSeconds--;
    updateDisplay(totalSeconds);

    if (totalSeconds < 0) {
        clearInterval(timerInterval);
        timeDisplay.textContent = "Bitte abgeben";
        timeDisplay.classList.remove('time-warning', 'time-danger');
        timerControls.style.display = 'none';
    }
}

function updateDisplay(seconds) {
    if (seconds < 0) return;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    timeDisplay.textContent = formattedTime;

    timeDisplay.classList.remove('time-warning', 'time-danger');
    if (initialTotalSeconds > 0) {
        const percentage = (seconds / initialTotalSeconds);
        if (percentage <= 0.10) {
            timeDisplay.classList.add('time-danger');
        } else if (percentage <= 0.30) {
            timeDisplay.classList.add('time-warning');
        }
    }
}

function togglePause() {
    if (totalSeconds < 0) return;
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? 'Weiter' : 'Pause';
}

function addMinute() {
    if (totalSeconds < 0) return;
    totalSeconds += 60;
    initialTotalSeconds += 60;
    updateDisplay(totalSeconds);
}

function subtractMinute() {
    if (totalSeconds < 0) return;
    initialTotalSeconds = Math.max(totalSeconds, initialTotalSeconds - 60);
    totalSeconds = Math.max(0, totalSeconds - 60);
    updateDisplay(totalSeconds);
}

function renderChecklist() {
    // Vordefinierte Regeln sammeln (haben bereits "!")
    const selectedPredefinedItems = [];
    document.querySelectorAll('.predefined-rule-cb:checked').forEach(checkbox => {
        selectedPredefinedItems.push(checkbox.nextElementSibling.textContent);
    });

    // Eigene Notizen sammeln und "!" hinzufügen
    const customItems = checklistInput.value.split('\n')
        .filter(item => item.trim() !== '')
        .map(item => item.trim() + '!');

    // Beide Listen zusammenführen
    const allItems = [...selectedPredefinedItems, ...customItems];

    checklistDisplay.innerHTML = '';

    if (allItems.length > 0) {
        allItems.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            checklistDisplay.appendChild(li);
        });
        checklistDisplayContainer.style.display = 'block';
    } else {
        checklistDisplayContainer.style.display = 'none';
    }
}

// Event-Listener
startBtn.addEventListener('click', startTimer);
timeInput.addEventListener('keyup', (event) => { if (event.key === 'Enter') startTimer(); });
pauseBtn.addEventListener('click', togglePause);
plusOneBtn.addEventListener('click', addMinute);
minusOneBtn.addEventListener('click', subtractMinute);

// Dark Mode Logic
window.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Function to set dark mode state
    const setDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    };

    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    // Listener for toggle switch
    darkModeToggle.addEventListener('change', () => {
        const isChecked = darkModeToggle.checked;
        localStorage.setItem('darkMode', isChecked);
        setDarkMode(isChecked);
    });
});
