// Diese feste Zuordnung macht die digitale Einzelziehung möglich:
// Egal, wer wann und von welchem Gerät aus öffnet, jede Person hat genau ein Los.
// Niemand zieht sich selbst oder den eigenen Partner.
const PEOPLE = [
  { name: "Janika", article: "die", partner: "Silas", recipient: "Tim", answer: "Mit der doppelt dicken Winterdecke.", question: "Wie übersteht man die super heißen Sommernächte, in denen die Wohnung kaum runterkühlt?" },
  { name: "Silas", article: "der", partner: "Janika", recipient: "Mathilda", answer: "2e30 kg", question: "Masse von <s>Toni</s> <strong>der Sonne</strong> in wissenschaftlicher Notation:" },
  { name: "Tim", article: "der", partner: "Mathilda", recipient: "Johanna", answer: "Tim, hast du noch einen Termin?", question: "Die einzig richtige Frage beim Übergang von Einsteinstraße auf die A96?" },
  { name: "Mathilda", article: "die", partner: "Tim", recipient: "Toni", answer: "SO schön, dass DU da bist!", question: "Wie begrüßt man seine Leute bei einem ICF Couples Event am besten?" },
  { name: "Toni", article: "der", partner: "Johanna", recipient: "Silas", answer: "Gleitgel", question: "Was wäre das perfekte Willkommensgeschenk für die Paare bei einem Couples Weekend und auch sonst immer und überall eine sehr gute Option?" },
  { name: "Johanna", article: "die", partner: "Toni", recipient: "Janika", answer: "Supervision", question: "Wie genau heißt denn nun das Supportangebot für Ehecoaches richtig?" },
];

let selectedPerson = null;
let scratching = false;
let isRevealed = false;

const grid = document.querySelector("#people-grid");
const questionForm = document.querySelector("#question-form");
const identityLine = document.querySelector("#identity-line");
const questionLabel = document.querySelector("#question-label");
const answerInput = document.querySelector("#secret-answer");
const formError = document.querySelector("#form-error");
const scratcher = document.querySelector("#scratcher");
const recipientName = document.querySelector("#recipient-name");
const ticketMessage = document.querySelector("#ticket-message");
const ticket = document.querySelector("#ticket");
const canvas = document.querySelector("#scratch-canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });
const revealActions = document.querySelector("#reveal-actions");
const scratchHint = document.querySelector("#scratch-hint");

function renderPeople() {
  grid.replaceChildren();
  PEOPLE.forEach((person) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "person-button";
    const overviewName = person.name === "Tim" ? "Tom" : person.name;
    button.innerHTML = `<span class="person-name">${overviewName}</span><span class="person-meta">privates Los öffnen</span>`;
    button.addEventListener("click", () => selectPerson(person));
    grid.append(button);
  });
}

function selectPerson(person) {
  selectedPerson = person;
  identityLine.textContent = `Aha! Du behauptest also, ${person.article} ${person.name} zu sein? Das muss ich zuerst gründlich mit einer Sicherheitsfrage überprüfen!`;
  questionLabel.innerHTML = person.question;
  answerInput.value = "";
  formError.textContent = "";
  grid.classList.add("hidden");
  questionForm.classList.remove("hidden");
  answerInput.focus();
}

document.querySelector("#back-button").addEventListener("click", () => {
  selectedPerson = null;
  questionForm.classList.add("hidden");
  grid.classList.remove("hidden");
});

// Jede Eingabe zeigt statt des getippten Zeichens den nächsten Buchstaben der Lösung.
// Löschen bleibt dabei ganz normal möglich.
answerInput.addEventListener("beforeinput", (event) => {
  if (!selectedPerson || event.inputType.startsWith("delete")) return;
  if (!event.inputType.startsWith("insert")) return;
  event.preventDefault();
  const typedLength = Math.max(1, Array.from(event.data || " ").length);
  const selectedLength = answerInput.selectionEnd - answerInput.selectionStart;
  const newLength = Math.min(selectedPerson.answer.length, answerInput.value.length - selectedLength + typedLength);
  answerInput.value = selectedPerson.answer.slice(0, newLength);
  answerInput.setSelectionRange(newLength, newLength);
});

answerInput.addEventListener("input", () => {
  if (!selectedPerson) return;
  const length = Math.min(answerInput.value.length, selectedPerson.answer.length);
  answerInput.value = selectedPerson.answer.slice(0, length);
  answerInput.setSelectionRange(length, length);
});

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (answerInput.value !== selectedPerson.answer) {
    formError.textContent = "Noch nicht ganz. Tippe einfach weiter – der Sicherheitswichtel führt deine Finger schon richtig.";
    return;
  }
  openTicket();
});

function openTicket() {
  questionForm.classList.add("hidden");
  // Erst unsichtbar layouten und die Rubbelfläche vollständig zeichnen.
  // So kann der Empfängername auch bei träger Darstellung niemals aufblitzen.
  scratcher.classList.add("is-preparing");
  scratcher.classList.remove("hidden");
  revealActions.classList.add("hidden");
  isRevealed = false;
  canvas.style.display = "block";
  canvas.style.opacity = "1";
  resetScratchSurface();
  recipientName.textContent = selectedPerson.recipient;
  ticketMessage.textContent = `Hallo ${selectedPerson.name}: Bitte besorge etwas, das ${selectedPerson.recipient} gleichzeitig verwirrt und zum Lachen bringt.`;
  requestAnimationFrame(() => {
    scratcher.classList.remove("is-preparing");
    scratcher.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function resetScratchSurface() {
  const rect = ticket.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#b8c0b8";
  context.fillRect(0, 0, rect.width, rect.height);
  context.fillStyle = "rgba(255,255,255,.42)";
  context.font = "bold 15px DM Mono, monospace";
  context.textAlign = "center";
  context.fillText("✦ RUBBEL DICH INS „GLÜCK“ ✦", rect.width / 2, rect.height / 2);
  context.globalCompositeOperation = "destination-out";
  scratchHint.textContent = "Rubbel dich ins „Glück“!";
}

function positionFor(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function scratchAt(event) {
  if (!scratching || isRevealed) return;
  const { x, y } = positionFor(event);
  context.beginPath();
  context.arc(x, y, 25, 0, Math.PI * 2);
  context.fill();
  if (Math.random() < .14) checkReveal();
}

canvas.addEventListener("pointerdown", (event) => { scratching = true; canvas.setPointerCapture(event.pointerId); scratchAt(event); });
canvas.addEventListener("pointermove", scratchAt);
canvas.addEventListener("pointerup", () => { scratching = false; checkReveal(); });
canvas.addEventListener("pointercancel", () => { scratching = false; });

function checkReveal() {
  if (isRevealed) return;
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0;
  for (let i = 3; i < pixels.length; i += 32) if (pixels[i] < 50) transparent += 1;
  if (transparent / (pixels.length / 32) > .42) revealTicket();
}

function revealTicket() {
  isRevealed = true;
  canvas.style.transition = "opacity .45s ease";
  canvas.style.opacity = "0";
  window.setTimeout(() => { canvas.style.display = "none"; }, 480);
  scratchHint.textContent = "🎁 Geheimnis gelüftet. Nicht verraten – und schnell wieder wegklicken!";
  revealActions.classList.remove("hidden");
}

window.addEventListener("resize", () => {
  if (!scratcher.classList.contains("hidden") && !isRevealed) resetScratchSurface();
});

renderPeople();
