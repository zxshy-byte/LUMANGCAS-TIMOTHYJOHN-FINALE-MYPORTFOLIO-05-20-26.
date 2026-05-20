// script.js - Interactive functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTestimonials();
});

// Also watch for dynamic content loading (since nav/body/footer are loaded via fetch)
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            initializeTestimonials();
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = isLight ? '☀️' : '🌙';
    }
}

// Hero Image Zoom Toggle
function toggleZoom() {
    const container = document.getElementById('heroImageContainer');
    if (container) {
        container.classList.toggle('zoomed');
    }
}

// Search Functionality
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.project-card, .skill-card, .update-card');
    let hasResults = false;
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const data = card.getAttribute('data-search') || '';
        if (text.includes(query) || data.includes(query)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    const noResults = document.getElementById('noResults');
    if (noResults) {
        if (query === '') {
            noResults.style.display = 'none';
        } else {
            noResults.style.display = hasResults ? 'none' : 'block';
        }
    }
}

// Handle Enter Key Press for Search
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
}

// Contact Form Submission
function handleSubmit(e) {
    e.preventDefault();
    alert("✅ Message Sent Successfully!");
    e.target.reset();
}

// Toast Notification System - Fixed
function showToast(message) {
    // Remove any existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'custom-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0,212,255,0.95)';
    toast.style.color = '#0A2647';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '1000';
    toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    toast.style.fontFamily = "'Cormorant SC', serif";
    toast.style.whiteSpace = 'nowrap';
    toast.style.maxWidth = '90%';
    toast.style.whiteSpace = 'normal';
    toast.style.textAlign = 'center';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast && toast.remove) {
            toast.remove();
        }
    }, 2500);
}

// Testimonial Star Rating System - Fixed
function initializeTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialCards.length === 0) return;
    
    // Click to reveal rating section
    testimonialCards.forEach(card => {
        // Remove existing event listeners to avoid duplicates
        card.removeEventListener('click', card._clickHandler);
        
        const clickHandler = function(e) {
            // Don't trigger if clicking on stars or inside star-rating area
            if (e.target.classList.contains('stars') || 
                e.target.parentElement?.classList.contains('stars') || 
                e.target.hasAttribute('data-rating') ||
                e.target.closest('.stars')) {
                return;
            }
            const ratingDiv = this.querySelector('.star-rating');
            if (ratingDiv) {
                // Close other open ratings
                document.querySelectorAll('.star-rating.show').forEach(openRating => {
                    if (openRating !== ratingDiv) {
                        openRating.classList.remove('show');
                    }
                });
                ratingDiv.classList.toggle('show');
            }
        };
        
        card._clickHandler = clickHandler;
        card.addEventListener('click', clickHandler);
    });
    
    // Star rating functionality
    const starContainers = document.querySelectorAll('.stars');
    starContainers.forEach(starsContainer => {
        const stars = starsContainer.querySelectorAll('span');
        const ratingText = starsContainer.parentElement.querySelector('.rating-text');
        
        // Reset star colors to default gold
        stars.forEach(star => {
            star.style.color = '#FFD700';
            star.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
        });
        
        stars.forEach(star => {
            // Remove existing listeners
            star.removeEventListener('click', star._clickHandler);
            
            const starClickHandler = function(e) {
                e.stopPropagation();
                const rating = parseInt(this.getAttribute('data-rating'));
                const parentCard = this.closest('.testimonial-card');
                const authorName = parentCard.querySelector('.author-info h4').textContent;
                
                // Reset all stars in this container to default color first
                stars.forEach(s => {
                    s.style.color = '#555';
                    s.style.textShadow = 'none';
                });
                
                // Highlight stars based on rating (1-5)
                for (let i = 0; i < rating; i++) {
                    stars[i].style.color = '#FFD700';
                    stars[i].style.textShadow = '0 0 3px #FFA500';
                }
                
                // Store the rating value
                parentCard.setAttribute('data-user-rating', rating);
                
                // Update rating text
                if (ratingText) {
                    const ratingMessages = {
                        1: '⭐ Poor - Needs improvement',
                        2: '⭐⭐ Fair - Could be better',
                        3: '⭐⭐⭐ Good - Satisfactory work',
                        4: '⭐⭐⭐⭐ Very Good - Impressive!',
                        5: '⭐⭐⭐⭐⭐ Excellent - Outstanding work!'
                    };
                    ratingText.innerHTML = `You rated: ${ratingMessages[rating]} <span style="color:#FFD700;">★</span> Thank you!`;
                    ratingText.style.color = '#FFD700';
                }
                
                // Show toast notification
                showToast(`⭐ Thank you for rating ${authorName} ${rating}/5 stars! ⭐`);
            };
            
            star._clickHandler = starClickHandler;
            star.addEventListener('click', starClickHandler);
        });
    });
}

// Re-initialize testimonials when dynamic content loads
function waitForContent() {
    const checkInterval = setInterval(() => {
        const testimonials = document.querySelector('.testimonials-grid');
        if (testimonials && testimonials.children.length > 0) {
            initializeTestimonials();
            clearInterval(checkInterval);
        }
    }, 100);
    
    // Also try after a delay
    setTimeout(() => {
        initializeTestimonials();
        clearInterval(checkInterval);
    }, 500);
}

waitForContent();

// Add some CSS for the star rating hover effects
const style = document.createElement('style');
style.textContent = `
    .stars span {
        cursor: pointer;
        transition: transform 0.2s ease, color 0.2s ease;
        display: inline-block;
    }
    .stars span:hover {
        transform: scale(1.2);
    }
    .star-rating {
        transition: all 0.3s ease;
    }
    .testimonial-card {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);