(() => {
  let button = undefined;

  const QueryHelpers = {
    NODE_NAME: "button",
    ARIA_CHECKED: "aria-checked",
    TITLE_QUERY: "autoplay",
  };

  const isNodeNameEqual = (target) =>
    target.toLowerCase() === QueryHelpers.NODE_NAME;

  const hasTitle = (target) => target.includes(QueryHelpers.TITLE_QUERY);

  const defineMutations = (mutations,observer) => {
    for (let i = 0; i < mutations.length; i++) {
      if (
        isNodeNameEqual(mutations[i].target.nodeName) &&
        hasTitle(mutations[i].target.title.toLowerCase())
      ) {

        button = mutations[i].target;
        observer.disconnect();
       

        autoplayStatus = button
          .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
          .getAttribute("aria-checked");

        if (autoplayStatus == "true") setTimeout(() => button.click(), 2000);
        
        return;
      }
    }
  }

  const documentObserver = new MutationObserver(defineMutations(mutations,observer))

  const setObserver = (element, observer) => {
    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  };

  setObserver(document, documentObserver);
})();
