let isAutoplayActive;
let autoplayCheckbox = null;
let githubButton = null;
const githubUrl = "https://github.com/cyberpoetry17"

const NodeId ={
 AUTOPLAY_CHECKBOX:"autoplay-checkbox",
 GITHUB_BUTTON:"github-button"
}

document.addEventListener("DOMContentLoaded", () => {
  autoplayCheckbox = document.getElementById(NodeId.AUTOPLAY_CHECKBOX);
  githubButton = document.getElementById(NodeId.GITHUB_BUTTON);

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
