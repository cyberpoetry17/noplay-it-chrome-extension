let button = null;
let isAutoplayActive = null;
let isAutoplayStatusSet = false;
let autoplayStatus = false;

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

      if(!isAutoplayStatusSet){
        setDefaultAutoplayStatus(mutations[i].target);}
  
      if (isAutoplayActive){
        handleElement(mutations[i].target);
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

const handleElement = (target) => {
  

  if (isAutoplayStatus()) handleAutoplayStatusChange();
};

const setDefaultAutoplayStatus = (target) => {
  button = target; 
  autoplayStatus = button
    .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
    .getAttribute("aria-checked");

  isAutoplayStatusSet = true;
};

const isAutoplayStatus = () => (autoplayStatus === "true" ? true : false);

const handleAutoplayStatusChange = () => button.click();




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === RequestMessages.UPDATED) {
    console.log(autoplayStatus,"autoplay status")
    sendResponse(Responses.UPDATED);
    if (isAutoplayActive) cleanup();
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
