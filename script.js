const allQuizCollections = {
    programming: [
        { term: "Python", def: "A high-level, interpreted programming language." },
        { term: "Variable", def: "A reserved memory location to store values." },
        { term: "Function", def: "A block of organized, reusable code." },
        { term: "Loop", def: "A sequence of instructions that is continually repeated." }
    ],
    science: [
        { term: "Atom", def: "The basic unit of a chemical element." },
        { term: "Gravity", def: "A force that attracts two bodies towards each other." },
        { term: "Photosynthesis", def: "The process by which green plants create energy from sunlight." },
        { term: "Evolution", def: "The process by which different kinds of living organisms are thought to have developed." }
    ],
    history: [
        { term: "Renaissance", def: "A period of cultural rebirth in Europe." },
        { term: "Industrial Revolution", def: "The transition to new manufacturing processes in the 18th and 19th centuries." },
        { term: "Cold War", def: "A state of political tension between the Soviet Union and the United States." },
        { term: "French Revolution", def: "A period of radical social and political change in France." }
    ],
};

let currentCategory = "";
let quizData = [];
let currentIndex = 0;
let score = 0;

const categories = Object.keys(allQuizCollections);
const categoryButtonsContainer = document.getElementById('category-buttons');
const defDisplay = document.getElementById('definition-text');
const feedback = document.getElementById('feedback');
const scoreBoard = document.getElementById('score-board');
const choicesContainer = document.getElementById('choices-container');
const nextGameBtn = document.getElementById('next-game-btn');
const progressBar = document.getElementById('progress-bar');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateProgress() {
    if (!progressBar || !quizData.length) return;
    const percent = Math.min(100, Math.round((currentIndex / quizData.length) * 100));
    progressBar.style.width = `${percent}%`;
}

function getRandomCategory(excludeCategory) {
    const pool = categories.filter(category => category !== excludeCategory);
    if (pool.length === 0) return categories[0];
    return pool[Math.floor(Math.random() * pool.length)];
}

function startNewGame(category) {
    currentCategory = category || getRandomCategory(currentCategory);
    quizData = [...allQuizCollections[currentCategory]];

    shuffleArray(quizData);

    currentIndex = 0;
    score = 0;
    scoreBoard.innerText = "Score: 0";
    feedback.innerText = "";
    nextGameBtn.style.display = "none";

    updateProgress();
    loadQuestion();
}

function loadQuestion() {
    choicesContainer.innerHTML = "";
    feedback.innerText = "";

    updateProgress();

    if (currentIndex < quizData.length) {
        const currentItem = quizData[currentIndex];
        defDisplay.innerText = currentItem.def;

        const choices = generateChoices(currentItem.term);

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice;
            btn.classList.add('choice-btn');
            btn.onclick = () => checkAnswer(choice);
            choicesContainer.appendChild(btn);
        });
    } else {
        defDisplay.innerText = `🎉 Game Over! (${currentCategory.toUpperCase()})`;
        choicesContainer.innerHTML = "";
        scoreBoard.innerText = `Final Score: ${score}/${quizData.length}`;
        nextGameBtn.style.display = "inline-block";
        progressBar.style.width = "100%";
    }
}

function generateChoices(correctTerm) {
    const wrongChoices = quizData
        .map(item => item.term)
        .filter(term => term !== correctTerm);

    const choices = [correctTerm, ...wrongChoices];
    return choices.sort(() => Math.random() - 0.5);
}

function checkAnswer(selectedTerm) {
    const correctTerm = quizData[currentIndex].term;

    if (selectedTerm === correctTerm) {
        score++;
        feedback.innerText = "✅ Correct!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = `❌ Wrong! It was: ${correctTerm}`;
        feedback.style.color = "red";
    }

    document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);

    currentIndex++;
    scoreBoard.innerText = `Score: ${score}`;

    updateProgress();
    setTimeout(loadQuestion, 1500);
}

function initCategoryButtons() {
    if (!categoryButtonsContainer) return;

    categoryButtonsContainer.innerHTML = "";

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.innerText = category.charAt(0).toUpperCase() + category.slice(1);
        btn.onclick = () => startNewGame(category);
        categoryButtonsContainer.appendChild(btn);
    });

    const randomBtn = document.createElement('button');
    randomBtn.innerText = "Random";
    randomBtn.onclick = () => startNewGame();
    categoryButtonsContainer.appendChild(randomBtn);
}

nextGameBtn.onclick = () => startNewGame();

initCategoryButtons();

// Start the first game with a random category
startNewGame();
