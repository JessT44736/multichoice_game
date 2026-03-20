const allQuizCollections = {

programming: [

{ term: "TCP Port 445", def: "SMB(Server Message Block)/ Common Internet File System "},
{ term:     "TCP Port 465",   def: "SMTPS(Simple Mail Transfer Protocol Secure)"},
{ term:     "TCP Port 22", def: "SFTP(Secure File Transfer Protocol)"},
{ term:     "TCP Port 443",   def: "HTTPS(Hypertext Transfer Protocol Secure)"},
{ term:     "TCP Port 23",    def: "Telnet "    },
{ term:     "TCP Ports 20/21", def: "FTP(File Transfer Protocol) "},
{ term:     "UDP Port 514",   def: "Syslog "    },
{ term:     "UDP Port 53",    def: "DNS(Domain Name System) "     },
{ term:     "TCP Port 636",   def: "LDAPS(Lightweight Directory Access Protocol over SSL)"},
{ term:     "TCP Port 1433", def: "SQL Server(Structured Query Language Server)"},
{ term:     "UDP Port 123",   def: "NTP(Network Time Protocol) "},
{ term:     "UDP Port 3389", def: "RDP(Remote Desktop Protocol)"},
{ term:     "UDP Ports 5060(u)/5061(e)", def:   "SIP(Session Initiated Protocol)"},
{ term:     "TCP Port 80", def: "HTTP(Hypertext Transfer Protocol)"},
{ term:     "TCP Port 22", def: "SSH(Secure Shell)"},
{ term:     "UDP Ports 67/68", def: "DHCP(Dynamic Host Configuration Protocol)"},
{ term:     "TCP Port 25", def: "SMTP(Simple Mail Transfer Protocol)"},
{ term:     "UDP Port 69", def: "TFTP(Trivial File Transfer Protocol)"},
{ term:     "UDP Port 161/162 ", def: "SNMP(Simple Network management Protocol)"},
{ term:     "TCP Port 389", def: "LDAP(Lightweight Directory Access Protocol) "}    

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

shuffleArray(wrongChoices);

 const selectedWrongChoices = wrongChoices.slice(0, 3);


const choices = [correctTerm, ...selectedWrongChoices];

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