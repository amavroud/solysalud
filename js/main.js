/**
 * Sol Y Salud - Interactive Sun Navigation
 * Handles hover-based navigation display around the sun
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        showDistance: 280,      // Distance from center to start showing nav items
        hideDistance: 350,      // Distance from center to hide nav items
        debounceTime: 50,       // Debounce time for mouse movement
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };

    // DOM Elements
    const hoverZone = document.getElementById('hoverZone');
    const navItems = document.querySelectorAll('.nav-item');
    const rayConnectors = document.querySelectorAll('.ray-connector');

    // State
    let isHovering = false;
    let lastMouseMove = 0;

    /**
     * Get center coordinates of an element
     */
    function getElementCenter(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /**
     * Calculate distance between two points
     */
    function getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Get direction from center based on angle
     */
    function getDirectionFromAngle(angle) {
        // Normalize angle to 0-360
        const normalizedAngle = ((angle % 360) + 360) % 360;

        // Determine quadrant/direction
        if (normalizedAngle >= 315 || normalizedAngle < 45) {
            return 'right';
        } else if (normalizedAngle >= 45 && normalizedAngle < 135) {
            return 'bottom';
        } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
            return 'left';
        } else {
            return 'top';
        }
    }

    /**
     * Show all navigation items and ray connectors
     */
    function showAllNavItems() {
        navItems.forEach(item => {
            item.classList.add('visible');
        });
        rayConnectors.forEach(connector => {
            connector.classList.add('visible');
        });
        isHovering = true;
    }

    /**
     * Hide all navigation items and ray connectors
     */
    function hideAllNavItems() {
        navItems.forEach(item => {
            item.classList.remove('visible');
        });
        rayConnectors.forEach(connector => {
            connector.classList.remove('visible');
        });
        isHovering = false;
    }

    /**
     * Show specific navigation item based on direction
     */
    function showNavItemByDirection(direction) {
        navItems.forEach(item => {
            if (item.dataset.direction === direction) {
                item.classList.add('visible');
            }
        });
        rayConnectors.forEach(connector => {
            if (connector.dataset.direction === direction) {
                connector.classList.add('visible');
            }
        });
    }

    /**
     * Handle mouse movement
     */
    function handleMouseMove(e) {
        // Skip on touch devices
        if (CONFIG.isTouchDevice) return;

        // Debounce
        const now = Date.now();
        if (now - lastMouseMove < CONFIG.debounceTime) return;
        lastMouseMove = now;

        // Get center of the sun/hover zone
        const center = getElementCenter(hoverZone);

        // Calculate distance from mouse to center
        const distance = getDistance(e.clientX, e.clientY, center.x, center.y);

        // If within the show zone, display nav items
        if (distance <= CONFIG.hideDistance && distance >= 50) {
            // Calculate angle from center
            const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);

            // Show all items when in the zone
            showAllNavItems();
        } else if (distance > CONFIG.hideDistance) {
            // Hide when outside the zone
            hideAllNavItems();
        }
    }

    /**
     * Handle mouse leave from document
     */
    function handleMouseLeave() {
        if (!CONFIG.isTouchDevice) {
            hideAllNavItems();
        }
    }

    /**
     * Initialize touch device behavior
     */
    function initTouchDevice() {
        // On touch devices, always show nav items
        showAllNavItems();
    }

    /**
     * Handle GoFundMe link click
     */
    function handleGoFundMeClick(e) {
        const gofundmeLink = document.getElementById('gofundmeLink');
        if (gofundmeLink) {
            gofundmeLink.addEventListener('click', function(event) {
                // Update this URL with your actual GoFundMe link
                const gofundmeUrl = 'https://gofundme.com/solysalud';

                // If href is still placeholder, prevent default and show alert
                if (this.getAttribute('href') === '#gofundme') {
                    event.preventDefault();
                    alert('GoFundMe link coming soon! Please check back later.');
                }
            });
        }
    }

    /**
     * Add keyboard navigation support
     */
    function initKeyboardNav() {
        document.addEventListener('keydown', function(e) {
            // Show nav items when Tab is pressed
            if (e.key === 'Tab') {
                showAllNavItems();
            }
        });
    }

    /**
     * Initialize the application
     */
    function init() {
        // Check for touch device
        if (CONFIG.isTouchDevice) {
            initTouchDevice();
        } else {
            // Add mouse event listeners for non-touch devices
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseleave', handleMouseLeave);
        }

        // Initialize GoFundMe handler
        handleGoFundMeClick();

        // Initialize keyboard navigation
        initKeyboardNav();

        // Log initialization
        console.log('Sol Y Salud - Interactive navigation initialized');
        console.log('Touch device:', CONFIG.isTouchDevice);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
