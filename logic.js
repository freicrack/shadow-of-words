/* ---------- Data / question bank ---------- */
const QUESTIONS = [
  {word:"apple", type:"countable", hint:"You can count them individually"},
  {word:"water", type:"uncountable", hint:"You can't count it in units without containers"},
  {word:"book", type:"countable"},
  {word:"rice", type:"uncountable"},
  {word:"money", type:"uncountable", hint:"A general substance, but 'a coin' is countable"},
  {word:"sword", type:"countable"},
  {word:"bread", type:"uncountable"},
  {word:"egg", type:"countable"},
  {word:"information", type:"uncountable"},
  {word:"chair", type:"countable"},
  {word:"sand", type:"uncountable"},
  {word:"coin", type:"countable"},
];

let playerHP = 3, enemyHP = 3, score = 0;
let currentQuestion = null;
let isRunning = false;

/* ---------- Elements ---------- */
const wordBox = document.getElementById('wordBox');
const feedback = document.getElementById('feedback');
const barPlayer = document.getElementById('barPlayer');
const barEnemy = document.getElementById('barEnemy');
const scoreEl = document.getElementById('score');
const playerChar = document.getElementById('playerChar');
const enemyChar = document.getElementById('enemyChar');
const btnCount = document.getElementById('btnCount');
const btnUncount = document.getElementById('btnUncount');
const btnStart = document.getElementById('btnStart');
const btnHint = document.getElementById('btnHint');
const mobileControls = document.getElementById('mobileControls');
const mCount = document.getElementById('mCount');
const mUncount = document.getElementById('mUncount');

const sfxCorrect = document.getElementById('sfxCorrect');
const sfxWrong = document.getElementById('sfxWrong');
const sfxHurt = document.getElementById('sfxHurt');
const music = document.getElementById('music');

/* ---------- Helpers ---------- */
function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function updateHPBars(){
  barPlayer.style.width = `${(playerHP/3)*100}%`;
  barEnemy.style.width = `${(enemyHP/3)*100}%`;
}
function setFeedback(text, type){
  feedback.textContent = text;
  feedback.className = "feedback";
  if(type === "correct") feedback.classList.add("correct");
  if(type === "wrong") feedback.classList.add("wrong");
}

/* ---------- Game flow ---------- */
function startTrial(){
  isRunning = true;
  playerHP = 3; enemyHP = 3; score = 0;
  scoreEl.textContent = score;
  updateHPBars();
  setFeedback("Trial started. Choose wisely...");
  nextQuestion();
  try{ music.currentTime=0; music.volume=0.35; music.play(); }catch(e){}
  // show mobile buttons if small screen
  if(window.innerWidth < 880) mobileControls.style.display = 'flex';
}

function endGame(win){
  isRunning = false;
  if(win){
    setFeedback(`You conquered the shadows! Score ${score}`, "correct");
  } else {
    setFeedback(`You were consumed by the shadows... Score ${score}`, "wrong");
  }
  wordBox.textContent = '—';
  mobileControls.style.display = 'none';
  try{ music.pause(); }catch(e){}
}

function nextQuestion(){
  currentQuestion = rand(QUESTIONS);
  wordBox.textContent = currentQuestion.word;
  animateCharacters('idle');
}

/* ---------- Answer check ---------- */
function answer(type){
  if(!isRunning || !currentQuestion) return;
  if(type === currentQuestion.type){
    // correct
    enemyHP = clamp(enemyHP - 1, 0, 3);
    score++;
    scoreEl.textContent = score;
    setFeedback("✅ Correct! You strike the enemy.", "correct");
    sfxCorrect.play().catch(()=>{});
    animateCharacters('playerAttack');
    // enemy hurt shake
    enemyChar.style.transform = 'translateY(-6px) scale(1.02)';
    setTimeout(()=>{ enemyChar.style.transform = ''; }, 220);
    if(enemyHP <= 0){
      // enemy defeated, respawn
      setTimeout(()=>{
        setFeedback("💀 Enemy defeated. A new shadow approaches...");
        enemyHP = 3;
        updateHPBars();
        nextQuestion();
      }, 600);
      return;
    }
  } else {
    // wrong
    playerHP = clamp(playerHP - 1, 0, 3);
    setFeedback("❌ Wrong! The enemy strikes you.", "wrong");
    sfxWrong.play().catch(()=>{});
    animateCharacters('enemyAttack');
    playerChar.style.transform = 'translateY(-6px) scale(0.98)';
    setTimeout(()=>{ playerChar.style.transform = ''; }, 220);
    if(playerHP <= 0){
      // game over
      sfxHurt.play().catch(()=>{});
      setTimeout(()=> endGame(false), 700);
      return;
    }
  }
  updateHPBars();
  // small delay then next word
  setTimeout(() => {
    if(isRunning) nextQuestion();
  }, 550);
}

/* ---------- Animations ---------- */
function animateCharacters(action){
  if(action === 'playerAttack'){
    // player lunge slightly right
    playerChar.style.transform = 'translateY(-8px) translateX(18px) scale(1.02)';
    setTimeout(()=> playerChar.style.transform = '', 260);
  } else if(action === 'enemyAttack'){
    enemyChar.style.transform = 'translateY(-6px) translateX(-12px) scale(1.02)';
    setTimeout(()=> enemyChar.style.transform = '', 260);
  } else {
    // idle
    playerChar.style.transform = '';
    enemyChar.style.transform = '';
  }
}

/* ---------- Hints ---------- */
btnHint.addEventListener('click', ()=>{
  if(!currentQuestion) return;
  const hint = currentQuestion.hint || (currentQuestion.type === 'countable' ? 'Think of singular/plural forms' : 'Think of general substances or mass words');
  setFeedback('💡 Hint: ' + hint);
});

/* ---------- Input handlers ---------- */
btnCount.addEventListener('click', ()=> answer('countable'));
btnUncount.addEventListener('click', ()=> answer('uncountable'));
mCount.addEventListener('click', ()=> answer('countable'));
mUncount.addEventListener('click', ()=> answer('uncountable'));
btnStart.addEventListener('click', ()=> {
  if(!isRunning) startTrial(); else { setFeedback('Trial already running'); }
});

// keyboard controls: C and U
window.addEventListener('keydown', (e)=>{
  if(e.code === 'KeyC') answer('countable');
  if(e.code === 'KeyU') answer('uncountable');
  if(e.code === 'Space') { if(!isRunning) startTrial(); }
});

/* ---------- init ---------- */
updateHPBars();
setFeedback("Click Start to begin the trial. Press C or U to answer.");

/* accessibility: pause music on blur */
window.addEventListener('blur', ()=>{ try{ music.pause(); }catch(e){} });
// INVENTORY SYSTEM
const btnInventory = document.getElementById("btnInventory");
const invPanel = document.getElementById("inventoryPanel");
const btnCloseInv = document.getElementById("btnCloseInv");
const invGrid = document.getElementById("inventoryGrid");
const invDesc = document.getElementById("inventoryDesc");

let inventory = [
  { name: "Sword", icon: "assets/items/sword.png", qty: 1, desc: "A sharp steel blade." },
  { name: "Potion", icon: "assets/items/potion.png", qty: 2, desc: "Heals your wounds." },
  { name: "Gold", icon: "assets/items/gold.png", qty: 5, desc: "Shiny coins of value." }
];

function renderInventory() {
  invGrid.innerHTML = "";
  inventory.forEach((item) => {
    const el = document.createElement("div");
    el.classList.add("inventory-item");
    el.innerHTML = `
      <img src="${item.icon}" alt="${item.name}">
      <div class="item-count">x${item.qty}</div>
    `;
    el.onclick = () => {
      invDesc.textContent = `${item.name}: ${item.desc}`;
    };
    invGrid.appendChild(el);
  });
}

btnInventory.addEventListener("click", () => {
  invPanel.classList.toggle("show");
});
btnCloseInv.addEventListener("click", () => {
  invPanel.classList.remove("show");
});

renderInventory();