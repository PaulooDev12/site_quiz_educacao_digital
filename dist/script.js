;
const questions = [
    {
        question: "O que typescript adiciona ao javaScript:",
        options: ["tipagem estática", "Banco de dados", "gateway de APIs"],
        correct: 0
    },
    {
        question: "Qual dessas é uma linguagem orientada a objetos?",
        options: ["C#", "C", "Ruby"],
        correct: 0
    }
];
const TIME = 10;
let score = 0;
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
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}
function showQuestion() {
    optionsContainer.innerHTML = '';
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || !questionNumberElement) {
        return;
    }
    questionNumberElement.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;
    questionTextElement.innerText = currentQuestion.question;
    console.log(currentQuestion, " funcionou!!!");
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        ;
        button.classList.add("option-btn");
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
    quizScreen?.classList.add("hide");
    resultScreen?.classList.remove("hide");
    console.log(score);
    if (finalScoreElement) {
        finalScoreElement.innerText = `Você acertou ${score} questões de ${questions.length}`;
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
            nextQuestion();
        }
    }, 1000);
}
document.addEventListener('DOMContentLoaded', startQuiz);
export {};
//# sourceMappingURL=script.js.map