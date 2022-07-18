const Messages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
  SET_IS_AUTOPLAY_ACTIVE: "set-is-autoplay-active",
  REDIRECTED: "redirected",
};

let isAutoplayActive;
chrome.storage.local.get('isAutoplayActive', (result) => {
  if (typeof result.isAutoplayActive === 'undefined') {
    setIsAutoplayActive(true);
  } else {
    if(!result.isAutoplayActive) setIsAutoplayActive(false);
    if(result.isAutoplayActive) setIsAutoplayActive(true);
  }
});


const urlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=))/;

const shortUrlPattern =
  /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))/;

chrome.runtime.onInstalled.addListener(() => {
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

const setIsAutoplayActive = (status) =>
  chrome.storage.local.set({ isAutoplayActive: status }, () => {
    isAutoplayActive = status;
  });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === Messages.SET_IS_AUTOPLAY_ACTIVE) {
    setIsAutoplayActive(request.data);
    reloadExsitingTabs();
    sendResponse(request.data);
  }
});

const isUrlValid = (url, urlPattern) => {
  matches = url.match(urlPattern);
  if (matches !== null && matches.length > 0) return true;

  return false;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.status) return;
  let url = "";

  if (changeInfo.status.toLowerCase() !== "complete") return;
  if (!changeInfo.url) url = tab.url;
  else url = changeInfo.url;

  if (!url) return;

  if (!isAutoplayActive) return;
  
  if (
    changeInfo.status.toLowerCase() == "complete" &&
    isUrlValid(url, urlPattern)
  ) {

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  }
});
