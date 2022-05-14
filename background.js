const urlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=))/;

chrome.runtime.onInstalled.addListener(() => {
  setAutoplayStorage(false);
  setPlaybackStorage(false);
  setIsAutoplayActive(true);
  setIsPlaybackActive(false);
});


const setAutoplayStorage = (status) => {
  chrome.storage.local.set({ autoplayButtonStatus: status });
};

const setPlaybackStorage = (status) => {
  chrome.storage.local.set({ playbackButtonStatus: status });
};

const setIsAutoplayActive = (status) => {
  chrome.storage.local.set({ isAutoplayActive: status });
};

const setIsPlaybackActive = (status) => {
  chrome.storage.local.set({ isPlaybackActive: status });
};

chrome.runtime.onMessage.addListener((request,sender, sendResponse) => {
  if (request.msg === "setIsAutoplayActive") {
    sendMessageToTabs("content-status", request.data);
    setIsAutoplayActive(request.data);
    sendResponse(request.data);
  }
});

const sendMessageToTabs = (message, status) => {
  chrome.tabs.query({}, (tabs) =>
    tabs.forEach((tab) => {
      if (checkUrl(tab.url))
        chrome.tabs.sendMessage(tab.id, {
          message: message,
          isAutoplayActive: status,
        });
    })
  );
};

const checkUrl = (url) => url.match(urlPattern);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && checkUrl(changeInfo.url)) {
    chrome.tabs.sendMessage(tabId, {
      message: "updated",
      url: changeInfo.url,
    });
  }
});
