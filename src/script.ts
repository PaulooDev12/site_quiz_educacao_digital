interface Question{
    question: string,
    options: string[],
    correct: number;
};

let questions: Question[] = []
const TIME = 10;
let score = 0;
let currentQuestionIndex = 0
let timeLeft = TIME;
let streak = 0;
let timerId: number | null = null;
const quizScreen = document.getElementById('quiz-screen') as HTMLElement ;
const resultScreen = document.getElementById('result-screen') as HTMLDivElement ;
const questionNumberElement = document.getElementById('question-number') as HTMLSpanElement;
const timerDisplayElement = document.getElementById('timer-display') as HTMLSpanElement ;
const questionTextElement = document.getElementById('question-text') as HTMLHeadingElement ;
const optionsContainer = document.getElementById('options-container') as HTMLDivElement ;
const finalScoreElement = document.getElementById('final-score') as HTMLParagraphElement ;
function startQuiz(): void{
    score = 0
    showQuestion();
}

async function loadQuestions(stationFile: string): Promise<void>{
    try{
        const response = await fetch(stationFile);
        if(!response.ok){
            throw new Error(`Erro ao carregar arquivo: ${stationFile} código do erro ${response.statusText}`);
        }
        console.log(`Perguntas carregadas de ${stationFile}`)
        questions = await response.json();
        
    }catch(error){
        console.log("falha ao carregar arquivo ", error);
        if(questionTextElement){
            questionTextElement.innerText = "falha ao carregar questões"
        }
    }
}
function showQuestion(): void{
    optionsContainer.innerHTML = '';
    const currentQuestion = questions[currentQuestionIndex];
    if(!currentQuestion || !questionNumberElement){
        return; 
    }
    questionNumberElement.innerText = `Questão ${currentQuestionIndex + 1} de ${questions.length}`
    questionTextElement.innerText = currentQuestion.question;
    console.log(currentQuestion, " funcionou!!!");
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectAnswer(index));
        optionsContainer.appendChild(button);
    })
    startTimer();
}
function selectAnswer(selectedAnswer: number): void{
    resetTimer();
    const currentQuestion = questions[currentQuestionIndex];
    if(!currentQuestion) return;
    if(selectedAnswer === currentQuestion.correct){
        score++;
        streak++
    }else{
        streak = 0;
    }
    showPopUpResult(selectedAnswer);
}
function showPopUpResult(answer: number){
    const currentQuestion = questions[currentQuestionIndex];
    if(!currentQuestion) return;
    const main = document.getElementById('main') as HTMLElement;
    main.classList.add("blur")
    const popup = document.getElementById('popup') as HTMLElement;
    const title = document.createElement('h1');
    const message = document.createElement('h3');
    popup.innerHTML = '';
    popup.classList.remove("correct", "incorrect")
    const correct: boolean = answer === currentQuestion.correct;
    const btn = document.createElement('button');
    const popClass: string = correct ? "correct" : "incorrect";
    btn.textContent = "Ok";
    title.textContent = correct ? "Resposta Correta!" : "Resposta Incorreta";
    const streakFormat: string = streak > 1 ? "acertos" : "acerto";
    message.textContent = correct ? `Sua Sequência atual é de ${streak} ${streakFormat}` : "Mais sorte na próxima vez";
    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(btn);
    popup.classList.add(popClass);
    btn.addEventListener('click', () => {
        main.classList.remove('blur');
        popup.classList.remove(popClass);
        nextQuestion();
    }
    );   
}
function nextQuestion(): void{
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showResults();
    }
    
}
function showResults(): void{
    quizScreen?.classList.add("hide");
    resultScreen?.classList.remove("hide");
    console.log(score);
    if(finalScoreElement){
        finalScoreElement.innerText = `Você acertou ${score} questões de ${questions.length}`
    }
}
function resetTimer(): void{
    if(timerId) clearInterval(timerId);
    timeLeft = TIME;
}
function startTimer(): void{
    timerDisplayElement.innerText = `Tempo restante: ${timeLeft}s`
    timerId = window.setInterval(() => {
        timeLeft--;
        timerDisplayElement.innerText = `Tempo restante: ${timeLeft}s`; 
        if(timeLeft <= 0 ){
            if(timerId) clearInterval(timerId);
            resetTimer();
            streak = 0;
            nextQuestion();
        }
    }, 1000);


}
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions("models/estacao1.json")
}
);