const STATIONS = [
    { id: "Estação 1", title: "Estação 1: A Senha Vazou", file: "models/estacao1.json" },
    { id: "Estação 2", title: "Estação 2: Não Clique!", file: "models/estacao2.json" },
    { id: "Estação 3", title: "Estação 3: O Aplicativo Curioso", file: "models/estacao3.json" },
    { id: "Estação 4", title: "Estação 4 Não Acredite nos Seus Olhos", file: "models/estacao4.json" },
    { id: "Estação 5", title: "Estação 5: Postar ou não Postar?", file: "models/estacao5.json" },
];
let questions = [];
const TIME = 40;
let score = 0;
let currentStationIndex = 0;
let currentQuestionIndex = 0;
let timeLeft = TIME;
let streak = 0;
let timerId = null;
let sessionScores = {};
const quizTitle = document.getElementById('title');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionNumberElement = document.getElementById('question-number');
const timerDisplayElement = document.getElementById('timer-display');
const questionTextElement = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const finalScoreElement = document.getElementById('final-score');
const resultsElement = document.getElementById("results");
const nextBtn = document.getElementById('next-station-btn');
const introScreen = document.getElementById('intro-screen');
const startQuizBtn = document.getElementById('start-quiz-btn');
function startQuiz() {
    score = 0;
    streak = 0;
    currentQuestionIndex = 0;
    showQuestion();
}
async function loadStation(index) {
    if (quizTitle)
        quizTitle.innerText = '';
    if (index < 0 || index >= STATIONS.length)
        return;
    currentStationIndex = index;
    const station = STATIONS[currentStationIndex];
    if (!station)
        return;
    if (quizTitle)
        quizTitle.innerText = station.title;
    try {
        const response = await fetch(station.file);
        if (!response.ok)
            throw new Error(`Erro ao carregar arquivo da estação ${station.file}`);
        questions = await response.json();
        quizScreen?.classList.remove('hide');
        resultScreen?.classList.add('hide');
        document.body.className = "";
        const stationClass = `estacao-${station.id.replace("Estação ", "")}`;
        document.body.classList.add(stationClass);
        startQuiz();
    }
    catch (error) {
        console.error("Falha na requisição: ", error);
    }
}
function showQuestion() {
    optionsContainer.innerHTML = '';
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !questionNumberElement || !questionTextElement) {
        return;
    }
    questionNumberElement.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    if (currentQuestion.question) {
        questionTextElement.innerText = currentQuestion.question;
        questionTextElement.style.display = "block";
    }
    else {
        questionTextElement.innerText = "";
        questionTextElement.style.display = "none";
    }
    if (currentQuestion.image) {
        const img = document.createElement('img');
        img.src = currentQuestion.image;
        img.classList.add('question-img');
        optionsContainer.appendChild(img);
    }
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
    popup.innerHTML = '';
    popup.classList.remove("correct", "incorrect");
    const correct = answer === currentQuestion.correct;
    const popClass = correct ? "correct" : "incorrect";
    const title = document.createElement('h1');
    const message = document.createElement('h3');
    const btn = document.createElement('button');
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
function formatSessionScores() {
    const detailsScore = Object.entries(sessionScores)
        .map(([estacao, pontos]) => `${estacao}: ${pontos} acertos`)
        .join("\n");
    return `Pontuação Total:\n${detailsScore}`;
}
function showResults() {
    resetTimer();
    const currentStation = STATIONS[currentStationIndex];
    if (!currentStation)
        return;
    quizScreen?.classList.add("hide");
    resultScreen?.classList.remove("hide");
    sessionScores[currentStation.id] = score;
    if (finalScoreElement) {
        finalScoreElement.innerText = `Você acertou ${score} questões de ${questions.length} nesta etapa.`;
    }
    if (nextBtn) {
        if (currentStationIndex + 1 < STATIONS.length) {
            nextBtn.innerText = "Avançar para a próxima estação";
            if (resultsElement)
                resultsElement.innerText = "";
            nextBtn.onclick = () => loadStation(currentStationIndex + 1);
        }
        else {
            nextBtn.innerText = "Reiniciar Quiz";
            if (resultsElement)
                resultsElement.innerText = formatSessionScores();
            nextBtn.onclick = () => {
                sessionScores = {};
                if (resultsElement)
                    resultsElement.innerText = "";
                loadStation(0);
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
            resetTimer();
            streak = 0;
            nextQuestion();
        }
    }, 1000);
}
document.addEventListener('DOMContentLoaded', () => {
    quizScreen.classList.add('hide');
    quizTitle.classList.add('hide');
    startQuizBtn.addEventListener('click', () => {
        introScreen.classList.add('hide');
        quizTitle.classList.remove('hide');
        loadStation(0);
    });
});
export {};
//# sourceMappingURL=script.js.map