const Messages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
  SET_IS_AUTOPLAY_ACTIVE: "set-is-autoplay-active",
  REDIRECTED: "redirected",
};

let isAutoplayActive = true;

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
  chrome.storage.local.set({ isAutoplayActive: status });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === Messages.SET_IS_AUTOPLAY_ACTIVE) {
    setIsAutoplayActive(request.data);
    isAutoplayActive = request.data;
    if (isAutoplayActive) reloadExsitingTabs();
    sendResponse(request.data);
  }
});

const isUrlValid = (url, urlPattern) => {
  matches = url.match(urlPattern);
  if (matches !== null && matches.length > 0) return true;

  return false;
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(isAutoplayActive,"is autoplay active??")
  if (!changeInfo.status) return;

  let url = "";
  if (changeInfo.status.toLowerCase() == "complete") {
    if (!changeInfo.url) {
      url = tab.url;
    } else {
      url = changeInfo.url;
    }

    if (!url) {
      return;
    }
  }
  if (!isAutoplayActive) {
    console.log(isAutoplayActive,"isAUtoplayActive u tabs")
    return};
  if (
    changeInfo.status.toLowerCase() == "complete" &&
    isUrlValid(url, urlPattern)
  )
    injectScriptToTabs(tabId);
});

const injectScriptToTabs = (tabId) =>
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
