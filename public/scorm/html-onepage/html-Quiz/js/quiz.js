const maxQuestions = 10;

var answers = [];
var questions = shuffle(Array.from(document.getElementsByClassName("q-data")));

var currentQuestionIndex = 0;
var currentQuestion = null;
var currentForm = null;

init();

function init() {
    shuffleAnswers();
    changeView(false);
    showQuestion(currentQuestionIndex);

    $('.q-data input[type=radio]').map(function () {
        this.checked = false;
    });

    $('.q-data button[type=button]').map(function () {
        this.disabled = true;
    });

    $('.w-form form input[type=radio]').click(function (e) {
        $('input[name="'.concat(e.target.name, '"]:not(').concat(".w-checkbox-input", ")")).map(function (e, n) {
            return $(n).siblings(".w-radio-input").removeClass("w--redirected-checked");
        });
        var n = $(e.target);
        n.hasClass("w-radio-input") || n.siblings(".w-radio-input").addClass("w--redirected-checked");
    });

    $('.w-form form input[type="radio"]:not(.w-radio-input)').focus(function (e) {
        $(e.target).siblings(".w-radio-input").addClass("w--redirected-focus");
    });

    $('.w-form form input[type="radio"]:not(.w-radio-input)').blur(function (e) {
        $(e.target).siblings(".w-radio-input").removeClass("w--redirected-focus");
    });

    $('.q-data input[type=radio]').on('change', checkForm);
    $('.q-data button[type=button]').on('click', submit);
}

function submit() {
    let radios = currentQuestion.getElementsByClassName("w-radio-input");
    for (let index = 0; index < radios.length; index++) {
        if (radios[index].classList.contains("w--redirected-checked")) {
            if (answers.length < currentQuestionIndex || answers[currentQuestionIndex] == null) {
                answers[currentQuestionIndex] = {
                    'question': currentQuestion,
                    'id': currentForm.id,
                    'answer': radios[index],
                    'correct': radios[index].parentNode.classList.contains("correct"),
                    'answerIndex': index
                };
            }
            radios[index].checked = false;
            radios[index].classList = radios[index].className.replace(/\bw--redirected-checked\b/g, "");
        }
    }

    nextQuestion(1);
    return true;
}

function endQuiz() {
    changeView();
    feedback(answers);
}

/**
 * 
 * @param {Event} event Event passed by DOM events
 */
function checkForm(event) {
    var button = $('.q-data .w-button:visible');
    if (button != null)
        button = button[0];

    button.disabled = false;
}

/**
 * 
 * @param {Array} array Array to be suffled
 */
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function shuffleAnswers() {
    for (let index = 0; index < maxQuestions; index++) {
        var form = questions[index].getElementsByClassName('form')[0];
        var button = questions[index].getElementsByClassName('div-block')[0];
        var inputs = questions[index].getElementsByClassName('w-radio');
        inputs[0].classList.add('correct');

        inputs = shuffle(Array.from(inputs));

        var output = "";
        for (let option = 0; option < inputs.length; option++) {
            output += inputs[option].outerHTML + "\n";
        }

        output += button.outerHTML;

        form.innerHTML = output;
    }
}

function changeView(feedback = true) {
    let quizRoot = document.getElementById("quiz-root");
    let feedbackRoot = document.getElementById("feedback-root");

    quizRoot.style.display = feedback ? "none" : "initial";
    feedbackRoot.style.display = !feedback ? "none" : "initial";
}

// Quiz slide
function nextQuestion(n) {
    showQuestion(currentQuestionIndex + n);
}

function setQuestion(n) {
    showQuestion(n);
}

function showQuestion(n) {
    var pagination = document.getElementsByClassName("paginacao");
    var oldQuestion = null

    if (n < 0 || n >= questions.length || n >= maxQuestions) {
        endQuiz();
    } else {
        for (let index = 0; index < questions.length; index++) {
            var element = questions[index];
            if (index === n) {
                currentQuestionIndex = n;

                if (currentQuestion != null)
                    oldQuestion = currentQuestion;

                currentQuestion = questions[n];
                currentForm = currentQuestion.getElementsByTagName("form")[0];
                // element.style.display = "table";
                element.style.position = "unset";
            }
            else {
                // element.style.display = "none";
                element.style.position = "absolute";
            }
        }

        fade(oldQuestion, currentQuestion);

        for (let index = 0; index < pagination.length; index++) {
            pagination[index].innerHTML = (currentQuestionIndex + 1) + " / " + (questions.length < maxQuestions ? questions.length : maxQuestions);
        }
    }
}

/**
 * Fade logic
 * @param {HTMLElement} from From element
 * @param {HTMLElement} to To element
 */
function fade(from, to) {
    setTimeout(function () {
        if (from != null)
            $(from).hide();
        if (to != null)
            $(to).fadeIn(1000);
    });
}

// Feedback
function feedback(quizData) {
    var correct = 0;
    var minPercentage = 0.7;

    for (let index = 0; index < quizData.length; index++) {
        let element = quizData[index] != null ? quizData[index] : 0;
        let id = element.id.match(/\d+/g)[0];

        if (element.correct)
            correct++;
    }

    var percentage = quizData.length > maxQuestions ? correct / maxQuestions : correct / quizData.length;

    {
        let percentageFields = document.getElementsByClassName('feedback-text');
        for (let index = 0; index < percentageFields.length; index++) {
            percentageFields[index].textContent = percentage * 100 + "%";
        }
    }
    document.getElementById("feedback-negative").style.display = percentage < minPercentage ? "initial" : "none";
    document.getElementById("feedback-positive").style.display = percentage < minPercentage ? "none" : "initial";

    
}

function restartQuiz() {
    questions = shuffle(Array.from(document.getElementsByClassName("q-data")));
    answers = []
    currentQuestionIndex = 0;
    currentQuestion = null;
    currentForm = null;
    $(".q-container > div").hide();

    init();
}