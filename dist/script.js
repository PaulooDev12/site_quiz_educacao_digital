const STATIONS = [
    { id: "estacao1", title: "Estação 1: Fundamentos", file: "models/estacao1.json" },
    { id: "estacao2", title: "Estação 2: Imagens e Identificação", file: "models/estacao2.json" }
];
const STORAGE_KEY = 'quiz_station_progress';
let questions = [];
const TIME = 10;
let score = 0;
let currentStationIndex = 0;
let currentQuestionIndex = 0;
let timeLeft = TIME;
let streak = 0;
let timerId = null;
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionNumberElement = document.getElementById('question-number');
const timerDisplayElement = document.getElementById('timer-display');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalScoreElement = document.getElementById('final-score');
function startQuiz() {
    score = 0;
    streak = 0;
    currentQuestionIndex = 0;
    showQuestion();
}
function getProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { completedStations: [], scores: {} };
}
function saveStationCompletion(stationId, stationScore) {
    const progress = getProgress();
    if (!progress.completedStations.includes(stationId)) {
        progress.completedStations.push(stationId);
    }
    progress.scores[stationId] = stationScore;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
async function loadStation(index) {
    if (index < 0 || index >= STATIONS.length)
        return;
    currentStationIndex = index;
    const station = STATIONS[currentStationIndex];
    if (!station)
        return;
    try {
        const response = await fetch(station.file);
        if (!response.ok)
            throw new Error(`Erro ao carregar arquivo da estação ${station.file}`);
        questions = await response.json();
        quizScreen?.classList.remove('hide');
        resultScreen?.classList.add('hide');
        startQuiz();
    }
    catch (error) {
        console.error("falhas na request ", error);
    }
}
async function loadQuestions(stationFile) {
    try {
        const response = await fetch(stationFile);
        if (!response.ok) {
            throw new Error(`Erro ao carregar arquivo: ${stationFile} código do erro ${response.statusText}`);
        }
        console.log(`Perguntas carregadas de ${stationFile}`);
        questions = await response.json();
        startQuiz();
    }
    catch (error) {
        console.log("falha ao carregar arquivo ", error);
        if (questionTextElement) {
            questionTextElement.innerText = "falha ao carregar questões";
        }
    }
}
function showQuestion() {
    optionsContainer.innerHTML = '';
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !questionNumberElement || !questionTextElement) {
        return;
    }
    questionNumberElement.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    questionTextElement.innerText = currentQuestion.question;
    if (currentQuestion.image) {
        const img = document.createElement('img');
        img.src = currentQuestion.image;
        img.classList.add('question-img');
        optionsContainer.appendChild(img);
    }
    console.log(currentQuestion, " funcionou!!!");
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add("option-btn");
        if (currentQuestion.type === 'image') {
            const img = document.createElement('img');
            img.src = option;
            img.alt = `Opção ${index + 1}`;
            img.classList.add("option-img");
            button.appendChild(img);
        }
        else {
            button.innerText = option;
        }
        button.addEventListener("click", () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
    startTimer();
}
function selectAnswer(selectedAnswer) {
    resetTimer();
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion)
        return;
    if (selectedAnswer === currentQuestion.correct) {
        score++;
        streak++;
    }
    else {
        streak = 0;
    }
    showPopUpResult(selectedAnswer);
}
function showPopUpResult(answer) {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion)
        return;
    const main = document.getElementById('main');
    main.classList.add("blur");
    const popup = document.getElementById('popup');
    const title = document.createElement('h1');
    const message = document.createElement('h3');
    popup.innerHTML = '';
    popup.classList.remove("correct", "incorrect");
    const correct = answer === currentQuestion.correct;
    const btn = document.createElement('button');
    const popClass = correct ? "correct" : "incorrect";
    btn.textContent = "Ok";
    title.textContent = correct ? "Resposta Correta!" : "Resposta Incorreta";
    const streakFormat = streak > 1 ? "acertos" : "acerto";
    message.textContent = correct ? `Sua Sequência atual é de ${streak} ${streakFormat}` : "Mais sorte na próxima vez";
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(btn);
    popup.classList.add(popClass);
    btn.addEventListener('click', () => {
        main.classList.remove('blur');
        popup.classList.remove(popClass);
        nextQuestion();
    });
}
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    }
    else {
        showResults();
    }
}
function showResults() {
    resetTimer();
    const currentStation = STATIONS[currentStationIndex];
    if (!currentStation)
        return;
    quizScreen?.classList.add("hide");
    resultScreen?.classList.remove("hide");
    saveStationCompletion(currentStation.id, score);
    console.log(score);
    if (finalScoreElement) {
        finalScoreElement.innerText = `Você acertou ${score} questões de ${questions.length}`;
    }
    const nextBtn = document.getElementById('next-station-btn');
    if (nextBtn) {
        if (currentStationIndex + 1 < STATIONS.length) {
            nextBtn.innerText = "Avançar para a próxima estação";
            nextBtn.onclick = () => loadStation(currentStationIndex + 1);
        }
        else {
            nextBtn.innerText = "Reiniciar Quiz";
            nextBtn.onclick = () => {
                loadStation(0);
                localStorage.removeItem(STORAGE_KEY);
            };
        }
    }
}
function resetTimer() {
    if (timerId)
        clearInterval(timerId);
    timeLeft = TIME;
}
function startTimer() {
    timerDisplayElement.innerText = `Tempo restante: ${timeLeft}s`;
    timerId = window.setInterval(() => {
        timeLeft--;
        timerDisplayElement.innerText = `Tempo restante: ${timeLeft}s`;
        if (timeLeft <= 0) {
            if (timerId)
                clearInterval(timerId);
            resetTimer();
            streak = 0;
            nextQuestion();
        }
    }, 1000);
}
document.addEventListener('DOMContentLoaded', () => {
    const progress = getProgress();
    const nextUnfinishedIndex = STATIONS.findIndex(s => !progress.completedStations.includes(s.id));
    if (nextUnfinishedIndex !== 1) {
        loadStation(nextUnfinishedIndex);
    }
    else {
        loadStation(0);
    }
});
export {};
//# sourceMappingURL=script.js.map