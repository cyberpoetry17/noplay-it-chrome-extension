const Messages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
  SET_IS_AUTOPLAY_ACTIVE: "set-is-autoplay-active",
  REDIRECTED: "redirected",
};

const urlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=))/;

const shortUrlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))/;

chrome.runtime.onInstalled.addListener(() => {
  setAutoplayStorage(false);
  setIsAutoplayActive(true);
  reloadExsitingTabs();
});

const reloadExsitingTabs = () => {
  chrome.tabs.query({}, (tabs) =>
    tabs.forEach((tab) => {
      if (
        isUrlValid(tab.url, urlPattern) ||
        isUrlValid(tab.url, shortUrlPattern)
      )
        chrome.tabs.reload(tab.id);
    })
  );
};

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
      if (isUrlValid(tab.url, urlPattern))
        chrome.tabs.sendMessage(tab.id, {
          message: message,
          isAutoplayActive: status,
        });
    })
  );
};

const isUrlValid = (url, urlPattern) => url.match(urlPattern);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && isUrlValid(changeInfo.url, urlPattern)) {
    chrome.tabs.sendMessage(tabId, {
      message: Messages.UPDATED,
      url: changeInfo.url,
    }, (result) => handleError(result))}
});

const handleError = (result) =>{
  if (chrome.runtime.lastError) {
    console.log(result)
  } 
}