// Die Fragen und Antworten sind bewusst nur Platzhalter. Vor dem großen Abend hier ersetzen.
// Hinweis: GitHub Pages ist eine statische Webseite. Die Antworten sind daher keine echte
// Sicherheit, sondern die charmante "Bist-du-wirklich-du?"-Hürde für eine gemeinsame Ziehung.
const PEOPLE = [
  { name: "Janika", partner: "Silas", question: "Platzhalterfrage: Welches Objekt würdest du in einem Tauschhandel gegen ein Waffeleisen eintauschen?", answer: "waffeleisen" },
  { name: "Silas", partner: "Janika", question: "Platzhalterfrage: Wie lautet der geheime Name deines imaginären Weihnachtsrenntiers?", answer: "rentier" },
  { name: "Tim", partner: "Mathilda", question: "Platzhalterfrage: Welche Geschmacksrichtung hätte deine persönliche Adventskerze?", answer: "zimt" },
  { name: "Mathilda", partner: "Tim", question: "Platzhalterfrage: Welcher Song läuft in deinem Kopf, wenn du einen Toaster siehst?", answer: "toaster" },
  { name: "Toni", partner: "Johanna", question: "Platzhalterfrage: Wie viele Kabel sind in deiner Lieblings-Krimskrams-Schublade völlig rätselhaft?", answer: "sieben" },
  { name: "Johanna", partner: "Toni", question: "Platzhalterfrage: Was ist das unnötigste Geschenk, über das du trotzdem lachen würdest?", answer: "socken" },
];

const STORAGE_KEY = "schrottwichteln-2026";
let selectedPerson = null;
let session = loadSession();

const grid = document.querySelector("#people-grid");
const drawStatus = document.querySelector("#draw-status");
const questionForm = document.querySelector("#question-form");
const questionName = document.querySelector("#question-name");
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
let scratching = false;
let isRevealed = false;

function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.assignments && saved?.drawn) return saved;
  } catch (_) { /* Neue Ziehung bei kaputtem Speicher. */ }
  return { assignments: createAssignments(), drawn: [] };
}

function createAssignments() {
  const names = PEOPLE.map(({ name }) => name);
  let candidates = [];
  // Jede erlaubte Zufallspermutation erfüllt: niemand zieht sich oder den Partner.
  do {
    candidates = shuffle([...names]);
  } while (PEOPLE.some((person, index) => candidates[index] === person.name || candidates[index] === person.partner));
  return Object.fromEntries(PEOPLE.map((person, index) => [person.name, candidates[index]]));
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); }

function renderPeople() {
  grid.replaceChildren();
  PEOPLE.forEach((person) => {
    const drawn = session.drawn.includes(person.name);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "person-button";
    button.disabled = drawn;
    button.innerHTML = `<span class="person-name">${person.name}</span><span class="person-meta">${drawn ? "Los gezogen ✓" : "Los bereit"}</span>`;
    button.addEventListener("click", () => selectPerson(person));
    grid.append(button);
  });
  const remaining = PEOPLE.length - session.drawn.length;
  drawStatus.textContent = remaining === 0 ? "Alle Lose gezogen 🎉" : `${remaining} ${remaining === 1 ? "Los wartet" : "Lose warten"}`;
}

function selectPerson(person) {
  selectedPerson = person;
  questionName.textContent = `Hallo, ${person.name}!`;
  questionLabel.textContent = person.question;
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

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = answerInput.value.trim().toLocaleLowerCase("de-DE");
  if (!answer) {
    formError.textContent = "Eine Antwort muss schon sein – der Weihnachtswichtel notiert mit.";
    return;
  }
  if (answer !== selectedPerson.answer.toLocaleLowerCase("de-DE")) {
    formError.textContent = "Hmmm. Das klingt verdächtig nach einem Wichtel im falschen Kostüm. Versuch's noch mal!";
    return;
  }
  openTicket();
});

function openTicket() {
  questionForm.classList.add("hidden");
  scratcher.classList.remove("hidden");
  revealActions.classList.add("hidden");
  isRevealed = false;
  const recipient = session.assignments[selectedPerson.name];
  recipientName.textContent = recipient;
  ticketMessage.textContent = `Hallo ${selectedPerson.name}: Bitte besorge etwas, das ${recipient} gleichzeitig verwirrt und zum Lachen bringt.`;
  scratcher.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(resetScratchSurface, 250);
}

function resetScratchSurface() {
  const rect = ticket.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  context.globalCompositeOperation = "source-over";
  context.fillStyle = "#b7bab9";
  context.fillRect(0, 0, rect.width, rect.height);
  context.fillStyle = "rgba(255,255,255,.38)";
  context.font = "bold 15px DM Mono, monospace";
  context.textAlign = "center";
  context.fillText("✦ HIER RUBBELN, DU KREATIVER CHAOS-ELF ✦", rect.width / 2, rect.height / 2);
  context.globalCompositeOperation = "destination-out";
  scratchHint.textContent = "Mit Maus oder Finger die silberne Fläche wegrubbeln.";
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
  scratchHint.textContent = "🎁 Geheimnis gelüftet. Jetzt bloß niemandem verraten!";
  revealActions.classList.remove("hidden");
  if (!session.drawn.includes(selectedPerson.name)) {
    session.drawn.push(selectedPerson.name);
    persist();
    renderPeople();
  }
}

document.querySelector("#next-person").addEventListener("click", () => {
  scratcher.classList.add("hidden");
  canvas.style.display = "block";
  canvas.style.opacity = "1";
  selectedPerson = null;
  grid.classList.remove("hidden");
  document.querySelector(".draw-area").scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("resize", () => { if (!scratcher.classList.contains("hidden") && !isRevealed) resetScratchSurface(); });
renderPeople();
