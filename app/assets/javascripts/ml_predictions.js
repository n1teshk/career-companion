// ML Predictions JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Auto-refresh for processing predictions
  function checkForProcessingPredictions() {
    const processingElements = document.querySelectorAll('[data-status="processing"]');
    if (processingElements.length > 0) {
      // Refresh every configured interval if predictions are processing
      const refreshInterval = document.body.dataset.autoRefreshInterval || 10000;
      setTimeout(function() {
        window.location.reload();
      }, parseInt(refreshInterval));
    }
  }

  // Initialize tooltips for ML predictions
  function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { show: 500, hide: 100 }
      });
    });
  }

  // AJAX status polling for predictions
  function pollPredictionStatus(applicationId) {
    const statusUrl = `/applications/${applicationId}/ml_predictions/status`;
    
    fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => response.json())
    .then(data => {
      updatePredictionStatus(data);
      
      // Continue polling if any predictions are still processing
      if (data.some(pred => pred.status === 'processing')) {
        const pollingInterval = document.body.dataset.pollingInterval || 5000;
        setTimeout(() => pollPredictionStatus(applicationId), parseInt(pollingInterval));
      }
    })
    .catch(error => {
      console.error('Error polling prediction status:', error);
    });
  }

  // Update prediction status in the UI
  function updatePredictionStatus(predictions) {
    predictions.forEach(prediction => {
      const statusElement = document.querySelector(`[data-prediction-id="${prediction.id}"]`);
      if (statusElement) {
        // Update status badge
        const badge = statusElement.querySelector('.status-badge');
        if (badge) {
          badge.className = `badge bg-${getStatusBadgeColor(prediction.status)}`;
          badge.textContent = prediction.status.charAt(0).toUpperCase() + prediction.status.slice(1);
        }

        // Update confidence if available
        if (prediction.confidence_score) {
          const confidenceBar = statusElement.querySelector('.confidence-bar');
          if (confidenceBar) {
            confidenceBar.style.width = `${(prediction.confidence_score * 100)}%`;
            confidenceBar.className = `progress-bar bg-${getConfidenceBadgeColor(prediction.confidence_score)}`;
          }
        }

        // Show/hide loading indicators
        const loadingIndicator = statusElement.querySelector('.loading-indicator');
        if (loadingIndicator) {
          loadingIndicator.style.display = prediction.status === 'processing' ? 'block' : 'none';
        }
      }
    });
  }

  // Get appropriate badge color for status
  function getStatusBadgeColor(status) {
    switch(status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'success';
      case 'processing':
      case 'pending':
        return 'warning';
      case 'failed':
      case 'error':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  // Get appropriate badge color for confidence score
  function getConfidenceBadgeColor(confidence) {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'primary';
    if (confidence >= 0.4) return 'warning';
    return 'danger';
  }

  // Smooth scroll to prediction sections
  function initializeSmoothScrolling() {
    const predictionLinks = document.querySelectorAll('a[href^="#prediction-"]');
    predictionLinks.forEach(link => {
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

  // Handle prediction generation form submission
  function handlePredictionGeneration() {
    const generateForms = document.querySelectorAll('form[data-prediction-generate]');
    generateForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitButton = form.querySelector('input[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.value = 'Generating...';
          
          // Show loading indicator
          const loadingHtml = '<i class="bi bi-hourglass-split me-2"></i>Generating Predictions...';
          submitButton.innerHTML = loadingHtml;
        }
      });
    });
  }

  // Animate confidence scores and progress bars
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar[data-animate="true"]');
    progressBars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      bar.style.transition = 'width 1.5s ease-in-out';
      
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 100);
    });
  }

  // Animate circular progress for success probability
  function animateCircularProgress() {
    const circularProgressElements = document.querySelectorAll('.circular-progress');
    circularProgressElements.forEach(element => {
      const percentage = parseFloat(element.dataset.percentage) || 0;
      const circle = element.querySelector('circle:last-child');
      
      if (circle) {
        const radius = parseFloat(element.dataset.progressRadius) || 54;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = `${(percentage / 100) * circumference}, ${circumference}`;
        
        // Start from 0
        circle.style.strokeDasharray = `0, ${circumference}`;
        circle.style.transition = 'stroke-dasharray 2s ease-in-out';
        
        setTimeout(() => {
          circle.style.strokeDasharray = strokeDasharray;
        }, 200);
      }
    });
  }

  // Copy prediction results to clipboard
  function initializeCopyFunctionality() {
    const copyButtons = document.querySelectorAll('[data-copy-prediction]');
    copyButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.dataset.copyPrediction;
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const textToCopy = targetElement.innerText || targetElement.textContent;
          
          navigator.clipboard.writeText(textToCopy).then(() => {
            // Show success feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
            this.classList.add('btn-success');
            this.classList.remove('btn-outline-secondary');
            
            setTimeout(() => {
              this.innerHTML = originalText;
              this.classList.remove('btn-success');
              this.classList.add('btn-outline-secondary');
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Show feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check me-1"></i>Copied!';
            setTimeout(() => {
              this.innerHTML = originalText;
            }, 2000);
          });
        }
      });
    });
  }

  // Initialize all functionality
  function initializeMLPredictions() {
    checkForProcessingPredictions();
    initializeTooltips();
    initializeSmoothScrolling();
    handlePredictionGeneration();
    animateProgressBars();
    animateCircularProgress();
    initializeCopyFunctionality();
    
    // Start polling if there are processing predictions
    const applicationId = document.body.dataset.applicationId;
    if (applicationId && document.querySelector('[data-status="processing"]')) {
      setTimeout(() => pollPredictionStatus(applicationId), 2000);
    }
  }

  // Initialize when DOM is ready
  initializeMLPredictions();
  
  // Re-initialize on Turbo navigation (for Rails with Turbo)
  document.addEventListener('turbo:load', initializeMLPredictions);
});

// Global helper functions for inline use
window.MLPredictions = {
  // Format confidence score for display
  formatConfidence: function(score) {
    return `${Math.round(score * 100)}%`;
  },
  
  // Get confidence level text (from backend data)
  getConfidenceLevel: function(score) {
    // This should be provided by the backend as data attributes
    const element = document.querySelector(`[data-confidence-score="${score}"]`);
    return element?.dataset.confidenceLevel || 'Unknown';
  },
  
  // Format currency values
  formatCurrency: function(amount, currency = 'USD') {
    if (!amount) return 'N/A';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(amount);
  },
  
  // Show prediction loading state
  showLoadingState: function(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Generating predictions...</p>
        </div>
      `;
    }
  }
};