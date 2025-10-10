document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save-btn");
  const statusDiv = document.getElementById("status");

  // Toogles
  const youtubeToggle = document.getElementById("youtube-toggle");
  const tiktokToggle = document.getElementById("tiktok-toggle");
  const xToggle = document.getElementById("x-toggle");

  // Keywords
  const youtubeKeywords = document.getElementById("youtube-keywords");
  const tiktokKeywords = document.getElementById("tiktok-keywords");
  const xKeywords = document.getElementById("x-keywords");

  // Save
  const saveOptions = () => {
    const isYoutubeToggle_Enabled = youtubeToggle.checked;
    const isTiktokToggle_Enabled = tiktokToggle.checked;
    const isXToggle_Enabled = xToggle.checked;

    const valueYoutubeKeywords = youtubeKeywords.value;
    const valueTiktokKeywords = tiktokKeywords.value;
    const valueXKeywords = xKeywords.value;

    chrome.storage.sync.set(
      {
        youtube: isYoutubeToggle_Enabled,
        youtubeKeywords: valueYoutubeKeywords,

        tiktok: isTiktokToggle_Enabled,
        tiktokKeywords: valueTiktokKeywords,

        x: isXToggle_Enabled,
        xKeywords: valueXKeywords,
      },
      () => {
        statusDiv.textContent = "Saved";
        setTimeout(() => {
          statusDiv.textContent = "";
        }, 2000);
      }
    );
  };

  const restoreOptions = () => {

    chrome.storage.sync.get(
      {
        youtube: false,
        youtubeKeywords: "",
        tiktok: false,
        tiktokKeywords: "", 
        x: false,
        xKeywords: "",
      },
      (items) => {

        // Update YouTube elements
        document.getElementById("youtube-toggle").checked = items.youtube;
        document.getElementById("youtube-keywords").value = items.youtubeKeywords;

        // Update TikTok elements
        document.getElementById("tiktok-toggle").checked = items.tiktok;
        document.getElementById("tiktok-keywords").value = items.tiktokKeywords;

        // Update X (Twitter) elements
        document.getElementById("x-toggle").checked = items.x;
        document.getElementById("x-keywords").value = items.xKeywords;
      }
    );
  };

  restoreOptions();

  saveButton.addEventListener("click", saveOptions);
});
