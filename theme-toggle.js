document.addEventListener('DOMContentLoaded', function() {
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = '🌙';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.setAttribute('title', 'Toggle dark mode');
    
    // Insert button at the beginning of body
    document.body.insertBefore(toggleButton, document.body.firstChild);
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update button icon based on current theme
    function updateButtonIcon() {
        const theme = document.documentElement.getAttribute('data-theme');
        toggleButton.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Initialize button icon
    updateButtonIcon();
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonIcon();
    }
    
    // Add click event listener
    toggleButton.addEventListener('click', toggleTheme);
    
    // Optional: Add keyboard support
    toggleButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    });
    
    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();
});

function addCopyButtonsToCodeBlocks() {
    // Find all pre elements (code blocks)
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(function(codeBlock) {
        // Skip if already has a copy button
        if (codeBlock.querySelector('.copy-button')) return;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        copyButton.setAttribute('title', 'Copy code to clipboard');
        
        // Add click event listener
        copyButton.addEventListener('click', function() {
            copyCodeToClipboard(codeBlock, copyButton);
        });
        
        // Add keyboard support
        copyButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyCodeToClipboard(codeBlock, copyButton);
            }
        });
        
        // Add button to code block
        codeBlock.appendChild(copyButton);
    });
}

function copyCodeToClipboard(codeBlock, button) {
    // Get the code content, excluding the button text
    let codeContent;
    
    // Check if there's a <code> element inside the <pre>
    const codeElement = codeBlock.querySelector('code');
    if (codeElement) {
        codeContent = codeElement.textContent || codeElement.innerText;
    } else {
        // Get all text content and remove the button text
        const fullText = codeBlock.textContent || codeBlock.innerText;
        const buttonText = button.textContent;
        codeContent = fullText.replace(buttonText, '').trim();
    }
    
    // Try to copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        // Modern approach
        navigator.clipboard.writeText(codeContent).then(function() {
            showCopySuccess(button);
        }).catch(function(err) {
            console.error('Failed to copy to clipboard:', err);
            fallbackCopyToClipboard(codeContent, button);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(codeContent, button);
    }
}

function fallbackCopyToClipboard(text, button) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    
    // Select and copy
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        showCopyError(button);
    }
    
    // Clean up
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(function() {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = 'Error';
    
    setTimeout(function() {
        button.textContent = originalText;
    }, 2000);
} 