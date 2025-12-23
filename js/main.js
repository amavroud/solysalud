/**
 * Sol Y Salud - Lava Lamp Sun Animation
 * Fluid, organic ray animations that follow cursor/touch movement
 */

(function() {
    'use strict';

    // Ray configuration - base positions for each ray
    const rayConfigs = [
        { angle: 0, baseLength: 70, cx: 200, cy: 120 },
        { angle: 45, baseLength: 65, cx: 255, cy: 135 },
        { angle: 90, baseLength: 70, cx: 280, cy: 200 },
        { angle: 135, baseLength: 65, cx: 255, cy: 265 },
        { angle: 180, baseLength: 70, cx: 200, cy: 280 },
        { angle: 225, baseLength: 65, cx: 145, cy: 265 },
        { angle: 270, baseLength: 70, cx: 120, cy: 200 },
        { angle: 315, baseLength: 65, cx: 145, cy: 135 },
        { angle: 22.5, baseLength: 55, cx: 225, cy: 125 },
        { angle: 67.5, baseLength: 55, cx: 275, cy: 175 },
        { angle: 112.5, baseLength: 55, cx: 275, cy: 225 },
        { angle: 157.5, baseLength: 55, cx: 225, cy: 275 }
    ];

    // Animation state
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let time = 0;
    let animationId = null;

    // Sun elements
    let desktopSun = null;
    let mobileSun = null;
    let contactSun = null;
    let desktopRays = [];
    let mobileRays = [];
    let contactRays = [];

    /**
     * Initialize the lava lamp sun animation
     */
    function initLavaSun() {
        // Desktop sun
        desktopSun = document.querySelector('.lava-sun');
        if (desktopSun) {
            desktopRays = Array.from(desktopSun.querySelectorAll('.lava-ray'));
        }

        // Mobile sun
        mobileSun = document.querySelector('.lava-sun-mobile');
        if (mobileSun) {
            mobileRays = Array.from(mobileSun.querySelectorAll('.lava-ray-mobile'));
        }

        // Contact page sun
        contactSun = document.querySelector('.lava-sun-contact');
        if (contactSun) {
            contactRays = Array.from(contactSun.querySelectorAll('.lava-ray-contact'));
        }

        if (!desktopSun && !mobileSun && !contactSun) return;

        // Set up mouse/touch tracking
        setupInputTracking();

        // Start animation loop
        animate();

        console.log('Lava sun initialized - Desktop rays:', desktopRays.length, 'Mobile rays:', mobileRays.length, 'Contact rays:', contactRays.length);
    }

    /**
     * Set up mouse and touch event tracking
     */
    function setupInputTracking() {
        // Get the active sun element for position calculation
        const getActiveSun = () => {
            // Contact page sun takes priority if it exists
            if (contactSun) {
                return contactSun;
            }
            if (window.innerWidth <= 768) {
                return mobileSun;
            }
            return desktopSun;
        };

        // Mouse move
        document.addEventListener('mousemove', (e) => {
            const sun = getActiveSun();
            if (!sun) return;

            const rect = sun.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            targetMouseX = (e.clientX - centerX) / (window.innerWidth / 2);
            targetMouseY = (e.clientY - centerY) / (window.innerHeight / 2);

            targetMouseX = Math.max(-1, Math.min(1, targetMouseX));
            targetMouseY = Math.max(-1, Math.min(1, targetMouseY));
        });

        // Touch move for mobile
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const sun = getActiveSun();
                if (!sun) return;

                const rect = sun.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                targetMouseX = (touch.clientX - centerX) / (window.innerWidth / 2);
                targetMouseY = (touch.clientY - centerY) / (window.innerHeight / 2);

                targetMouseX = Math.max(-1, Math.min(1, targetMouseX));
                targetMouseY = Math.max(-1, Math.min(1, targetMouseY));
            }
        }, { passive: true });

        // Touch start - respond immediately
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const sun = getActiveSun();
                if (!sun) return;

                const rect = sun.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                targetMouseX = (touch.clientX - centerX) / (window.innerWidth / 2);
                targetMouseY = (touch.clientY - centerY) / (window.innerHeight / 2);

                targetMouseX = Math.max(-1, Math.min(1, targetMouseX));
                targetMouseY = Math.max(-1, Math.min(1, targetMouseY));
            }
        }, { passive: true });

        // Reset on mouse/touch end
        document.addEventListener('mouseleave', () => {
            targetMouseX = 0;
            targetMouseY = 0;
        });

        document.addEventListener('touchend', () => {
            // Slowly return to center
            targetMouseX = 0;
            targetMouseY = 0;
        }, { passive: true });
    }

    /**
     * Generate a fluid bezier path for a ray
     */
    function generateRayPath(config, index, mouseInfluence, isMobile) {
        const { angle, baseLength } = config;
        const angleRad = (angle - 90) * Math.PI / 180;

        // Base wave animation (lava lamp effect)
        const waveSpeed = 0.0008 + (index % 3) * 0.0002;
        const wavePhase = index * 0.5;
        const wave1 = Math.sin(time * waveSpeed + wavePhase) * 0.3;
        const wave2 = Math.sin(time * waveSpeed * 1.3 + wavePhase + 1) * 0.2;
        const wave3 = Math.cos(time * waveSpeed * 0.7 + wavePhase) * 0.15;

        const waveOffset = wave1 + wave2 + wave3;

        // Calculate mouse influence on this ray
        const mouseAngle = Math.atan2(mouseY, mouseX);
        const angleDiff = Math.abs(angleRad - mouseAngle);
        const normalizedAngleDiff = Math.min(angleDiff, Math.PI * 2 - angleDiff) / Math.PI;

        // Rays pointing toward cursor extend more
        const cursorInfluence = (1 - normalizedAngleDiff) * mouseInfluence * 0.5;

        // Calculate dynamic length
        const lengthMultiplier = 1 + waveOffset * 0.3 + cursorInfluence;
        const dynamicLength = baseLength * lengthMultiplier;

        // Calculate control points for bezier curve
        const startX = 200 + Math.cos(angleRad) * 80;
        const startY = 200 + Math.sin(angleRad) * 80;

        const endX = 200 + Math.cos(angleRad) * (80 + dynamicLength);
        const endY = 200 + Math.sin(angleRad) * (80 + dynamicLength);

        // Perpendicular wave for fluid motion
        const perpAngle = angleRad + Math.PI / 2;
        const waveAmplitude = 15 + wave2 * 20;
        const sideWave = Math.sin(time * waveSpeed * 2 + wavePhase) * waveAmplitude;

        // Control points with fluid motion
        const cp1X = startX + Math.cos(angleRad) * dynamicLength * 0.3 + Math.cos(perpAngle) * sideWave;
        const cp1Y = startY + Math.sin(angleRad) * dynamicLength * 0.3 + Math.sin(perpAngle) * sideWave;

        // Width variation for organic feel
        const baseWidth = 20 + index % 4 * 3;
        const widthWave = Math.sin(time * waveSpeed * 1.5 + wavePhase + 2) * 8;
        const rayWidth = baseWidth + widthWave;

        // Generate path with variable width (teardrop shape)
        const perpOffsetStart = rayWidth * 0.6;
        const perpOffsetEnd = rayWidth * 0.15;

        const s1X = startX + Math.cos(perpAngle) * perpOffsetStart;
        const s1Y = startY + Math.sin(perpAngle) * perpOffsetStart;
        const s2X = startX - Math.cos(perpAngle) * perpOffsetStart;
        const s2Y = startY - Math.sin(perpAngle) * perpOffsetStart;

        const e1X = endX + Math.cos(perpAngle) * perpOffsetEnd;
        const e1Y = endY + Math.sin(perpAngle) * perpOffsetEnd;
        const e2X = endX - Math.cos(perpAngle) * perpOffsetEnd;
        const e2Y = endY - Math.sin(perpAngle) * perpOffsetEnd;

        return `M ${s1X},${s1Y}
                Q ${cp1X + Math.cos(perpAngle) * perpOffsetStart * 0.5},${cp1Y + Math.sin(perpAngle) * perpOffsetStart * 0.5}
                  ${e1X},${e1Y}
                L ${e2X},${e2Y}
                Q ${cp1X - Math.cos(perpAngle) * perpOffsetStart * 0.5},${cp1Y - Math.sin(perpAngle) * perpOffsetStart * 0.5}
                  ${s2X},${s2Y}
                Z`;
    }

    /**
     * Update sun glow based on animation state
     */
    function updateGlow(sunElement, isMobile, customSuffix) {
        if (!sunElement) return;

        // Determine suffix for element selection
        let suffix = '';
        if (customSuffix) {
            suffix = customSuffix;
        } else if (isMobile) {
            suffix = '-mobile';
        }

        const glowInner = sunElement.querySelector(`.sun-glow-inner${suffix}`);
        const glowOuter = sunElement.querySelector('.sun-glow-outer');
        const sunCore = sunElement.querySelector(`.sun-core${suffix}`);

        if (glowInner) {
            const pulseScale = 1 + Math.sin(time * 0.001) * 0.05;
            glowInner.setAttribute('r', 95 * pulseScale);
            glowInner.style.opacity = 0.3 + Math.sin(time * 0.0015) * 0.1;
        }

        if (glowOuter) {
            const outerPulse = 40 + Math.sin(time * 0.0008) * 10;
            glowOuter.setAttribute('stroke-width', outerPulse);
        }

        if (sunCore) {
            const corePulse = 1 + Math.sin(time * 0.0012) * 0.02;
            sunCore.style.transform = `scale(${corePulse})`;
            sunCore.style.transformOrigin = 'center';
        }
    }

    /**
     * Main animation loop
     */
    function animate() {
        time = performance.now();

        // Smooth mouse interpolation (lava lamp smoothness)
        const smoothing = 0.03;
        mouseX += (targetMouseX - mouseX) * smoothing;
        mouseY += (targetMouseY - mouseY) * smoothing;

        // Calculate mouse influence strength
        const mouseDistance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const mouseInfluence = Math.min(mouseDistance, 1);

        // Update desktop rays
        desktopRays.forEach((ray, index) => {
            if (rayConfigs[index]) {
                const path = generateRayPath(rayConfigs[index], index, mouseInfluence, false);
                ray.setAttribute('d', path);

                const opacityWave = 0.7 + Math.sin(time * 0.001 + index * 0.5) * 0.3;
                ray.style.opacity = opacityWave;
            }
        });

        // Update mobile rays
        mobileRays.forEach((ray, index) => {
            if (rayConfigs[index]) {
                const path = generateRayPath(rayConfigs[index], index, mouseInfluence, true);
                ray.setAttribute('d', path);

                const opacityWave = 0.7 + Math.sin(time * 0.001 + index * 0.5) * 0.3;
                ray.style.opacity = opacityWave;
            }
        });

        // Update contact page rays
        contactRays.forEach((ray, index) => {
            if (rayConfigs[index]) {
                const path = generateRayPath(rayConfigs[index], index, mouseInfluence, false);
                ray.setAttribute('d', path);

                const opacityWave = 0.7 + Math.sin(time * 0.001 + index * 0.5) * 0.3;
                ray.style.opacity = opacityWave;
            }
        });

        // Update glow effects
        updateGlow(desktopSun, false);
        updateGlow(mobileSun, true);
        updateGlow(contactSun, false, '-contact');

        animationId = requestAnimationFrame(animate);
    }

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
     * Check for reduced motion preference
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Initialize
     */
    function init() {
        initGoFundMe();

        if (!prefersReducedMotion()) {
            initLavaSun();
        }

        console.log('Sol Y Salud initialized');
    }

    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
