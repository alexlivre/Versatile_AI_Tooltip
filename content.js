let lastSelection = '';
let isProcessing = false;

const showTooltip = (content, options = {}) => {
  const existingTooltip = document.getElementById('versatile-ai-tooltip');
  if (existingTooltip) existingTooltip.remove();

  const tooltip = document.createElement('div');
  tooltip.id = 'versatile-ai-tooltip';

  tooltip.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    z-index: 2147483647;
    max-width: 500px;
    width: 90vw;
    max-height: 80vh;
    transform: scale(0.95);
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(0,0,0,0.1);
    font-family: 'Google Sans', Arial, sans-serif;
    display: flex;
    flex-direction: column;
  `;

  tooltip.innerHTML = `
    <div class="tooltip-header">
      <div class="title">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#1a73e8">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        <h3>Versatile AI Tooltip</h3>
      </div>
      ${options.closeable ? `<button class="close-btn" aria-label="Close">&times;</button>` : ''}
    </div>
    <div class="content">${content}</div>
    <div class="tooltip-footer">
      <button class="copy-btn" aria-label="Copy content">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        Copy
      </button>
      <div class="branding">Developed by Alex Breno</div>
    </div>
    <style>
      .tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 20px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
      }

      .title {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      h3 {
        margin: 0;
        font-size: 1.1em;
        color: #1a1a1a;
        font-weight: 500;
      }

      .content {
        padding: 15px 20px;
        line-height: 1.6;
        color: #333;
        max-height: 60vh;
        overflow-y: auto;
        white-space: pre-wrap;
        flex-grow: 1;
      }

      .content::-webkit-scrollbar {
        width: 6px;
      }

      .content::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      .content::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }

      .tooltip-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        border-top: 1px solid rgba(0,0,0,0.1);
        flex-shrink: 0;
      }

      .copy-btn {
        background: none;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.2s;
        font-size: 0.9em;
        color: #5f6368;
      }

      .copy-btn:hover {
        background: #f8f9fa;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: #666;
        padding: 0;
        line-height: 1;
        transition: color 0.2s;
      }

      .close-btn:hover {
        color: #1a1a1a;
      }

      .branding {
        font-size: 0.8em;
        color: #666;
        opacity: 0.8;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 40px 20px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #1a73e8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .error-state {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        color: #dc3545;
      }

      @media (max-width: 480px) {
        #versatile-ai-tooltip {
          left: 10px !important;
          right: 10px !important;
          width: calc(100% - 20px) !important;
          max-width: none !important;
          top: 10px !important;
        }
      }
    </style>
  `;

  // Animação de entrada
  setTimeout(() => {
    tooltip.style.transform = 'scale(1)';
    tooltip.style.opacity = '1';
  }, 10);

  // Event listeners
  tooltip.querySelector('.close-btn')?.addEventListener('click', () => {
    tooltip.style.transform = 'scale(0.95)';
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.remove(), 200);
    lastSelection = '';
  });

  tooltip.querySelector('.copy-btn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(content.replace(/<[^>]*>?/gm, ''));
    const copyBtn = tooltip.querySelector('.copy-btn');
    copyBtn.textContent = 'Copied!';
    copyBtn.style.color = '#1a73e8';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.style.color = '#5f6368';
    }, 2000);
  });

  document.body.appendChild(tooltip);
};

const processSelection = async (text) => {
  if (isProcessing) return;
  isProcessing = true;

  let responseHandled = false; // Flag to track if the response has been handled

  try {
    showTooltip(`
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Analyzing ${text.length > 50 ? 'text' : 'selection'}...</p>
      </div>
    `, { closeable: false });

    const response = await chrome.runtime.sendMessage({
      type: 'processText',
      text: text.trim()
    });

    // Check if the response has already been handled.  If so, exit.
    if (responseHandled) return;
    responseHandled = true; // Mark the response as handled


    if (response.error) {
      showTooltip(`
        <div class="error-state">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc3545">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>${response.error}</p>
        </div>
      `);
    } else {
      showTooltip(response.result, { closeable: true });
    }
  } catch (error) {
    // Check if the response has already been handled. If so, exit.
    if (responseHandled) return;
    responseHandled = true;

    showTooltip(`
      <div class="error-state">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#dc3545">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <p>API connection error</p>
      </div>
    `);
  } finally {
    isProcessing = false;
  }
};

// Listen for messages from the background script (context menu clicks).
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'processTextContextMenu') {
        processSelection(request.text);
        sendResponse({status: "processed"}); // Acknowledge message.  Important for async.
    }
    return true; // Keep the message channel open for async responses.
});

document.addEventListener('mouseup', async (e) => {
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  if (!enabled) return;

  const selection = window.getSelection().toString().trim();
  if (!selection || selection === lastSelection) return;

  // Check if the event target is inside the tooltip
  if (e.target.closest('#versatile-ai-tooltip')) {
    return; // Ignore the event if it's inside the tooltip
  }

  lastSelection = selection;
  processSelection(selection);
});

document.addEventListener('mousedown', (e) => {
  const tooltip = document.getElementById('versatile-ai-tooltip');
  if (tooltip && !tooltip.contains(e.target)) {
    tooltip.style.transform = 'scale(0.95)';
    tooltip.style.opacity = '0';
    setTimeout(() => tooltip.remove(), 200);
    lastSelection = '';
  }
});
