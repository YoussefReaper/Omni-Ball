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

    // ==========================================================
    // Booking System Functionality
    // ==========================================================
    
    // Initialize booking variables
    let currentReservationCount = localStorage.getItem('reservationCount') || 0;
    let currentTab = 'reservation';
    
    // Get booking elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const nextButton = document.querySelector('.next-btn');
    const backButton = document.querySelector('.back-btn');
    const submitPaymentButton = document.querySelector('.submit-payment');
    const backToHomeButton = document.getElementById('back-to-home');
    
    // Tab switching functionality
    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.getAttribute('data-tab');
                if (!this.disabled) {
                    switchTab(tab);
                }
            });
        });
    }
    
    // Next button click
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // Simple validation
            const nameInput = document.getElementById('full-name');
            const emailInput = document.getElementById('booking-email');
            
            if (nameInput.value.trim() === '') {
                nameInput.focus();
                return;
            }
            if (emailInput.value.trim() === '') {
                emailInput.focus();
                return;
            }
            
            // Switch to payment tab
            switchTab('payment');
            
            // Update summary information
            updateOrderSummary();
        });
    }
    
    // Back button click
    if (backButton) {
        backButton.addEventListener('click', function() {
            switchTab('reservation');
        });
    }
    
    // Submit payment and show confirmation
    if (submitPaymentButton) {
        submitPaymentButton.addEventListener('click', function() {
            // Increment reservation counter
            currentReservationCount = parseInt(currentReservationCount) + 1;
            localStorage.setItem('reservationCount', currentReservationCount);
            
            // Create reservation number
            const reservationNumber = `OWT-${Math.floor(10000 + Math.random() * 90000)}`;
            
            // Update confirmation page
            document.getElementById('reservation-number').textContent = reservationNumber;
            document.getElementById('email-reservation-number').textContent = reservationNumber;
            
            const positionNumbers = document.querySelectorAll('.position-number');
            positionNumbers.forEach(el => {
                el.textContent = `#${currentReservationCount}`;
            });
            
            // Set customer details in confirmation
            const fullName = document.getElementById('full-name').value || 'Customer';
            const email = document.getElementById('booking-email').value || 'customer@example.com';
            const quantity = document.getElementById('quantity').value || '1';
            const installation = document.getElementById('installation').value === 'professional' ? 
                'Professional Installation' : 'Self-Installation';
                
            document.getElementById('confirmation-name').textContent = fullName;
            document.getElementById('confirmation-email').textContent = email;
            document.getElementById('confirmation-quantity').textContent = quantity;
            document.getElementById('confirmation-installation').textContent = installation;
            
            // Enable and switch to confirmation tab
            document.querySelector('.tab-btn[data-tab="confirmation"]').disabled = false;
            switchTab('confirmation');
        });
    }
    
    // Back to home button
    if (backToHomeButton) {
        backToHomeButton.addEventListener('click', function() {
            window.goToPage('home');
        });
    }
    
    // Installation option changes
    const installationSelect = document.getElementById('installation');
    if (installationSelect) {
        installationSelect.addEventListener('change', function() {
            updateOrderSummary();
        });
    }
    
    // Quantity changes
    const quantitySelect = document.getElementById('quantity');
    if (quantitySelect) {
        quantitySelect.addEventListener('change', function() {
            updateOrderSummary();
        });
    }
    
    // Update order summary based on selections
    function updateOrderSummary() {
        const quantity = document.getElementById('quantity').value || 1;
        const installation = document.getElementById('installation').value;
        
        // Update quantity in summary
        document.getElementById('summary-quantity').textContent = quantity;
        
        // Calculate product price
        const unitPrice = 599;
        const productTotal = unitPrice * quantity;
        document.getElementById('summary-product-price').textContent = `$${productTotal.toFixed(2)}`;
        
        // Update installation cost
        const installationItem = document.getElementById('summary-installation');
        if (installation === 'professional') {
            const installationCost = 150 * quantity;
            installationItem.querySelector('span:last-child').textContent = `$${installationCost.toFixed(2)}`;
        } else {
            installationItem.querySelector('span:last-child').textContent = '$0.00';
        }
        
        // Calculate and update total
        let total = productTotal;
        if (installation === 'professional') {
            total += 150 * quantity;
        }
        
        document.getElementById('summary-total-price').textContent = `$${total.toFixed(2)}`;
    }
    
    // Switch between tabs
    function switchTab(tab) {
        // Update active tab button
        tabButtons.forEach(btn => {
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Show active tab content
        tabContents.forEach(content => {
            if (content.id === `${tab}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        currentTab = tab;
    }

    // ==========================================================
    // Interactive Features
    // ==========================================================
    
    // Initialize 3D Model Viewer if present
    initializeModelViewer();
    
    // Initialize Charts if present
    initializeCharts();
    
    // Set up Energy Calculator
    setupCalculator();
    
    // Initialize Testimonials
    initializeTestimonials();
    
    // Add animation to timeline items
    animateTimelineOnScroll();
});

// 3D Model Viewer Functions
function initializeModelViewer() {
    const modelViewer = document.getElementById('turbine-model');
    if (!modelViewer) return;
    
    // This would normally use an actual 3D model of your turbine
    // For prototype purposes, we're using a placeholder model
    
    const rotateToggle = document.getElementById('rotate-toggle');
    const explodeView = document.getElementById('explode-view');
    const resetView = document.getElementById('reset-view');
    
    if (rotateToggle) {
        rotateToggle.addEventListener('click', function() {
            if (modelViewer.autoRotate) {
                modelViewer.autoRotate = false;
                this.textContent = 'Start Rotation';
            } else {
                modelViewer.autoRotate = true;
                this.textContent = 'Pause Rotation';
            }
        });
    }
    
    if (explodeView) {
        explodeView.addEventListener('click', function() {
            // In a real implementation, this would trigger an exploded view animation
            modelViewer.cameraOrbit = '0deg 75deg 2m';
            if (this.textContent === 'Exploded View') {
                this.textContent = 'Assembled View';
            } else {
                this.textContent = 'Exploded View';
            }
        });
    }
    
    if (resetView) {
        resetView.addEventListener('click', function() {
            modelViewer.cameraOrbit = '0deg 75deg 2m';
            modelViewer.cameraTarget = '0m 0m 0m';
            if (rotateToggle) {
                modelViewer.autoRotate = true;
                rotateToggle.textContent = 'Pause Rotation';
            }
            if (explodeView) {
                explodeView.textContent = 'Exploded View';
            }
        });
    }
}

// Chart Initialization
function initializeCharts() {
    const efficiencyChart = document.getElementById('efficiency-chart');
    if (!efficiencyChart) return;
    
    // This would normally use a charting library like Chart.js
    // For prototype purposes, we'll create a simple CSS-based chart
    
    const chartData = [
        { label: 'Low Wind', oWind: 65, traditional: 30, solar: 80 },
        { label: 'Medium Wind', oWind: 85, traditional: 70, solar: 75 },
        { label: 'Gusty Wind', oWind: 90, traditional: 60, solar: 65 },
        { label: 'Changing Direction', oWind: 80, traditional: 40, solar: 70 },
        { label: 'Urban Setting', oWind: 75, traditional: 25, solar: 60 }
    ];
    
    let chartHTML = '<div class="chart-grid">';
    
    chartData.forEach((item, index) => {
        chartHTML += `
            <div class="chart-column">
                <div class="chart-bars">
                    <div class="data-bar" style="height: ${item.oWind}%; background-color: var(--primary-color); animation-delay: ${index * 0.1}s;"></div>
                    <div class="data-bar" style="height: ${item.traditional}%; background-color: var(--data-color-2); animation-delay: ${index * 0.1 + 0.2}s;"></div>
                    <div class="data-bar" style="height: ${item.solar}%; background-color: var(--data-color-3); animation-delay: ${index * 0.1 + 0.4}s;"></div>
                </div>
                <div class="chart-label">${item.label}</div>
            </div>
        `;
    });
    
    chartHTML += '</div>';
    efficiencyChart.innerHTML = chartHTML;
    
    // Add required styles for the chart
    const style = document.createElement('style');
    style.textContent = `
        .chart-grid {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 100%;
        }
        .chart-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 18%;
        }
        .chart-bars {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 85%;
        }
        .data-bar {
            width: 30%;
            margin-bottom: 10px;
            border-radius: 3px 3px 0 0;
        }
        .chart-label {
            font-size: 0.8rem;
            text-align: center;
            padding: 5px 0;
        }
    `;
    document.head.appendChild(style);
}

// Energy Calculator
function setupCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;
    
    calculateBtn.addEventListener('click', function() {
        const location = document.getElementById('location').value;
        const electricityCost = parseFloat(document.getElementById('electricity-cost').value);
        const windExposure = document.getElementById('wind-exposure').value;
        const units = parseInt(document.getElementById('units').value);
        
        // Simple calculation factors (would be more sophisticated in a real tool)
        const locationFactor = {
            'urban-high': 1.2,
            'urban-low': 0.9,
            'suburban': 1.0,
            'rural': 1.3
        };
        
        const exposureFactor = {
            'excellent': 1.4,
            'good': 1.0,
            'moderate': 0.7,
            'poor': 0.4
        };
        
        // Calculate estimated energy production (kWh)
        const baseProduction = 350; // Base annual kWh for one unit
        const energyProduction = baseProduction * locationFactor[location] * exposureFactor[windExposure] * units;
        
        // Calculate cost savings
        const costSavings = energyProduction * electricityCost;
        
        // Calculate CO2 reduction (using average 0.71 kg CO2 per kWh)
        const co2Reduction = energyProduction * 0.71;
        
        // Calculate ROI
        const turbineCost = 599 * units;
        const roi = turbineCost / costSavings;
        
        // Update results
        document.getElementById('energy-result').textContent = Math.round(energyProduction) + ' kWh';
        document.getElementById('savings-result').textContent = '$' + costSavings.toFixed(2);
        document.getElementById('co2-result').textContent = Math.round(co2Reduction) + ' kg';
        document.getElementById('roi-result').textContent = roi.toFixed(1) + ' years';
        
        // Add animation to results
        const results = document.getElementById('calculator-results');
        results.classList.add('glow-pulse');
        setTimeout(() => {
            results.classList.remove('glow-pulse');
        }, 3000);
    });
}

// Testimonials Carousel
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-item');
    const nextBtn = document.querySelector('.next-testimonial');
    const prevBtn = document.querySelector('.prev-testimonial');
    
    if (!testimonials.length || !nextBtn || !prevBtn) return;
    
    let currentIndex = 0;
    
    // Show one testimonial at a time
    function showTestimonial(index) {
        testimonials.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
    }
    
    // Initial display
    showTestimonial(currentIndex);
    
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
    
    // Auto-rotate testimonials
    setInterval(function() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 8000);
}

// Animate timeline items when scrolled into view
function animateTimelineOnScroll() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}