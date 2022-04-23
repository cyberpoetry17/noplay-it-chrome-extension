const buttonStatus = "autoplayButtonStatus";
const nodeName = "BUTTON";
const query = "autoplay";
const ariaChecked = "aria-checked";
let button = null;

const documentObserver = new MutationObserver((mutations) => {
  try {
    mutations.forEach((mutation) => {
      if (
        mutation.target.nodeName === nodeName &&
        mutation.target.title.toLowerCase().includes(query)
      ) {
        button = mutation.target;
        throw BreakException;
      }
    });
  } catch (e) {
    documentObserver.disconnect();
    prepareAutoplayButton();
    changeAutoplayStatus(button);
  }
});

const buttonObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== ariaChecked)
      changeAutoplayStatus(mutation.target);
  });
});

const prepareAutoplayButton = () => {
  if (button) {
    addOnClickListener(button);
    setObserver(button, buttonObserver);
  }
};

const setObserver = (element, observer) => {
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

const addOnClickListener = (element) =>
  element.addEventListener("click", setAutoplayStatusManually);

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

const setAutoplayStatusManually = () => {
  buttonObserver.disconnect();
  chrome.storage.local.set({
    autoplayButtonStatus: !chrome.storage.local.get([buttonStatus]),
  });
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === 'updated') {
      setObserver(document, documentObserver);
      sendResponse("updated")
    }
});

setObserver(document, documentObserver);

    

 


