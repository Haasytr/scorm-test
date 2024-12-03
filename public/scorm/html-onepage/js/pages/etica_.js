const answerGuide = [
    {
        "question": "60a79e52f9151eb206e071e9a3d332cb",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "4ee58c6acb49099994478efb98e896c0",
        "answer": 3,
        "chances": 2,
    },
    {
        "question": "d997af2ed3211fbc31cacd7fb55f99dc",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "9fe57693c4a1b18d58274683f99ad54b",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "e2a827db81ac48a3a059d8c799e5357e",
        "answer": 2,
        "chances": 2,
    },
    {
        "question": "6d873fcfe3b6e1f4ea75bb98729d9607",
        "answer": 1,
        "chances": 2,
    },
    {
        "question": "bdf2e2538ce976b6e3119dc46c37d523",
        "answer": 2,
        "chances": 2,
    },
    {
        "question": "0f29f394b5c7b27cfd8e39e8f78c5ab8",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "0273f740d6d1c506b8676fb86562ac86",
        "answer": 3,
        "chances": 2,
    },
    {
        "question": "6b7506841ba724ba2c64b85f4a1d17af",
        "answer": 1,
        "chances": 2,
    },

    {
        "question": "77f791e6605246f847368846776472db",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "a54217e2fc8aa52c67a15baea36c259e",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "c9fecbcaab4586a19cd1c6dfea782ddd",
        "answer": 2,
        "chances": 2,
    },
    {
        "question": "f35f81055d9677a58806172eb644d003",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "85654a0a8121dc1ab31a9dfd7dc0b95b",
        "answer": 0,
        "chances": 2,
    },
    {
        "question": "0ba0f9cb66926eaf1a0bd256be37c5b4",
        "answer": 0,
        "chances": 2,
    },
];

$('input:radio').click(function (e) {
    const answer = this.closest('.list-item-2');
    const selected = $('.list-item-2[selected]')[0];

    if (answer.getAttribute('disabled') || this.getAttribute('disabled'))
        return;

    if (selected != null) {
        selected.removeAttribute('selected');
        selected.classList.remove('item-selected');
    }

    answer.toggleAttribute('selected');
    answer.classList.add('item-selected');
});

$('.button-2').click(function (e) {
    const question = this.closest('.w-container');
    const answerList = $(question).children('.lec-lista')[0];
    const answer = $(answerList).children('[selected]')[0] != null ? $(answerList).children('[selected]')[0].closest('.list-item-2') : null;

    if (answer != null && !(answer.hasAttribute('correct') || answer.hasAttribute('wrong'))) {
        const questionID = answerList.getAttribute('q-id');
        if (questionID == null)
            return;

        const answerIndex = (function () {
            for (let index = 0; index < answerList.children.length; index++) {
                if (answerList.children[index] == answer)
                    return index;
            }

            return -1;
        }());

        for (let index = 0; index < answerGuide.length; index++) {
            const guide = answerGuide[index];

            if (guide.question != questionID)
                continue

            const isCorrect = guide.answer == answerIndex;

            guide.chances--;

            answer.removeAttribute('selected');
            answer.classList.remove('item-selected');

            answer.setAttribute(answerIndex == guide.answer ? 'correct' : 'wrong', "");
            if (answerIndex != guide.answer && guide.chances <= 0)
                answerList.children[guide.answer].toggleAttribute('correct', true);

            this.classList.toggle('bt-retry', !isCorrect && guide.chances > 0);
            this.classList.toggle('bt-wrong', !isCorrect && guide.chances <= 0);
            this.classList.toggle('bt-correct', isCorrect);

            if (guide.chances > 0 && !isCorrect) {
                this.innerHTML = "RESPOSTA INCORRETA, <strong>" + guide.chances + "</strong> " + (guide.chances > 1 ? "TENTATIVAS RESTANTES" : "TENTATIVA RESTANTE");
            }
            else {
                for (let index = 0; index < answerList.children.length; index++) {
                    const element = answerList.children[index];
                    element.classList.toggle('test-feed-block', true);
                    element.setAttribute('disabled', true);
                }

                this.innerHTML = isCorrect ? "PARABÉNS VOCÊ ACERTOU" : "VOCÊ FALHOU. RESPOSTA CERTA <strong>" + String.fromCharCode(65 + guide.answer) + "</strong>";
            }

            break;
        }
    }
});