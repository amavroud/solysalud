/**
 * Sol Y Salud - Simple Navigation
 */

(function() {
    'use strict';

    /**
     * Handle GoFundMe placeholder clicks
     */
    function initGoFundMe() {
        const gofundmeLinks = document.querySelectorAll('#gofundmeLink, #gofundmeLinkMobile');

        gofundmeLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    if (this.getAttribute('href') === '#gofundme') {
                        e.preventDefault();
                        alert('GoFundMe link coming soon! Please check back later.');
                    }
                });
            }
        });
    }

    /**
     * Initialize
     */
    function init() {
        initGoFundMe();
        console.log('Sol Y Salud initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
