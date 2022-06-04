let button = null;
let isAutoplayActive = null;
let isAutoplayStatusSet = false;
let autoplayStatus = false;
let btnClickedByUser = false;

let currentURL = "";

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

const documentObserver = new MutationObserver((mutations, observer) => {
  for (let i = 0; i < mutations.length; i++) {
    if (
      isNodeNameEqual(mutations[i].target.nodeName) &&
      hasTitle(mutations[i].target.title.toLowerCase())
    ) {
      if (button !== null)
      {
        observer.disconnect;
        break;
      }

      setDefaultAutoplayStatus(mutations[i].target);

      if (isAutoplayActive) {
        handleElement();
      }
      observer.disconnect();
      break;
    }
  }
});

const isNodeNameEqual = (target) =>
  target.toLowerCase() === QueryHelpers.NODE_NAME;

const hasTitle = (target) => target.includes(QueryHelpers.TITLE_QUERY);

const setObserver = (element, observer) => {
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

const handleElement = () => {
  if (isAutoplayStatus()) handleAutoplayStatusChange();
};

const setDefaultAutoplayStatus = (target) => {
  button = target;
  button.addEventListener("click", userButtonClick)
  autoplayStatus = button
    .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
    .getAttribute("aria-checked");

  isAutoplayStatusSet = true;
};

const userButtonClick = () => 
  btnClickedByUser = true



const isAutoplayStatus = () => (autoplayStatus === "true" ? true : false);

const handleAutoplayStatusChange = () => {
  button.click();
  btnClickedByUser = false;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.message === RequestMessages.UPDATED &&
    (currentURL === "" || !request.url.startsWith(currentURL))
  ) {
    currentURL = request.url;
    sendResponse(Responses.UPDATED);
    if (isAutoplayActive) cleanup();
  }

  if (
    request.message === RequestMessages.UPDATED && (request.url.startsWith(currentURL) || request.url === currentURL))
    {
      if (isAutoplayActive && !btnClickedByUser && button !== null) {
        autoplayStatus = button
          .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
          .getAttribute("aria-checked");

        handleElement();
        sendResponse(Responses.UPDATED);
      }
    }

  if (request.message === RequestMessages.CONTENT_STATUS) {
    isAutoplayActive = request.isAutoplayActive;

    resetButton();
    sendResponse(Responses.REDIRECTED);
    window.location.reload();
  }
});

const cleanup = () => {
  isAutoplayStatusSet = false;
  button = null;
  setObserver(document, documentObserver);
};

const resetButton = () => {
  if (!isAutoplayActive && isAutoplayStatus()) button.click();
};

const setIsAutoplayActive = () => {
  chrome.storage.local
    .get(["isAutoplayActive"])
    .then((result) => (isAutoplayActive = result.isAutoplayActive));
};

setIsAutoplayActive();
setObserver(document, documentObserver);

