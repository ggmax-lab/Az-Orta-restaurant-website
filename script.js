// Page load transition
document.body.classList.add('page-loading');
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
    });
});

// Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navOverlay = document.getElementById('navOverlay');

function openMobileMenu() {
    navMenu?.classList.add('active');
    navToggle?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
}

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
}

if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scrolling for anchor links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (navbar) {
        if (scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
        }
    }
    lastScroll = scrollY;
}, { passive: true });

// Home & About: hide scroll indicator when scrolled, show when at top
function setupScrollIndicator(selector) {
    const indicator = document.querySelector(selector);
    if (indicator) {
        function updateScrollIndicator() {
            if (window.scrollY > 80) {
                indicator.classList.add('scroll-indicator-hidden');
            } else {
                indicator.classList.remove('scroll-indicator-hidden');
            }
        }
        updateScrollIndicator();
        window.addEventListener('scroll', updateScrollIndicator, { passive: true });
    }
}
setupScrollIndicator('.scroll-indicator-about');
setupScrollIndicator('.hero .scroll-indicator');

// Scroll reveal animation - unified observer
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
    // Section headers
    document.querySelectorAll('.section-header.reveal').forEach(el => revealObserver.observe(el));
    
    // Trust items
    document.querySelectorAll('.trust-item.reveal').forEach(el => revealObserver.observe(el));
    
    // About page: slide-up reveal (45px, staggered) - Flavori/Osteria 60 style
    document.querySelectorAll('.about .section-header.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about .chef-image-container.reveal, .about .chef-info.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-beginning .about-beginning-header.reveal, .about-beginning .about-beginning-text.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-beginning .about-photo-placeholder.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-story .timeline-item.reveal, .about-story .about-photo-placeholder.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-philosophy .philosophy-content.reveal').forEach((el) => revealObserver.observe(el));
    
    // Menu page uses CSS load animations (menuSlideUp) - skip observer for menu items
    
    // Contact page: hero, items, sidebar
    document.querySelectorAll('.contact-hero-content.reveal').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s';
        revealObserver.observe(el);
    });
    document.querySelectorAll('.contact-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-24px)';
        item.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + i * 0.1}s`;
        revealObserver.observe(item);
    });
    document.querySelectorAll('.social-media-box.reveal, .contact-map-wrap.reveal').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s`;
        revealObserver.observe(el);
    });

    // Menu video: volume toggle (muted by default), fallback on error
    const menuVideo = document.querySelector('.menu-hero-video');
    const menuVolumeBtn = document.getElementById('menuVolumeBtn');
    if (menuVideo) {
        menuVideo.addEventListener('error', () => {
            menuVideo.parentElement?.classList.add('video-fallback');
        });
    }
    if (menuVolumeBtn && menuVideo) {
        const iconMuted = menuVolumeBtn.querySelector('.icon-muted');
        const iconUnmuted = menuVolumeBtn.querySelector('.icon-unmuted');
        const labelMuted = menuVolumeBtn.dataset.labelMuted || 'Unmute';
        const labelUnmuted = menuVolumeBtn.dataset.labelUnmuted || 'Mute';
        menuVolumeBtn.addEventListener('click', () => {
            menuVideo.muted = !menuVideo.muted;
            if (menuVideo.muted) {
                iconMuted?.style.setProperty('display', 'block');
                iconUnmuted?.style.setProperty('display', 'none');
                menuVolumeBtn.setAttribute('aria-label', labelMuted);
            } else {
                iconMuted?.style.setProperty('display', 'none');
                iconUnmuted?.style.setProperty('display', 'block');
                menuVolumeBtn.setAttribute('aria-label', labelUnmuted);
            }
        });
    }
});
