function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity 0.3s ease",
  });

  document.body.appendChild(toast);
  requestAnimationFrame(() => (toast.style.opacity = 1));

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}

function getBanList(callback) {
  const keyToGet = "youtubeKeywords";

  chrome.storage.sync.get({ [keyToGet]: "" }, (result) => {
    const keywordsString = result[keyToGet];

    if (keywordsString) {
      const keywordsArray = keywordsString
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      callback(keywordsArray);
    } else {
      callback([]);
    }
  });
}

// Check if a text includes any word from a list
function isIncludeWord(text, words) {
  for (const word of words) {
    if (text.toLowerCase().includes(word.toLowerCase())) {
      return [true, word];
    }
  }
  return [false, ""];
}

// Wait for an element to appear in the DOM
function waitForElement(selector, callback) {
  const el = document.querySelector(selector);
  if (el) return callback(el);

  const observer = new MutationObserver(() => {
    const el = document.querySelector(selector);
    if (el) {
      observer.disconnect();
      callback(el);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function hide(range, str) {
  let items = document.querySelectorAll(str);
  items = Array.from(items);

  const sliced = items.slice(Math.max(0, range[0]), range[1]);

  let hideCount = 0;
  const toRemove = [];

  getBanList((banList) => {
    // Find items to remove
    banWord = "";
    for (const item of sliced) {
      const [matched, word] = isIncludeWord(item.innerText, banList);

      if (matched) {
        banWord = word;
        hideCount++;
        console.log("Xoá video:", item.innerText);
        toRemove.push(item);
      }
    }

    // Remove items
    for (const el of toRemove) {
      el.textContent = "Content is hidden because it contains keywords " + banWord;
      el.style.textAlign = "center";
      el.style.fontSize = "18px";
      el.style.color = "#ffffffff";
    }
    showToast("Hide " + hideCount + " video");
    return hideCount;
  });
  return 0;
}

function hideVideo(str) {
  waitForElement("#contents", (content) => {
    let slidingWindow = [0, 0];

    length = document.querySelectorAll(str).length;

    slidingWindow[0] = slidingWindow[1];
    slidingWindow[1] += length;
    hideCount = hide(slidingWindow, str);
    slidingWindow[1] -= hideCount;

    console.log("Sliding window updated:", slidingWindow, " hide ", hideCount);

    window.addEventListener("scroll", () => {
      length = document.querySelectorAll(str).length;

      if (length > slidingWindow[1]) {
        slidingWindow[0] = slidingWindow[1];
        slidingWindow[1] += length;
        hideCount = hide(slidingWindow, str);
        slidingWindow[1] -= hideCount;
        console.log("Sliding window updated:", slidingWindow, " hide ", hideCount);
      }
    });
  });
}

mainVideoJSPath = "#contents > ytd-rich-item-renderer";
searchVideoJSPath = "#contents > ytd-video-renderer";

hideVideo(mainVideoJSPath);
hideVideo(searchVideoJSPath);
