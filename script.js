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

// Navbar scroll effect – keep charcoal bar; stronger shadow when scrolled
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollY = window.scrollY;
    
    if (navbar) {
        if (scrollY > 50) {
            navbar.style.background = 'rgba(20, 20, 20, 0.98)';
            navbar.style.boxShadow = '0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 32px rgba(0, 0, 0, 0.35)';
        } else {
            navbar.style.background = 'rgba(20, 20, 20, 0.97)';
            navbar.style.boxShadow = '0 1px 0 rgba(255, 255, 255, 0.06), 0 8px 32px rgba(20, 20, 20, 0.25)';
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

// Sticky View Menu (mobile): hidden at top; show only when hero View Menu button has scrolled out of view
function setupStickyCtaWhenPastHeroButton() {
    const heroMenuBtn = document.querySelector('.hero .btn-hero-menu');
    const stickyCta = document.querySelector('.sticky-cta-mobile');
    if (!heroMenuBtn || !stickyCta) return;

    stickyCta.classList.remove('sticky-cta-visible');

    function updateStickyCta() {
        const rect = heroMenuBtn.getBoundingClientRect();
        if (rect.top < 0) {
            stickyCta.classList.add('sticky-cta-visible');
        } else {
            stickyCta.classList.remove('sticky-cta-visible');
        }
    }
    updateStickyCta();
    window.addEventListener('scroll', updateStickyCta, { passive: true });
    window.addEventListener('resize', updateStickyCta);
}
document.addEventListener('DOMContentLoaded', setupStickyCtaWhenPastHeroButton);

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
    document.querySelectorAll('.about-beginning .about-collage-center.reveal, .about-beginning .about-collage-item.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-story .timeline-item.reveal, .about-story .about-photo-placeholder.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-philosophy .philosophy-content.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-stats .about-stat.reveal').forEach((el) => revealObserver.observe(el));
    document.querySelectorAll('.about-values .about-values-header.reveal, .about-values .about-value-card.reveal').forEach((el) => revealObserver.observe(el));
    
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

    // About collage: click to view image in circular lightbox
    const collageLightbox = document.getElementById('aboutCollageLightbox');
    const collageLightboxImg = collageLightbox?.querySelector('.about-collage-lightbox-img');
    const collageLightboxClose = collageLightbox?.querySelector('.about-collage-lightbox-close');
    const collageContainer = document.querySelector('.about-opening-collage--circle');

    function openCollageLightbox(src, alt) {
        if (!collageLightbox || !collageLightboxImg) return;
        collageLightboxImg.src = src;
        collageLightboxImg.alt = alt || '';
        collageLightbox.removeAttribute('hidden');
        requestAnimationFrame(() => collageLightbox.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
    }

    function closeCollageLightbox() {
        if (!collageLightbox) return;
        collageLightbox.classList.remove('is-open');
        collageLightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    if (collageContainer && collageLightbox) {
        collageContainer.addEventListener('click', (e) => {
            const clickable = e.target.closest('.about-collage-center, .about-collage-item');
            if (!clickable) return;
            const img = clickable.querySelector('img');
            if (img?.src) openCollageLightbox(img.src, img.alt);
        });
        collageContainer.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const clickable = e.target.closest('.about-collage-center, .about-collage-item');
            if (!clickable) return;
            e.preventDefault();
            const img = clickable.querySelector('img');
            if (img?.src) openCollageLightbox(img.src, img.alt);
        });
    }
    if (collageLightboxClose) collageLightboxClose.addEventListener('click', closeCollageLightbox);
    if (collageLightbox) {
        collageLightbox.addEventListener('click', (e) => {
            if (e.target === collageLightbox) closeCollageLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && collageLightbox?.classList.contains('is-open')) closeCollageLightbox();
    });

    // Menu images: click to view larger
    const menuImageLightbox = document.getElementById('menuImageLightbox');
    const menuImageLightboxImg = menuImageLightbox?.querySelector('.menu-image-lightbox-img');
    const menuImageLightboxClose = menuImageLightbox?.querySelector('.menu-image-lightbox-close');
    const menuImages = document.querySelectorAll('.menu-item-img, .menu-category-img');

    function openMenuImageLightbox(src, alt) {
        if (!menuImageLightbox || !menuImageLightboxImg) return;
        menuImageLightboxImg.src = src;
        menuImageLightboxImg.alt = alt || '';
        menuImageLightbox.removeAttribute('hidden');
        requestAnimationFrame(() => menuImageLightbox.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
    }

    function closeMenuImageLightbox() {
        if (!menuImageLightbox) return;
        menuImageLightbox.classList.remove('is-open');
        menuImageLightbox.setAttribute('hidden', '');
        document.body.style.overflow = '';
    }

    if (menuImages.length > 0 && menuImageLightbox) {
        menuImages.forEach(img => {
            img.addEventListener('click', () => {
                if (img.src) openMenuImageLightbox(img.src, img.alt);
            });
        });
    }
    if (menuImageLightboxClose) menuImageLightboxClose.addEventListener('click', closeMenuImageLightbox);
    if (menuImageLightbox) {
        menuImageLightbox.addEventListener('click', (e) => {
            if (e.target === menuImageLightbox) closeMenuImageLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuImageLightbox?.classList.contains('is-open')) closeMenuImageLightbox();
    });
});
