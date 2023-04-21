document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const currentTabUrl = new URL(currentTab.url);
    const hostname = currentTabUrl.hostname;
    if (hostname !== "") {
      chrome.storage.local.get([hostname], function(result) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (Object.keys(result).length === 0) {
          const value = 0;
          const data = {};
          data[hostname] = value;
          chrome.storage.local.set(data, function() {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            console.log(data);
          });
        } else {
          console.log("Data already exists for " + hostname);
        }
      });
    }
  });

  document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchQuery = event.target.value;
    searchList(searchQuery);
  });

  chrome.storage.local.get(null, function(result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = '';
    for (const key in result) {
      const totalSeconds = result[key];
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (key == "totalTimer"){
        document.getElementById("totalT").innerHTML = "Total Time: " + hours + "h " + minutes + "m " + seconds + "s";
      }
      const listItem = document.createElement('li');
      listItem.textContent = key + ': ' + hours + "h " + minutes + "m " + seconds + "s";
      websiteList.appendChild(listItem);
    }
  });
});

function searchList(searchQuery) {
  chrome.storage.local.get(null, function(result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      return;
    }
    const websiteList = document.getElementById('websiteList');
    websiteList.innerHTML = '';

    for (const key in result) {
      const totalSeconds = result[key];
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (key == "totalTimer") {
        document.getElementById("totalT").innerHTML = "Total Time: " + hours + " h " + minutes + " m " + seconds + " s";
      }
      if (key.toLowerCase().includes(searchQuery.toLowerCase()) || result[key].toString().toLowerCase().includes(searchQuery.toLowerCase())) {
        const listItem = document.createElement('li');
        listItem.textContent = key + ': ' + hours + " h " + minutes + " m " + seconds + " s";
        websiteList.appendChild(listItem);
      }
    }
  });
}