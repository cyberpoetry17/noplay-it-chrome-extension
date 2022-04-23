let autoplayStatus;
const enabledAutoplayButton = "enabledAutoplayButton";
const disabledAutoplayButton = "disabledAutoplayButton";

const removeClass = (element, className) => {
  if (element.classList.contains(className))
    element.classList.remove(className);
};

const setAutoplayButtonStatus = (status) => {
  let element = document.getElementById("disableAutoplayButton");
  if (!status) {
    removeClass(element,disabledAutoplayButton);
    element.classList.add(enabledAutoplayButton);

  } else {
    removeClass(element,enabledAutoplayButton);
    element.classList.add(disabledAutoplayButton);
  }
};

const sendMessage = (status, message) => {
  chrome.runtime.sendMessage(
    {
      msg: message,
      data: status,
    },
    (response) => {
      autoplayStatus = response;
      setAutoplayButtonStatus(autoplayStatus);
    }
  );
};

chrome.storage.local.get(["autoplayButtonStatus"], (result) => {
  if (chrome.runtime.lastError) {
    console.log("Error getting");
  }
  autoplayStatus = result.autoplayButton;
  setAutoplayButtonStatus(autoplayStatus);
});

document.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("disableAutoplayButton");
  button.addEventListener("click", () => {
    setAutoplayButtonStatus(autoplayStatus);
    sendMessage(!autoplayStatus, "setAutoplay");
   // sendMessageToContentScript();
  });
});
