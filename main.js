const languageToggle = document.querySelector('.language-toggle');
const copyButton = document.querySelector('#copy-email');
const email = document.querySelector('#email');
const copyStatus = document.querySelector('#copy-status');
const translations = Array.from(document.querySelectorAll('[data-en]'), (element) => ({
  element,
  zh: element.textContent,
  en: element.dataset.en,
}));

const languageKey = 'portfolio-language';
const copyMessages = {
  zh: { copied: '已複製。', selected: '已選取，可手動複製。', manual: '請手動選取並複製。' },
  en: { copied: 'Copied.', selected: 'Selected for manual copying.', manual: 'Select the email to copy it manually.' },
};
let language = 'zh';
let copyResult = '';

function updateCopyStatus() {
  copyStatus.textContent = copyResult ? copyMessages[language][copyResult] : '';
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  const isEnglish = language === 'en';
  document.documentElement.lang = isEnglish ? 'en' : 'zh-Hant';
  for (const translation of translations) {
    translation.element.textContent = translation[language];
  }
  languageToggle.textContent = isEnglish ? '中文' : 'EN';
  languageToggle.lang = isEnglish ? 'zh-Hant' : 'en';
  languageToggle.setAttribute('aria-label', isEnglish ? '切換為中文' : 'Switch to English');
  updateCopyStatus();
}

try {
  if (localStorage.getItem(languageKey) === 'en') language = 'en';
} catch {
  // Storage may be unavailable for local files or private browsing.
}
setLanguage(language);

languageToggle.addEventListener('click', () => {
  setLanguage(language === 'en' ? 'zh' : 'en');
  try {
    localStorage.setItem(languageKey, language);
  } catch {
    // The current page still uses the selected language.
  }
});

copyButton.addEventListener('click', async () => {
  copyStatus.textContent = '';
  try {
    await navigator.clipboard.writeText(email.textContent.trim());
    copyResult = 'copied';
  } catch {
    const selection = window.getSelection();
    copyResult = 'manual';
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(email);
      selection.removeAllRanges();
      selection.addRange(range);
      copyResult = 'selected';
    }
  }
  updateCopyStatus();
});
