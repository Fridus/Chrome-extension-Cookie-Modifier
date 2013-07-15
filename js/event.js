
chrome.tabs.onActivated.addListener(function(activeInfo) {

  updateCookiesFiltered(function(cookies){
    chrome.browserAction.setBadgeText({text: objectSize(cookies).toString() });
  });

});