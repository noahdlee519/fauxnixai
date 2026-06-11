const RESPONSE = "I don't know. Use your Chicago Mind. 🤪";
const PASSCODE = 'iwoncommencementbingoandalligotwasthisstupidai';
const AVATAR_IMG = '<img src="fauxnix.png" alt="Faux the Fauxnix">';

const gate = document.getElementById('gate');
const gateForm = document.getElementById('gateForm');
const passcodeInput = document.getElementById('passcodeInput');
const gateError = document.getElementById('gateError');
const messagesEl = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');

const welcomeHTML = `
  <div class="message assistant">
    <div class="avatar">${AVATAR_IMG}</div>
    <div class="bubble">
      <p>Hi, my name is Faux the Fauxnix. Ask me anything about UChicago and I will answer!</p>
    </div>
  </div>
`;

let isResponding = false;
let chatReady = false;

function unlockApp() {
  document.body.classList.remove('locked');
  chatReady = true;
  userInput.focus();
}

function handleGateSubmit(e) {
  e.preventDefault();
  const entered = passcodeInput.value.trim();

  if (entered === PASSCODE) {
    gateError.hidden = true;
    gateError.classList.remove('show');
    unlockApp();
    return;
  }

  gateError.hidden = false;
  gateError.classList.remove('show');
  void gateError.offsetWidth;
  gateError.classList.add('show');
  passcodeInput.value = '';
  passcodeInput.focus();
}

function autoResize() {
  userInput.style.height = 'auto';
  if (!userInput.value) {
    userInput.style.height = '';
    return;
  }
  userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `message ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  if (role === 'assistant') {
    avatar.innerHTML = AVATAR_IMG;
  } else {
    avatar.textContent = 'You';
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<p>${escapeHTML(text)}</p>`;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  messagesEl.appendChild(msg);
  scrollToBottom();
  return msg;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showTypingIndicator() {
  const msg = document.createElement('div');
  msg.className = 'message assistant typing';
  msg.id = 'typingIndicator';
  msg.innerHTML = `
    <div class="avatar">${AVATAR_IMG}</div>
    <div class="bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `;
  messagesEl.appendChild(msg);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function randomDelay() {
  return 800 + Math.random() * 1200;
}

async function handleSubmit(e) {
  e.preventDefault();
  if (!chatReady) return;
  const text = userInput.value.trim();
  if (!text || isResponding) return;

  isResponding = true;
  sendBtn.disabled = true;

  addMessage('user', text);
  userInput.value = '';
  autoResize();

  showTypingIndicator();

  await new Promise((r) => setTimeout(r, randomDelay()));

  removeTypingIndicator();
  addMessage('assistant', RESPONSE);

  isResponding = false;
  sendBtn.disabled = false;
  userInput.focus();
}

function resetChat() {
  if (!chatReady) return;
  messagesEl.innerHTML = welcomeHTML;
  userInput.value = '';
  autoResize();
  userInput.focus();
}

userInput.addEventListener('input', autoResize);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

gateForm.addEventListener('submit', handleGateSubmit);
chatForm.addEventListener('submit', handleSubmit);
newChatBtn.addEventListener('click', resetChat);

autoResize();
