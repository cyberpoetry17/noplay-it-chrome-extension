(() => {
  let button = undefined;

  const QueryHelpers = {
    NODE_NAME: "button",
    NODE_NAME_DIV: "div",
    ARIA_CHECKED: "aria-checked",
    TITLE_QUERY: "autoplay",
  };

  const isNodeNameEqual = (target) =>
    target.toLowerCase() === QueryHelpers.NODE_NAME;

  const hasTitle = (target) => target.includes(QueryHelpers.TITLE_QUERY);

  const endInterval = (intervalID) => {
    clearInterval(intervalID);
    console.log("interval ended");
  };

  const documentObserver = new MutationObserver((mutations, observer) => {
    for (let i = 0; i < mutations.length; i++) {
      if (
        isNodeNameEqual(mutations[i].target.nodeName) &&
        hasTitle(mutations[i].target.title.toLowerCase())
      ) {
        button = mutations[i].target;
        observer.disconnect();

        window.myInterval = setInterval(handleButtonClick, 2000);
        return;
      }
    }
  });

  const handleButtonClick = () => {
    if (getAutoplayStatus() == "true") {
      button.click();
      clearInterval(window.myInterval)
      console.log("button click");
    }
  };

  const getAutoplayStatus = () =>
    button
      .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
      .getAttribute("aria-checked");

  const setObserver = (element, observer) => {
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  };

  setObserver(document, documentObserver);
})();
