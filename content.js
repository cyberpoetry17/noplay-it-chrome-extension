let button = null;
let isAutoplayActive = null;
const autoplayStatus = chrome.storage.local.get(["autoplayButtonStatus"]);

const Responses = {
  UPDATED: 'updated',
  REDIRECTED: 'redirected',
};

const RequestMessages ={
 UPDATED:"updated",
 CONTENT_STATUS:"content-status"
}

const QueryHelpers ={
  NODE_NAME:"button",
  ARIA_CHECKED:"aria-checked",
  TITLE_QUERY:"autoplay"
 }

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
      handleAutoplayStatusChange(button);
    }
  }
});

const buttonObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName !== QueryHelpers.ARIA_CHECKED)
      handleAutoplayStatusChange(mutation.target);
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
  element.addEventListener("click", cleanup);

const cleanup = () => {
  buttonObserver.disconnect();

  chrome.storage.local.set({
    autoplayButtonStatus: !autoplayStatus,
  });
};

const handleAutoplayStatusChange = (target) =>
  setAutoplayStatus(target,autoplayStatus);

const setAutoplayStatus = (button, status) => {
  button
    .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
    .setAttribute(QueryHelpers.ARIA_CHECKED, status);
};

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
  if (request.message === RequestMessages.UPDATED && isAutoplayActive) {
    setObserver(document, documentObserver);
    sendResponse(Responses.UPDATED);
  }

  if (request.message === RequestMessages.CONTENT_STATUS) {
    isAutoplayActive = request.isAutoplayActive;
    window.location.reload();
    sendResponse(Responses.REDIRECTED);
  }
});

chrome.storage.local
  .get(["isAutoplayActive"])
  .then((result) => (isAutoplayActive = result.isAutoplayActive));

setObserver(document, documentObserver);
