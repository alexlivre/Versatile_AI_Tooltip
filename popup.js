document.addEventListener('DOMContentLoaded', async () => {
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  const enabledCheckbox = document.getElementById('enabledCheckbox');
  enabledCheckbox.checked = enabled;

  enabledCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: enabledCheckbox.checked });
  });

  document.getElementById('settingsButton').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
