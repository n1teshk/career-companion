// LinkedIn Analysis JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {

  // File drag and drop handlers (already in the view but making them global)
  window.dragOverHandler = function(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
  };

  window.dragEnterHandler = function(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add('drag-over');
  };

  window.dragLeaveHandler = function(ev) {
    ev.currentTarget.classList.remove('drag-over');
  };

  window.dropHandler = function(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.remove('drag-over');
    
    const files = ev.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        document.getElementById('linkedin_profile').files = files;
        handleFileSelect(document.getElementById('linkedin_profile'));
      } else {
        showFileError('Please upload a PDF file only.');
      }
    }
  };

  // Enhanced file selection handler
  window.handleFileSelect = function(input) {
    const file = input.files[0];
    const uploadArea = document.querySelector('.file-upload-area');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    const success = uploadArea.querySelector('.upload-success');
    const submitBtn = document.getElementById('submit-btn');
    
    if (file) {
      // Get max size from config (fallback to 10MB)
      const maxSizeElement = document.querySelector('[data-max-file-size]');
      const maxSize = maxSizeElement ? 
        parseInt(maxSizeElement.dataset.maxFileSize) * 1024 * 1024 : 
        parseFloat(document.body.dataset.defaultMaxFileSize) || (10 * 1024 * 1024);
      
      // Validate file size
      if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        showFileError(`File size too large. Maximum ${maxSizeMB}MB allowed.`);
        clearFile();
        return;
      }
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        showFileError('Please upload a PDF file only.');
        clearFile();
        return;
      }
      
      // Show success state with enhanced UI
      const fileName = file.name;
      const fileSize = formatFileSize(file.size);
      document.getElementById('file-name').innerHTML = `
        <strong>${fileName}</strong><br>
        <small class="text-muted">${fileSize}</small>
      `;
      
      placeholder.classList.add('d-none');
      success.classList.remove('d-none');
      submitBtn.disabled = false;
      submitBtn.setAttribute('data-bs-title', 'Click to analyze your LinkedIn profile');
      
      // Add file preview if possible
      addFilePreviewInfo(file);
      
      // Hide any previous error messages
      hideFileError();
    }
  };

  // Enhanced clear file function
  window.clearFile = function() {
    const input = document.getElementById('linkedin_profile');
    const uploadArea = document.querySelector('.file-upload-area');
    const placeholder = uploadArea.querySelector('.upload-placeholder');
    const success = uploadArea.querySelector('.upload-success');
    const submitBtn = document.getElementById('submit-btn');
    
    input.value = '';
    placeholder.classList.remove('d-none');
    success.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-bs-title', 'Upload a PDF file first');
    
    // Remove file preview
    removeFilePreviewInfo();
    hideFileError();
  };

  // Enhanced file size formatter
  window.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show file error with better UX
  function showFileError(message) {
    let errorElement = document.getElementById('file-error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'file-error-message';
      errorElement.className = 'alert alert-danger mt-3';
      document.querySelector('.file-upload-area').parentNode.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `
      <i class="bi bi-exclamation-triangle me-2"></i>
      ${message}
    `;
    errorElement.style.display = 'block';
  }

  // Hide file error
  function hideFileError() {
    const errorElement = document.getElementById('file-error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  // Add file preview information
  function addFilePreviewInfo(file) {
    const previewContainer = document.getElementById('file-preview-info');
    if (!previewContainer) {
      const container = document.createElement('div');
      container.id = 'file-preview-info';
      container.className = 'mt-3 p-3 bg-light rounded';
      document.querySelector('.file-upload-area').parentNode.appendChild(container);
    }
    
    document.getElementById('file-preview-info').innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-file-pdf-fill text-danger fs-4 me-3"></i>
        <div class="flex-grow-1">
          <h6 class="mb-1">${file.name}</h6>
          <small class="text-muted">
            Size: ${formatFileSize(file.size)} • 
            Type: PDF • 
            Last modified: ${new Date(file.lastModified).toLocaleDateString()}
          </small>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="clearFile()">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  }

  // Remove file preview
  function removeFilePreviewInfo() {
    const previewContainer = document.getElementById('file-preview-info');
    if (previewContainer) {
      previewContainer.remove();
    }
  }

  // Enhanced form submission with progress tracking
  function initializeFormSubmission() {
    const form = document.querySelector('form[data-linkedin-analysis]');
    if (form) {
      form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('input[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          
          // Show enhanced loading state
          showAnalysisProgress();
        }
      });
    }
  }

  // Show analysis progress with steps
  function showAnalysisProgress() {
    const progressContainer = document.createElement('div');
    progressContainer.id = 'analysis-progress';
    progressContainer.className = 'mt-4 p-4 border rounded';
    progressContainer.innerHTML = `
      <h6 class="text-primary mb-3">
        <i class="bi bi-hourglass-split me-2"></i>
        Analyzing Your LinkedIn Profile
      </h6>
      <div class="progress mb-3" style="height: 8px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
             style="width: 0%"></div>
      </div>
      <div class="analysis-steps">
        <div class="step active" data-step="1">
          <i class="bi bi-upload me-2"></i>Uploading PDF...
        </div>
        <div class="step" data-step="2">
          <i class="bi bi-file-text me-2"></i>Extracting content...
        </div>
        <div class="step" data-step="3">
          <i class="bi bi-robot me-2"></i>AI analysis in progress...
        </div>
        <div class="step" data-step="4">
          <i class="bi bi-check-circle me-2"></i>Generating recommendations...
        </div>
      </div>
    `;
    
    document.querySelector('.card-body').appendChild(progressContainer);
    
    // Simulate progress steps
    simulateAnalysisProgress();
  }

  // Simulate analysis progress for better UX
  function simulateAnalysisProgress() {
    const progressBar = document.querySelector('#analysis-progress .progress-bar');
    const steps = document.querySelectorAll('#analysis-progress .step');
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
      if (currentStep < steps.length) {
        // Update progress bar
        progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        
        // Update step states
        if (currentStep > 0) {
          steps[currentStep - 1].classList.remove('active');
          steps[currentStep - 1].classList.add('completed');
          steps[currentStep - 1].innerHTML = steps[currentStep - 1].innerHTML.replace('bi-', 'bi-check-circle text-success me-2"></i><i class="bi-');
        }
        
        steps[currentStep].classList.add('active');
        currentStep++;
      } else {
        clearInterval(stepInterval);
      }
    }, 2000);
  }

  // Print functionality for improvement report
  function initializePrintFunctionality() {
    const printButtons = document.querySelectorAll('[data-print-report]');
    printButtons.forEach(button => {
      button.addEventListener('click', function() {
        window.print();
      });
    });
  }

  // Smooth scrolling for report navigation
  function initializeReportNavigation() {
    const navLinks = document.querySelectorAll('a[href^="#report-"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Copy report sections to clipboard
  function initializeCopyFunctionality() {
    const copyButtons = document.querySelectorAll('[data-copy-section]');
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const sectionId = this.dataset.copySection;
        const section = document.getElementById(sectionId);
        
        if (section) {
          const textToCopy = section.innerText || section.textContent;
          
          navigator.clipboard.writeText(textToCopy).then(() => {
            showCopyFeedback(this);
          }).catch(() => {
            // Fallback for older browsers
            fallbackCopyToClipboard(textToCopy);
            showCopyFeedback(this);
          });
        }
      });
    });
  }

  // Show copy success feedback
  function showCopyFeedback(button) {
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
    button.classList.add('btn-success');
    
    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.classList.remove('btn-success');
    }, 2000);
  }

  // Fallback copy function for older browsers
  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
  }

  // Animate profile score on results page
  function animateProfileScore() {
    const scoreElements = document.querySelectorAll('.circular-progress-lg');
    scoreElements.forEach(element => {
      const percentage = parseFloat(element.dataset.percentage) || 0;
      const circle = element.querySelector('circle:last-child');
      
      if (circle) {
        const radius = parseFloat(element.dataset.progressRadius) || 65;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = `${(percentage / 100) * circumference}, ${circumference}`;
        
        // Start from 0
        circle.style.strokeDasharray = `0, ${circumference}`;
        circle.style.transition = 'stroke-dasharray 2.5s ease-in-out';
        
        setTimeout(() => {
          circle.style.strokeDasharray = strokeDasharray;
        }, 500);
      }
      
      // Animate score number
      const scoreValue = element.querySelector('.circular-progress-value-lg h2');
      if (scoreValue) {
        animateScoreCounter(scoreValue, percentage);
      }
    });
  }

  // Animate score counter
  function animateScoreCounter(element, targetScore) {
    let currentScore = 0;
    const increment = targetScore / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const counter = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(counter);
      }
      element.textContent = `${Math.round(currentScore)}/100`;
    }, stepTime);
  }

  // Initialize all LinkedIn analysis functionality
  function initializeLinkedInAnalysis() {
    initializeFormSubmission();
    initializePrintFunctionality();
    initializeReportNavigation();
    initializeCopyFunctionality();
    animateProfileScore();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Initialize when DOM is ready
  initializeLinkedInAnalysis();
  
  // Re-initialize on Turbo navigation (for Rails with Turbo)
  document.addEventListener('turbo:load', initializeLinkedInAnalysis);
});

// Global helper functions
window.LinkedInAnalysis = {
  // Show success message
  showSuccess: function(message) {
    const alertHtml = `
      <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <i class="bi bi-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);
  },
  
  // Show error message
  showError: function(message) {
    const alertHtml = `
      <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    document.querySelector('.container').insertAdjacentHTML('afterbegin', alertHtml);
  },
  
  // Format profile score level (from backend data)
  getScoreLevel: function(score) {
    // This should be provided by the backend as data attributes  
    const element = document.querySelector(`[data-profile-score="${score}"]`);
    return element?.dataset.scoreLevel || 'Unknown';
  }
};