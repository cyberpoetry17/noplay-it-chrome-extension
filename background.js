const setAutoplayStorage = (status) => {
  chrome.storage.local.set({ autoplayButtonStatus: status }, () => {
    console.log("Storage set." + status);
  });
};

const setPlaybackStorage = (status) => {
  chrome.storage.local.set({ playbackButtonStatus: status }, () => {
    console.log("Storage set." + status);
  });
};

const getAutoplayStorage = () => {
  chrome.storage.local.get(["autoplayButtonStatus"], (response) => {
   return response.autoplayButton.autoplayButton;
  });
};

chrome.runtime.onInstalled.addListener(() => {
  setAutoplayStorage(false);
  setPlaybackStorage(false);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg === "setAutoplay") {
    setAutoplayStorage(request.data);
    sendResponse(request.data);
  }
});


chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
      chrome.tabs.sendMessage( tabId, {
        message: 'updated',
        url: changeInfo.url
      })
    }
  }
);
