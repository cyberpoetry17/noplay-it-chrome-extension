let button = null;
let isAutoplayActive = null;
let autoplayStatus = false;
let isButtonClicked = false;

const Responses = {
  UPDATED: "updated",
  REDIRECTED: "redirected",
};

const RequestMessages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
};

const QueryHelpers = {
  NODE_NAME: "button",
  ARIA_CHECKED: "aria-checked",
  TITLE_QUERY: "autoplay",
};

const documentObserver = new MutationObserver((mutations) => {
  try {
    mutations.forEach((mutation) => {
      if (
        mutation.target.nodeName.toLowerCase() === QueryHelpers.NODE_NAME &&
        mutation.target.title.toLowerCase().includes(QueryHelpers.TITLE_QUERY)
      ) {
        button = mutation.target;
        throw BreakException;
      }
    });
  } catch (e) {
    documentObserver.disconnect();
    if (isAutoplayActive) {
      prepareAutoplayButton();
      handleAutoplayStatusChange();
    }
  }
});

const buttonObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== QueryHelpers.ARIA_CHECKED)
      handleAutoplayStatusChange(mutation.target);
    if (isButtonClicked) {
      setAutoplayStatus(button, true);
      buttonObserver.disconnect();
    }
  });
});

const prepareAutoplayButton = () => {
  if (button) {
    addOnClickListener();
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

const addOnClickListener = () =>
  button.addEventListener("click", handleButtonClick);

const handleButtonClick = () => (isButtonClicked = true);

const handleAutoplayStatusChange = () =>
  setAutoplayStatus(button, autoplayStatus);

const setAutoplayStatus = (button, status) => {
  button
    .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
    .setAttribute(QueryHelpers.ARIA_CHECKED, status);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === RequestMessages.UPDATED && isAutoplayActive) {
    cleanup();
    sendResponse(Responses.UPDATED);
  }

  if (request.message === RequestMessages.CONTENT_STATUS) {
    isAutoplayActive = request.isAutoplayActive;
    window.location.reload();
    sendResponse(Responses.REDIRECTED);
  }
});

const cleanup = () => {
  setObserver(document, documentObserver);
  setAutoplayButtonStatus();
  isButtonClicked = false;
};

const setAutoplayButtonStatus = () => {
  chrome.storage.local.get(["autoplayButtonStatus"]).then((response) => {
    autoplayStatus = response.autoplayButtonStatus;
  });
};

const setIsAutoplayActive = () => {
  chrome.storage.local
    .get(["isAutoplayActive"])
    .then((result) => (isAutoplayActive = result.isAutoplayActive));
};

setAutoplayButtonStatus();
setIsAutoplayActive();
setObserver(document, documentObserver);
