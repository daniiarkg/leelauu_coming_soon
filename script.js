const translations = {
  en: {
    documentTitle: "Leelauu | Coming Soon",
    description: "Leelauu is launching in early Q3 2026. Join the waitlist for launch updates.",
    launchPill: "Early Q3 2026",
    heroTitleLine1: "Coming",
    heroTitleLine2: "Soon",
    heroSubtitle: "Next gen parental control",
    signupTitle: "Join the launch list",
    intro: "Leave your name, email, and phone, and we will send the first update when Leelauu opens.",
    botField: "Leave this field empty",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+372 5555 1234",
    submitCta: "Notify me",
    launchStatus: "Launching at the beginning of Q3 2026.",
    sendingStatus: "Sending...",
    successStatus: "You are on the list. We will keep you posted.",
    errorStatus: "Could not send yet. Please try again.",
    footerCopyright: "© 2026 Leelauu Software OÜ. All rights reserved.",
    formSubject: "New Leelauu coming soon signup",
  },
  ru: {
    documentTitle: "Leelauu | Скоро запуск",
    description: "Leelauu запускается в начале Q3 2026. Оставьте контакты, чтобы получить обновления.",
    launchPill: "Старт в начале Q3 2026",
    heroTitleLine1: "Скоро",
    heroTitleLine2: "запуск",
    heroSubtitle: "Родительский контроль нового поколения",
    signupTitle: "Узнать о запуске",
    intro: "Оставьте имя, email и телефон, и мы напишем, когда Leelauu откроется.",
    botField: "Оставьте это поле пустым",
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    phoneLabel: "Телефон",
    phonePlaceholder: "+372 5555 1234",
    submitCta: "Уведомить меня",
    launchStatus: "Запуск в начале Q3 2026.",
    sendingStatus: "Отправляем...",
    successStatus: "Вы в списке. Мы пришлем обновления.",
    errorStatus: "Пока не удалось отправить. Попробуйте еще раз.",
    footerCopyright: "© 2026 Leelauu Software OÜ. Все права защищены.",
    formSubject: "New Leelauu coming soon signup",
  },
};

const waitlistForm = document.querySelector("[data-waitlist-form]");
const formStatus = document.querySelector("[data-form-status]");
const languageButtons = document.querySelectorAll("[data-lang-option]");
const languageField = document.querySelector("[data-language-field]");
const subjectField = document.querySelector("input[name='subject']");
const descriptionMeta = document.querySelector("meta[name='description']");

let currentLanguage = getInitialLanguage();
let statusKey = "launchStatus";

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem("leelauu-language");

  if (savedLanguage && translations[savedLanguage]) {
    return savedLanguage;
  }

  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function translate(key) {
  return translations[currentLanguage][key] || translations.en[key] || "";
}

function setStatus(key, state = "") {
  statusKey = key;

  if (!formStatus) {
    return;
  }

  formStatus.dataset.state = state;
  formStatus.textContent = translate(key);
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "en";
  localStorage.setItem("leelauu-language", currentLanguage);
  document.documentElement.lang = currentLanguage;
  document.title = translate("documentTitle");

  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", translate("description"));
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = translate(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    element.setAttribute("placeholder", translate(key));
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.langOption === currentLanguage;
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (languageField) {
    languageField.value = currentLanguage;
  }

  if (subjectField) {
    subjectField.value = translate("formSubject");
  }

  setStatus(statusKey, formStatus?.dataset.state || "");
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langOption);
  });
});

applyLanguage(currentLanguage);

if (waitlistForm && formStatus) {
  waitlistForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = waitlistForm.querySelector("button[type='submit']");
    const formData = new FormData(waitlistForm);

    if (formData.get("botcheck")) {
      return;
    }

    submitButton.disabled = true;
    setStatus("sendingStatus");

    try {
      const response = await fetch(waitlistForm.action, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      waitlistForm.reset();
      if (languageField) {
        languageField.value = currentLanguage;
      }
      if (subjectField) {
        subjectField.value = translate("formSubject");
      }
      setStatus("successStatus", "success");
    } catch (error) {
      setStatus("errorStatus", "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}
