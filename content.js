const buttonStatus = "autoplayButtonStatus";
const query = "button[title^='Autoplay']";
const ariaChecked = "aria-checked";

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== ariaChecked)
      changeAutoplayStatus(mutation.target);
  });
});

const changeAutoplayStatus = (target) =>
  chrome.storage.local
    .get([buttonStatus])
    .then((result) => setAutoplayStatus(target, result.autoplayButtonStatus));

const setAutoplayStatus = (button, status) => {
  if (button)
    button
      .querySelector("[" + ariaChecked + "]")
      .setAttribute(ariaChecked, status);
};

const getAutoplayButton = async () => {
  let button = await document.querySelector(query);

  if (button) addOnClickListener(button);

  chrome.storage.local
    .get([buttonStatus])
    .then((result) => changeAutoplayStatus(button, result.autoplayButton));

  setObserver(button);
};

const setObserver = (element) => {
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

const addOnClickListener = (element) => element.addEventListener("click", setAutoplayStatusManually);

const setAutoplayStatusManually = () => {
  let status = chrome.storage.local.get([buttonStatus]);
  chrome.storage.local.set({ autoplayButtonStatus: !status });

  observer.disconnect();
};

//pozivanje funkcija je ovde i ovo moram smisliti bolje
setTimeout(getAutoplayButton, 6000);
