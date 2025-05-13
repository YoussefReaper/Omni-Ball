document.addEventListener('DOMContentLoaded', function() {
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Update active navigation based on scroll position
    setupScrollSpy();
    
    // Mobile navigation toggle
    setupMobileNav();
    
    // Progress bar updates
    setupProgressBar();
    
    // Initialize all the interactive features
    initializeInteractiveFeatures();
    
    // Create particle effects
    createParticles();
});

// Setup smooth scrolling for all navigation links
function setupSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('.nav-link, .scroll-link');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Extract the target section ID from href
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to the section
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Adjust for fixed navbar
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.querySelector('.nav-toggle').classList.remove('active');
                }
            }
        });
    });
}

// Highlight active navigation item based on scroll position
function setupScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Skip if no sections or nav links exist
    if (!sections.length || !navLinks.length) return;
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Setup mobile navigation toggle
function setupMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Progress bar that shows scroll progress
function setupProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// Initialize all interactive features
function initializeInteractiveFeatures() {
    // Setup booking system tabs
    setupBookingTabs();
    
    // Setup energy calculator
    setupEnergyCalculator();
    
    // Setup testimonials carousel
    setupTestimonialsCarousel();
    
    // Add animation to timeline items
    animateTimelineOnScroll();
}

// Handle booking form tabs
function setupBookingTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const nextButton = document.querySelector('.next-btn');
    
    if (tabButtons.length === 0) return;
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            const tab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Next button in reservation form
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // Simple validation
            const nameInput = document.getElementById('full-name');
            const emailInput = document.getElementById('booking-email');
            
            if (!nameInput.value.trim()) {
                nameInput.focus();
                return;
            }
            
            if (!emailInput.value.trim()) {
                emailInput.focus();
                return;
            }
            
            // Switch to payment tab
            const paymentTabBtn = document.querySelector('.tab-btn[data-tab="payment"]');
            if (paymentTabBtn) {
                paymentTabBtn.click();
            }
        });
    }
}

// Setup energy calculator functionality
function setupEnergyCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', function() {
        // Defensive: check all required elements exist before proceeding
        const locationEl = document.getElementById('location');
        const electricityCostEl = document.getElementById('electricity-cost');
        const windExposureEl = document.getElementById('wind-exposure');
        const unitsEl = document.getElementById('units');
        const installationEl = document.getElementById('installation');
        const resultsEl = document.getElementById('calculator-results');
        const energyResultEl = document.getElementById('energy-result');
        const savingsResultEl = document.getElementById('savings-result');
        const co2ResultEl = document.getElementById('co2-result');
        const roiResultEl = document.getElementById('roi-result');

        if (
            !locationEl || !electricityCostEl || !windExposureEl ||
            !unitsEl || !installationEl || !resultsEl ||
            !energyResultEl || !savingsResultEl || !co2ResultEl || !roiResultEl
        ) {
            // Required elements missing, do nothing
            return;
        }

        const location = locationEl.value;
        const electricityCost = parseFloat(electricityCostEl.value);
        const windExposure = windExposureEl.value;
        const units = parseInt(unitsEl.value);

        // Defensive: check for NaN or invalid values
        if (
            !location || isNaN(electricityCost) || !windExposure ||
            isNaN(units) || units <= 0
        ) {
            resultsEl.textContent = "Please fill in all fields with valid values.";
            return;
        }

        // Calculate values based on inputs
        const baseEnergy = 350; // kWh for baseline conditions

        // Location factors
        const locationFactor = {
            'urban-high': 1.2,
            'urban-low': 0.9,
            'suburban': 1.0,
            'rural': 1.3
        };

        // Wind exposure factors
        const exposureFactor = {
            'excellent': 1.4,
            'good': 1.0,
            'moderate': 0.7,
            'poor': 0.4
        };

        // Calculate energy production
        const energy = baseEnergy * (locationFactor[location] || 1) * (exposureFactor[windExposure] || 1) * units;

        // Calculate cost savings
        const savings = energy * electricityCost;

        // Calculate CO2 reduction (0.71 kg CO2 per kWh)
        const co2 = energy * 0.71;

        // Calculate ROI
        const unitPrice = 599;
        const installationCost = (installationEl.value === 'professional') ? 150 * units : 0;
        const totalCost = unitPrice * units + installationCost;
        const roi = savings > 0 ? totalCost / savings : 0;

        // Update results
        energyResultEl.textContent = Math.round(energy) + ' kWh';
        savingsResultEl.textContent = '$' + savings.toFixed(2);
        co2ResultEl.textContent = Math.round(co2) + ' kg';
        roiResultEl.textContent = (roi > 0 ? roi.toFixed(1) : 'N/A') + ' years';

        // Add glow effect
        resultsEl.classList.add('glow-pulse');
        setTimeout(() => {
            resultsEl.classList.remove('glow-pulse');
        }, 3000);
    });
}

// Setup testimonials carousel
function setupTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    if (!testimonials.length || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    
    // Show initial testimonial
    showTestimonial(currentIndex);
    
    // Show specific testimonial by index
    function showTestimonial(index) {
        testimonials.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Next button
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    });
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentIndex);
    });
    
    // Auto rotate testimonials
    setInterval(function() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 8000);
}

// Animate timeline items when scrolled into view
function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) return;
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        timelineItems.forEach(item => observer.observe(item));
    } else {
        // Fallback for browsers without IntersectionObserver
        timelineItems.forEach(item => item.classList.add('animate'));
    }
}

// Create particle background effect
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particlesContainer.appendChild(particle);
    }
}