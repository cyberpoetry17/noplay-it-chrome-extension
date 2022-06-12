(() => {
  // Code that runs in your function
  let button = undefined;

  const QueryHelpers = {
  NODE_NAME: "button",
  ARIA_CHECKED: "aria-checked",
  TITLE_QUERY: "autoplay",
  };

  // const tryGetButton = () => {
  //     button = document.querySelector(`[title*="${QueryHelpers.TITLE_QUERY}"`);
  // }

  const isNodeNameEqual = (target) =>
  target.toLowerCase() === QueryHelpers.NODE_NAME;

  const hasTitle = (target) => target.includes(QueryHelpers.TITLE_QUERY);



  const documentObserver = new MutationObserver((mutations, observer) => {
  for (let i = 0; i < mutations.length; i++) {
      if (
      isNodeNameEqual(mutations[i].target.nodeName) &&
      hasTitle(mutations[i].target.title.toLowerCase())
      ) {
          console.log("found");
          button = mutations[i].target;
          console.log(button);
          observer.disconnect();

          autoplayStatus = button
              .querySelector("[" + QueryHelpers.ARIA_CHECKED + "]")
              .getAttribute("aria-checked");
          
          if(autoplayStatus == "true")
          {
              setTimeout(() => button.click(), 500);
          }
          return;
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

  setObserver(document, documentObserver);
})();