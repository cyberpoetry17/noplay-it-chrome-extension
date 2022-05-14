let isAutoplayActive;
let autoplayCheckbox = null;
let githubButton = null;
const githubUrl = "https://github.com/cyberpoetry17"

document.addEventListener("DOMContentLoaded", () => {
  autoplayCheckbox = document.getElementById("autoplay-checkbox");
  githubButton = document.getElementById("github-button");

  getIsAutoplayActiveStatus();
  addAutoplayCheckboxListener();
  addFooterListener();
});

const getIsAutoplayActiveStatus = () => {
  chrome.storage.local.get(["isAutoplayActive"], (result) => {
    isAutoplayActive = result.isAutoplayActive;
    handleAutoplayChange(isAutoplayActive);
  });
};

const addAutoplayCheckboxListener = () => {
  autoplayCheckbox.addEventListener("click", () => {
    sendMessage(!isAutoplayActive, "setIsAutoplayActive");
  });
};

const addFooterListener = () => {
  githubButton.addEventListener("click", () => {
    chrome.tabs.create({'url': githubUrl, 'selected': true});
  });
};

const sendMessage = (status, message) => {
  chrome.runtime.sendMessage(
    {
      msg: message,
      data: status,
    },
    (response) => {
      isAutoplayActive = response;
      handleAutoplayChange(isAutoplayActive);
    }
  );
};

const handleAutoplayChange = (status) => {
  autoplayCheckbox.checked = status;
};
