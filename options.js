document.addEventListener('DOMContentLoaded', async () => {
  const { apiKey, model, customPrompt } = await chrome.storage.sync.get({
    apiKey: '',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    customPrompt: 'As a specialized assistant in summarizing texts in {language}, always create a summary in {language}, in plain text, without using any markup language (such as Markdown or HTML), of the content provided below, regardless of the original language of the text. The summary must necessarily be shorter than the original text. Maintain the central ideas, avoid repetitions, and structure the summary in short and objective paragraphs, clearly and well organized. Never ask questions to the user at any stage of the process. Prioritize clarity and fidelity to the original context, omitting irrelevant details. Rigorously follow the logical structure of the provided text. The text to be summarized is: {text}'
  });

  document.getElementById('apiKey').value = apiKey;
  document.getElementById('model').value = model;
  document.getElementById('customPrompt').value = customPrompt;

  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.sync.set({
      apiKey: document.getElementById('apiKey').value,
      model: document.getElementById('model').value,
      customPrompt: document.getElementById('customPrompt').value
    }, () => {
      alert('Settings saved!');
      window.close();
    });
  });
});
