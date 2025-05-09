document.addEventListener('DOMContentLoaded', function() {
    // Simple page transition system
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const transitionButtons = document.querySelectorAll('.page-transition');
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    
    // Navigation function - make it global for direct access
    window.goToPage = function(pageId) {
        // Don't proceed if target doesn't exist
        const targetPage = document.getElementById(pageId);
        if (!targetPage) {
            console.log(`Target page ${pageId} not found`);
            return;
        }
        
        // Don't do anything if we're already on this page
        const currentPage = document.querySelector('.page.active');
        if (currentPage && currentPage.id === pageId) {
            return;
        }
        
        console.log(`Navigating to: ${pageId}`);
        
        // Start transition effect
        if (transitionOverlay) {
            transitionOverlay.classList.add('active');
        }
        
        // After a delay, switch pages
        setTimeout(function() {
            // Hide all pages
            pages.forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            targetPage.classList.add('active');
            
            // Update active nav link
            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === pageId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Update URL hash
            window.location.hash = pageId;
            
            // Scroll to top
            window.scrollTo(0, 0);
        }, 500);
        
        // End transition effect
        setTimeout(function() {
            if (transitionOverlay) {
                transitionOverlay.classList.remove('active');
            }
        }, 1200);
    };
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-page');
            if (target) {
                window.goToPage(target);
            }
        });
    });
    
    // Handle transition buttons
    transitionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-page');
            if (target) {
                window.goToPage(target);
            }
        });
    });
    
    // Initial page setup based on hash
    function initFromHash() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !document.getElementById(hash)) {
            hash = 'home';
            window.location.hash = hash;
        }
        
        // Activate correct page
        pages.forEach(page => {
            if (page.id === hash) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            if (link.getAttribute('data-page') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Run initial setup
    initFromHash();
    
    // Handle back/forward browser navigation
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            window.goToPage(hash);
        }
    });
    
    // ==========================================================
    // Basic visual effects and interactions
    // ==========================================================
    
    // Progress bar
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scrolled}%`;
        }
    });
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
            }
        });
    }
    
    // Create simple particle effect
    const particles = document.querySelector('.particles');
    if (particles) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 3 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particles.appendChild(particle);
        }
    }
});