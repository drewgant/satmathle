import { questions } from "./questions.js";

let currentQuestion = 0;
let answers = new Array(questions.length).fill(null);

const startTime = Date.now();

const questionCounter = document.getElementById("questionCounter");
const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const answersDiv = document.getElementById("answers");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const letters = ["A","B","C","D","E","S"];

// Question Weights
const weights = [    0.95,
    0.92,
    0.88,
    0.82,
    0.70,
    0.60,
    0.50,
    0.40,
    0.30,
    0.25
];

function updateProgress(){

    for(let i=0;i<questions.length;i++){

        const step=document.getElementById("step"+i);

        step.classList.remove("current");
        step.classList.remove("completed");

        if(i===currentQuestion){
            step.classList.add("current");
        }

        if(answers[i]!==null){
            step.classList.add("completed");
        }

    }

}

function renderQuestion(){

    const q=questions[currentQuestion];

    questionCounter.textContent=
        `Question ${currentQuestion+1} of ${questions.length}`;

    questionTitle.textContent=q.topic;

    let html="";

    if(q.image){

        html+=`
        <img
            src="${q.image}"
            style="
                display:block;
                width:450px;
                max-width:100%;
                height:auto;
                margin:0 auto 30px auto;
                border:2px solid #d1d5db;
                border-radius:12px;
            ">
        `;

    }

    html+=q.question.replace(/\n/g,"<br><br>");

    questionText.innerHTML=html;

    answersDiv.innerHTML="";

    q.choices.forEach((choice,index)=>{

        const div=document.createElement("div");

        div.className="answer";

        div.innerHTML=choice;

        if(answers[currentQuestion]===letters[index]){
            div.classList.add("selected");
        }

        div.onclick=()=>{

            answers[currentQuestion]=letters[index];

            renderQuestion();

        };

        answersDiv.appendChild(div);

    });

    prevBtn.disabled=currentQuestion===0;

    nextBtn.textContent=
        currentQuestion===questions.length-1
        ? "Finish Assessment"
        : "Next ▶";

    updateProgress();

}prevBtn.onclick=()=>{

    if(currentQuestion>0){

        currentQuestion--;

        renderQuestion();

    }

};

nextBtn.onclick=()=>{

    if(currentQuestion<questions.length-1){

        currentQuestion++;

        renderQuestion();

        return;

    }

    let correct=0;
    let incorrect=0;
    let skipped=0;

    const values=[];

    questions.forEach((q,i)=>{

        if(answers[i]===null || answers[i]==="S"){

            skipped++;
            values.push(0);

        }

        else if(answers[i]===q.correct){

            correct++;
            values.push(1);

        }

        else{

            incorrect++;
            values.push(-0.33);

        }

    });

    let weightedTotal=0;
    let totalWeight=0;

    for(let i=0;i<questions.length;i++){

        weightedTotal+=values[i]*weights[i];
        totalWeight+=weights[i];

    }

    const weightedPerformance=
        weightedTotal/totalWeight;

    // =====================================
    // HIGHEST EARLY QUESTION PENALTY
    // =====================================

    let earlyMissPenalty = 1;

    if(values[0] !== 1) earlyMissPenalty *= 0.30;
    if(values[1] !== 1) earlyMissPenalty *= 0.50;
    if(values[2] !== 1) earlyMissPenalty *= 0.70;
    if(values[3] !== 1) earlyMissPenalty *= 0.85;
    if(values[4] !== 1) earlyMissPenalty *= 0.92;

    // =====================================
    // HARD QUESTION BONUS
    // =====================================

    let hardQuestionBonus = 0;

    if(values[7] === 1){
        hardQuestionBonus += 10;
    }

    if(values[8] === 1){
        hardQuestionBonus += 30;
    }

    if(values[9] === 1){
        hardQuestionBonus += 20;
    }    // =====================================
    // SPEED BONUS
    // =====================================

    const elapsedSeconds =
        Math.floor((Date.now() - startTime) / 1000);

    let speedBonus = 0;

    if(elapsedSeconds <= 360){
        speedBonus = 20;
    }

    // =====================================
    // BASE SCORE
    // =====================================

    let score = Math.round(
        200 +
        (
            600 *
            (
                weightedPerformance *
                earlyMissPenalty
            )
        )
    );

    score += hardQuestionBonus;
    score += speedBonus;

    // =====================================
    // HELPER FUNCTIONS
    // =====================================

    function firstCorrect(count){

        for(let i=0;i<count;i++){

            if(values[i] !== 1){
                return false;
            }

        }

        return true;

    }

    function correctInFirst(count){

        let total = 0;

        for(let i=0;i<count;i++){

            if(values[i] === 1){
                total++;
            }

        }

        return total;

    }

    // =====================================
    // MINIMUM SCORE FLOORS
    // =====================================

    if(firstCorrect(1)){
        score = Math.max(score,250);
    }

    if(firstCorrect(2)){
        score = Math.max(score,350);
    }

    if(firstCorrect(3)){
        score = Math.max(score,480);
    }

    if(correctInFirst(4) >= 3){
        score = Math.max(score,460);
    }

    if(firstCorrect(4)){
        score = Math.max(score,520);
    }

    if(correctInFirst(5) >= 4){
        score = Math.max(score,500);
    }

    if(firstCorrect(5)){
        score = Math.max(score,560);
    }

    if(correctInFirst(6) >= 5){
        score = Math.max(score,540);
    }

    if(firstCorrect(6)){
        score = Math.max(score,620);
    }

    if(firstCorrect(7)){
        score = Math.max(score,650);
    }

    if(firstCorrect(8)){
        score = Math.max(score,720);
    }    if(firstCorrect(9)){
        score = Math.max(score,770);
    }

    if(correct === 10){
        score = 800;
    }

    // =====================================
    // PERFECT SCORE BONUS
    // =====================================

    if(
        correct === 10 &&
        elapsedSeconds <= 360
    ){
        score = 800;
    }

    // =====================================
    // SCORE LIMITS
    // =====================================

    if(score < 200){
        score = 200;
    }

    if(score > 800){
        score = 800;
    }

    // =====================================
    // REPORTING VALUES
    // =====================================

    const percentCorrect =
        ((correct / questions.length) * 100).toFixed(1);

    const weightedPercent =
        (weightedPerformance * 100).toFixed(1);

    const minutes =
        Math.floor(elapsedSeconds / 60);

    const seconds =
        elapsedSeconds % 60;

    const elapsedTime =
        `${minutes}:${seconds.toString().padStart(2,"0")}`;

    let summary = "";

    if(score >= 760){

        summary =
            "Excellent! Your SAT Math score is in the top range.";

    }
    else if(score >= 700){

        summary =
            "Very strong performance with only a few weaknesses.";

    }
    else if(score >= 650){

        summary =
            "Good foundation. Continue practicing medium and hard questions.";

    }
    else if(score >= 600){

        summary =
            "Solid progress. Focus on consistency and avoiding early mistakes.";

    }
    else if(score >= 500){

        summary =
            "Developing skills. Strengthen algebra and problem solving.";

    }
    else{

        summary =
            "Focus on mastering the early foundational questions before moving to advanced topics.";

    }

    // =====================================
    // SAVE REPORT
    // =====================================

    const report = {

        score,

        correct,

        incorrect,

        skipped,

        percentCorrect,

        weightedPercent,

        earlyMissPenalty,

        hardQuestionBonus,

        speedBonus,

        elapsedSeconds,

        elapsedTime,

        summary,

        answers,

        values

    };

    localStorage.setItem(
        "satMathleReport",
        JSON.stringify(report)
    );

    localStorage.setItem(
        "score",
        score
    );

    window.location.href = "results.html";

};

renderQuestion();