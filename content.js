let button = null;
let isAutoplayActive = null;
let isAutoplayStatusSet = false;
let autoplayStatus = false;


const Responses = {
  UPDATED: "updated",
  REDIRECTED: "redirected",
};

const RequestMessages = {
  UPDATED: "updated",
  CONTENT_STATUS: "content-status",
};

const QueryHelpers = {
  NODE_NAME: "button",
  ARIA_CHECKED: "aria-checked",
  TITLE_QUERY: "autoplay",
};

// const documentObserver = new MutationObserver((mutations) => {
//   try {
//     mutations.forEach((mutation) => {
//       if (
//         mutation.target.nodeName.toLowerCase() === QueryHelpers.NODE_NAME &&
//         mutation.target.title.toLowerCase().includes(QueryHelpers.TITLE_QUERY)
//       ) {
//         console.log(mutation)
//         button = mutation.target;
//         documentObserver.disconnect();
//         throw BreakException;
//       }
//     });
//   } catch (e) {
//     if (isAutoplayActive) {
       
//          handleAutoplayStatusChange()
//     }
    
//   }
// });

const documentObserver = new MutationObserver((mutations,observer) => {
  for (let i = 0; i < mutations.length; i++){
  
  if (
    mutations[i].target.nodeName.toLowerCase() === QueryHelpers.NODE_NAME &&
    mutations[i].target.title.toLowerCase().includes(QueryHelpers.TITLE_QUERY)
  ) {
    if(isAutoplayActive){
      button = mutations[i].target;
      setDefaultAutoplayStatus();
    if(autoplayStatus === "true"){
      console.log("cmon")
    handleAutoplayStatusChange()}
    console.log(button)}
    observer.disconnect();
   break;
  }
 }  
});

const setObserver = (element, observer) => {
  observer.observe(element, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

const setDefaultAutoplayStatus = () =>{
  if(!isAutoplayStatusSet){
    console.log('*')
    console.log(typeof button.querySelector("[" + QueryHelpers.ARIA_CHECKED + "]").getAttribute("aria-checked"))
    autoplayStatus =  button.querySelector("[" + QueryHelpers.ARIA_CHECKED + "]").getAttribute("aria-checked");
    isAutoplayStatusSet = true;
  }
}

const handleAutoplayStatusChange = () =>{
  console.log("change")
  button.click();}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === RequestMessages.UPDATED && isAutoplayActive) {
    cleanup();
    sendResponse(Responses.UPDATED);
  }

  if (request.message === RequestMessages.CONTENT_STATUS) {
    isAutoplayActive = request.isAutoplayActive;
    resetButton();
    window.location.reload();
    sendResponse(Responses.REDIRECTED);
  }
});

const cleanup = () => {
  isAutoplayStatusSet = false;
  setObserver(document, documentObserver);
};

const resetButton = () =>{
  if(!isAutoplayActive && autoplayStatus ==="false"){
    console.log("is it reseting???")
   button.click();}
}

const setIsAutoplayActive = () => {
  chrome.storage.local
    .get(["isAutoplayActive"])
    .then((result) => (isAutoplayActive = result.isAutoplayActive));
};

setIsAutoplayActive();
setObserver(document, documentObserver);
