// Nixi Website JavaScript

// Copy code functionality
function copyCode(button) {
  const codeContent = button.parentElement.nextElementSibling.querySelector('pre');
  const text = codeContent.textContent;  
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    button.style.background = 'rgba(76, 175, 80, 0.3)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add syntax highlighting to code blocks
  const codeBlocks = document.querySelectorAll('.code-content pre');
  codeBlocks.forEach(block => {
    // Basic syntax highlighting is handled by CSS classes
    block.addEventListener('click', function() {
      // Optional: Add click-to-select functionality
      const range = document.createRange();
      range.selectNodeContents(this);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
});

// Platform selection functionality
function showPlatform(platform) {
  // Hide all platform commands
  document.querySelectorAll('.platform-command').forEach(cmd => {
    cmd.style.display = 'none';
  });
  
  // Show selected platform command
  const selectedCommand = document.getElementById(platform + '-command');
  if (selectedCommand) {
    selectedCommand.style.display = 'block';
  }
  
  // Update button states
  document.querySelectorAll('.platform-buttons button').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  });
  
  // Highlight selected button
  event.target.classList.remove('btn-secondary');
  event.target.classList.add('btn-primary');
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Search functionality (placeholder)
function searchDocumentation(query) {
  console.log('Searching for:', query);
  // Implement search functionality when documentation is expanded
}

// Theme toggle (placeholder for future dark/light mode)
function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add syntax highlighting to code blocks
  const codeBlocks = document.querySelectorAll('.code-content pre');
  codeBlocks.forEach(block => {
    // Basic syntax highlighting is handled by CSS classes
    block.addEventListener('click', function() {
      // Optional: Add click-to-select functionality
      const range = document.createRange();
      range.selectNodeContents(this);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// Search functionality (placeholder)
function searchDocumentation(query) {
  console.log('Searching for:', query);
  // Implement search functionality when documentation is expanded
}

// Theme toggle (placeholder for future dark/light mode)
function toggleTheme() {
  document.body.classList.toggle('light-theme');
}