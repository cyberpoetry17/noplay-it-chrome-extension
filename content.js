const buttonStatus = "autoplayButtonStatus";
const nodeName = "button";
const query = "autoplay";
const ariaChecked = "aria-checked";
let button = null;
let isAutoplayActive = null;
const autoplayStatus = null;

const documentObserver = new MutationObserver((mutations) => {
  try {
    mutations.forEach((mutation) => {
      if (
        mutation.target.nodeName.toLowerCase() === nodeName &&
        mutation.target.title.toLowerCase().includes(query)
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
    if (mutation.attributeName !== ariaChecked)
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

  // let status = chrome.storage.local.get([buttonStatus]);
  // chrome.storage.local.set({
  //   autoplayButtonStatus: !status,
  // });
};

const handleAutoplayStatusChange = (target) =>
  chrome.storage.local
    .get([buttonStatus])
    .then((result) => setAutoplayStatus(target, result.autoplayButtonStatus));

const setAutoplayStatus = (button, status) => {
  button
    .querySelector("[" + ariaChecked + "]")
    .setAttribute(ariaChecked, status);
};

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
  if (request.message === "updated" && isAutoplayActive) {
    setObserver(document, documentObserver);
    sendResponse("updated");
  }
  if (request.message === "content-status") {
    isAutoplayActive = request.isAutoplayActive;
    window.location.reload();
    sendResponse("ok");
  }
});

chrome.storage.local
  .get(["isAutoplayActive"])
  .then((result) => (isAutoplayActive = result.isAutoplayActive));

setObserver(document, documentObserver);
