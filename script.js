/* ===== 1. Menú mòbil ===== */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
  const obert = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', obert);
});
menu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ===== 2. Marcar la secció activa al menú ===== */
const enllacos = [...menu.querySelectorAll('a')];
const observador = new IntersectionObserver((entrades) => {
  entrades.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enllacos.forEach((a) =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + entrada.target.id)
      );
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => observador.observe(s));

/* ===== 3. Xat de demostració (secció Inici) ===== */
// Cada pregunta té la seva resposta. Per afegir-ne una, afegeix una entrada aquí.
const preguntes = {
  'Què feu?': 'Creem xats intel·ligents, automatitzem tasques d\'oficina, desenvolupem apps mòbils i instal·lem doble verificació de contrasenyes.',
  'On sou?': 'Som a Manresa, al Bages. Treballem sobretot amb pimes de la comarca.',
  'Feu apps per a mòbil?': 'Sí! Dissenyem aplicacions a mida per a Android i iPhone.',
  'Com us puc contactar?': 'Pots escriure\'ns des del formulari de contacte o a info@aetherit.example.'
};
const chatBody = document.getElementById('chatBody');
const chatOpts = document.getElementById('chatOpts');

function afegirMissatge(text, tipus) {
  const p = document.createElement('p');
  p.className = 'msg ' + tipus;
  p.textContent = text; // textContent evita injectar HTML
  chatBody.appendChild(p);
  chatBody.scrollTop = chatBody.scrollHeight;
}

Object.keys(preguntes).forEach((pregunta) => {
  const boto = document.createElement('button');
  boto.type = 'button';
  boto.textContent = pregunta;
  boto.addEventListener('click', () => {
    afegirMissatge(pregunta, 'user');
    setTimeout(() => afegirMissatge(preguntes[pregunta], 'bot'), 500);
  });
  chatOpts.appendChild(boto);
});

/* ===== 4. Carrusel de projectes ===== */
const track = document.getElementById('track');
const slides = track.children;
const pager = document.getElementById('pager');
let actual = 0;

// Crea els punts de navegació
[...slides].forEach((_, i) => {
  const punt = document.createElement('button');
  punt.setAttribute('aria-label', 'Anar al projecte ' + (i + 1));
  punt.addEventListener('click', () => anarA(i));
  pager.appendChild(punt);
});

function anarA(index) {
  // Si passem de l'últim, tornem al primer (i al revés)
  actual = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${actual * 100}%)`;
  [...pager.children].forEach((p, i) =>
    p.setAttribute('aria-current', i === actual ? 'true' : 'false')
  );
  [...slides].forEach((s, i) => s.setAttribute('aria-hidden', i !== actual));
}

document.getElementById('next').addEventListener('click', () => anarA(actual + 1));
document.getElementById('prev').addEventListener('click', () => anarA(actual - 1));
document.getElementById('carousel').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') anarA(actual + 1);
  if (e.key === 'ArrowLeft') anarA(actual - 1);
});

// Lliscar amb el dit en mòbils
let iniciX = 0;
track.addEventListener('touchstart', (e) => { iniciX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].clientX - iniciX;
  if (Math.abs(diff) > 50) anarA(actual + (diff < 0 ? 1 : -1));
});

anarA(0);

/* ===== 5. Validació del formulari de contacte ===== */
const form = document.getElementById('form');
const resultat = document.getElementById('result');
const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Mostra o esborra l'error d'un camp. Retorna true si el camp és vàlid.
function marcar(camp, missatge) {
  form.querySelector(`[data-for="${camp}"]`).textContent = missatge;
  form.elements[camp].classList.toggle('invalid', Boolean(missatge));
  return !missatge;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nom = form.nom.value.trim();
  const email = form.email.value.trim();
  const assumpte = form.assumpte.value.trim();
  const missatge = form.missatge.value.trim();

  const valids = [
    marcar('nom', nom ? '' : 'Escriu el teu nom.'),
    marcar('email',
      !email ? 'Escriu el teu correu electrònic.'
      : !reEmail.test(email) ? 'El correu no és vàlid. Exemple: nom@empresa.cat'
      : ''),
    marcar('assumpte', assumpte ? '' : 'Indica l\'assumpte del missatge.'),
    marcar('missatge', missatge.length >= 10 ? '' : 'Escriu un missatge de mínim 10 caràcters.')
  ];

  if (valids.includes(false)) {
    resultat.textContent = '';
    return;
  }

  // No s'envia a cap servidor: només mostrem la confirmació
  resultat.innerHTML = '<div class="ok-msg"></div>';
  resultat.firstChild.textContent = `Gràcies, ${nom}. Hem rebut el teu missatge i et respondrem aviat.`;
  form.reset();
});

// Esborra l'error d'un camp quan l'usuari torna a escriure
form.addEventListener('input', (e) => {
  if (e.target.name) marcar(e.target.name, '');
});
