document.documentElement.classList.add('js');

const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = themeToggle.querySelector('.theme-toggle-label');
const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  const nextMode = theme === 'dark' ? 'day' : 'night';
  themeLabel.textContent = nextMode === 'day' ? 'Day mode' : 'Night mode';
  themeToggle.setAttribute('aria-label', `Switch to ${nextMode} mode`);
  themeToggle.title = `Switch to ${nextMode} mode`;
};
applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem('pengtao-li-theme', theme); } catch {}
});

const emailButton = document.querySelector('#email-reveal');
const emailAddress = document.querySelector('#email-address');
emailButton.addEventListener('click', () => {
  emailAddress.textContent = atob(emailButton.parentElement.dataset.email);
  emailAddress.hidden = false;
  emailButton.setAttribute('aria-expanded', 'true');
  emailButton.hidden = true;
  emailAddress.focus();
}, { once: true });

const nameReveal = document.querySelector('.name-reveal');
const nameTrigger = document.querySelector('.name-trigger');
let namePointerType = 'mouse';
nameTrigger.addEventListener('pointerdown', event => { namePointerType = event.pointerType; });
const resetNameReveal = () => nameReveal.classList.remove('is-pinned','is-dismissed');
nameReveal.addEventListener('pointerenter', () => nameReveal.classList.remove('is-dismissed'));
nameReveal.addEventListener('pointerleave', () => {
  if (document.activeElement !== nameTrigger) nameReveal.classList.remove('is-dismissed');
});
nameTrigger.addEventListener('focus', () => nameReveal.classList.remove('is-dismissed'));
nameTrigger.addEventListener('click', event => {
  if (event.detail !== 0 && namePointerType === 'mouse') return;
  const pinned = nameReveal.classList.toggle('is-pinned');
  nameReveal.classList.toggle('is-dismissed', !pinned);
});
nameReveal.addEventListener('focusout', event => {
  if (!nameReveal.contains(event.relatedTarget)) resetNameReveal();
});
document.addEventListener('pointerdown', event => {
  if (!nameReveal.contains(event.target)) {
    nameReveal.classList.remove('is-pinned');
    nameReveal.classList.add('is-dismissed');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    nameReveal.classList.remove('is-pinned');
    nameReveal.classList.add('is-dismissed');
  }
});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const closeMenu = () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded','false'); };
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded',String(open)); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e => {if(e.key==='Escape' && nav.classList.contains('open')) {closeMenu();menuButton.focus();}});
matchMedia('(min-width:721px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

document.querySelectorAll('.copy-citation').forEach(button => button.addEventListener('click',async()=>{
  const panel=button.closest('.citation-panel');
  const text=panel.querySelector('pre').textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent='Copied';panel.querySelector('.copy-result').textContent='Citation copied to clipboard.';
  } catch {
    const range=document.createRange();range.selectNodeContents(panel.querySelector('pre'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    button.textContent='Text selected';panel.querySelector('.copy-result').textContent='Copy is unavailable. Citation selected; press Control C or Command C to copy.';
  }
  setTimeout(()=>{button.textContent='Copy';},2500);
}));
