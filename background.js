// Use chrome.runtime.onInstalled to set up the context menu.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'process-text-context-menu',
    title: 'Run Versatile AI',
    contexts: ['selection']
  });
});

// Listen for messages from content scripts or popup.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'processText' || request.type === 'processTextContextMenu') {
    // Use an async function to handle the promise-based API calls.
    (async () => {
      try {
        const { apiKey, model, customPrompt } = await chrome.storage.sync.get({
          apiKey: '',
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          customPrompt: 'As a specialized assistant in summarizing texts in {language}, always create a summary in {language}, in plain text, without using any markup language (such as Markdown or HTML), of the content provided below, regardless of the original language of the text. The summary must necessarily be shorter than the original text. Maintain the central ideas, avoid repetitions, and structure the summary in short and objective paragraphs, clearly and well organized. Never ask questions to the user at any stage of the process. Prioritize clarity and fidelity to the original context, omitting irrelevant details. Rigorously follow the logical structure of the provided text. The text to be summarized is: {text}'
        });

        if (!apiKey) {
          throw new Error('API key not configured. Set it in the options.');
        }

        // Get user's language
        const userLanguage = chrome.i18n.getUILanguage();

        let finalPrompt = customPrompt.replace('{text}', request.text);
        finalPrompt = finalPrompt.replace('{language}', userLanguage);


        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{
              role: "user",
              content: finalPrompt
            }],
            temperature: 0.7,
            max_tokens: 4000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data.choices[0].message.content;

        sendResponse({ result });
      } catch (error) {
        sendResponse({
          error: error.message || 'Unknown error processing the text'
        });
      }
    })();
    return true; // Indicate that the response is sent asynchronously.
  }
});

// Listen for clicks on the context menu item.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'process-text-context-menu') {
    // Inject a content script to get the selected text.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getSelectedText,
    }).then(results => {
        if (chrome.runtime.lastError || !results || !results.length) {
          console.error('Error getting selected text:', chrome.runtime.lastError);
          return;
        }
        const selectedText = results[0].result;

        if (selectedText) {
          // Send a message to the content script to process the text.
          chrome.tabs.sendMessage(tab.id, { type: 'processTextContextMenu', text: selectedText }, (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message to content script:", chrome.runtime.lastError);
            }
          });
        }
    }).catch(err => console.error('Script execution failed:', err));
  }
});

// Function to get the selected text (to be injected).
function getSelectedText() {
  return window.getSelection().toString().trim();
}
