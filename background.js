const Messages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
  SET_IS_AUTOPLAY_ACTIVE: "set-is-autoplay-active",
  REDIRECTED: "redirected",
};

const urlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=))/;

chrome.runtime.onInstalled.addListener(() => {
  setAutoplayStorage(false);
  setIsAutoplayActive(true);
});

const setAutoplayStorage = (status) => {
  chrome.storage.local.set({ autoplayButtonStatus: status });
};

const setIsAutoplayActive = (status) => {
  chrome.storage.local.set({ isAutoplayActive: status });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === Messages.SET_IS_AUTOPLAY_ACTIVE) {
    sendMessageToTabs(Messages.CONTENT_STATUS, request.data);
    setIsAutoplayActive(request.data);
    sendResponse(request.data);
  }
});

const sendMessageToTabs = (message, status) => {
  chrome.tabs.query({}, (tabs) =>
    tabs.forEach((tab) => {
      if (isUrlValid(tab.url))
        chrome.tabs.sendMessage(tab.id, {
          message: message,
          isAutoplayActive: status,
        });
    })
  );
};

const isUrlValid = (url) => url.match(urlPattern);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isUrlValid(changeInfo.url)) {
    chrome.tabs.sendMessage(tabId, {
      message: Messages.UPDATED,
      url: changeInfo.url,
    });
  }
});
