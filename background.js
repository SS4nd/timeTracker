function extractHostname(url) {
  let hostname;
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }
  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];
  return hostname;
}

let currentTabHostname;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  const currentTabId = activeInfo.tabId;
  chrome.tabs.get(currentTabId, function(tab) {
    currentTabHostname = extractHostname(tab.url);
    chrome.storage.local.get(currentTabHostname, function(data) {
      let seconds = data[currentTabHostname];
      if (seconds !== undefined) {
        chrome.action.setBadgeText({ text: String(seconds) });
      }
    });
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.active && changeInfo.url) {
    currentTabHostname = extractHostname(tab.url);
    chrome.storage.local.get(currentTabHostname, function(data) {
      let seconds = data[currentTabHostname];
      if (seconds !== undefined) {
        chrome.action.setBadgeText({ text: String(seconds) });
      }
    });
  }
});

setInterval(function() {
  if (currentTabHostname !== undefined) {
    chrome.storage.local.get([currentTabHostname, "totalTimer"], function(data) {
      let newData = {};
      let TSeconds = data["totalTimer"] || 0;
      let seconds = data[currentTabHostname] || 0;
      chrome.action.setBadgeText({ text: String(seconds) });
      seconds++; // Add 1 second
      newData[currentTabHostname] = seconds;
      TSeconds++;
      newData["totalTimer"] = TSeconds;
      chrome.storage.local.set(newData, function() {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
      });
    });
  }
}, 1000);