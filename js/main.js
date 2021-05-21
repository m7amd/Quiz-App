// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestion() {

  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {

    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let questionCount = questionObject.length;

      // Create Bullets  + Set Question Count
      creatBullets(questionCount);

      // Add Question Data
      addQuestionData(questionObject[currentIndex], questionCount);

      // Count Down 
      countDown(100, questionCount);

      // Click on submit button
      submitButton.onclick = () => {

        // Get Right answer 
        let rightAnswer = questionObject[currentIndex].right_answer;
        
        // increase index
        currentIndex++;

        // check the answer 
        checkAnswer(rightAnswer, questionCount);

        // Remove Old Questions 
        quizArea.innerHTML= '';
        answersArea.innerHTML = '';

        // Add Question Data
        addQuestionData(questionObject[currentIndex], questionCount);

        // Hundle Bullets
        hundleBullets();

        // Count Down 
        clearInterval(countdownInterval);
        countDown(100, questionCount);

        // Show Results 
        showResults(questionCount);
      }
    }
  }

  myRequest.open("GET", "../js/html_questions.json", true);
  myRequest.send();

};

getQuestion();

function creatBullets(num) {

  countSpan.innerHTML = num;

  // Create Spans 

  for (let i = 0; i < num; i++){

    // Create Bullets
    let theBullet = document.createElement('span');

    // Add Class active in First Span 
    if (i === 0) {      
      theBullet.className = 'on';
    }

    // Append span in bullets Span Container
    bulletsSpanContainer.appendChild(theBullet);

  }

};

function addQuestionData(obj, count) {

  if (currentIndex < count) {
    // Create The Question 
    let questionTitle = document.createElement('h2');

    // Create The Text of The Question 
    let questionText = document.createTextNode(obj.title);

    // Append text in question 
    questionTitle.appendChild(questionText);

    // Append Question in Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {

    let mainDiv = document.createElement('div');

    // Add Class To Main Div 

    mainDiv.className = 'answer';

    // Create Radio input
    let radioInput  = document.createElement('input');

    // Add Type + Name + data attribute + id
    radioInput.name = 'question';
    radioInput.type = 'radio';
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];

    // make first answer checked
    if (i === 1) {
    radioInput.checked = true;
    }

    // Create Label 
    let label  = document.createElement('label');

    // Add For Attribute 
    label.htmlFor = `answer_${i}`;

    // Create Text Label
    let labelText = document.createTextNode(obj[`answer_${i}`]);

    // Append Answer on label 
    label.appendChild(labelText);

    // Append label + input to main div
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(label);

    // Add Main Div to answers Area
    answersArea.appendChild(mainDiv);
    }

  }

};


function checkAnswer(rAnswer, count) {

  let answers = document.getElementsByName('question');
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log('You Chooses The Right Answer');
  }

};

function hundleBullets() {

  let bulletsSpan = document.querySelectorAll('.bullets .spans span');
  let arrayOfSpans = Array.from(bulletsSpan);
  
  arrayOfSpans.forEach((span, index) => {

    if (currentIndex === index) {
      span.className = 'on';
    }

  });
  
};

function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class='good'>Good</span>, ${rightAnswers} From ${count} is Good.`;
    } else if (rightAnswers === count) {
      theResult = `<span class='perfect'>Perfect</span>, All Answers is Right`;
    } else {
      theResult = `<span class='bad'>Bad</span>, ${rightAnswers} From ${count}`;
    }
    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = '10px';
    resultsContainer.style.backgroundColor = '#FFF';
    resultsContainer.style.marginTop = '10px';
  }

};

function countDown(duration, count) {

  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
};