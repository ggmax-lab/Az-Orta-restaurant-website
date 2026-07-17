// Page load transition
document.body.classList.add('page-loading');
let pageRevealComplete = false;

function revealPage() {
    if (pageRevealComplete) return;
    pageRevealComplete = true;
    requestAnimationFrame(() => {
        document.body.classList.remove('page-loading');
        document.body.classList.add('page-loaded');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealPage, { once: true });
} else {
    revealPage();
}
window.addEventListener('load', revealPage, { once: true });
setTimeout(revealPage, 1200);

// Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navOverlay = document.getElementById('navOverlay');
const navToggleOpenLabel = navToggle?.getAttribute('aria-label') || 'Open menu';
const navToggleCloseLabel = document.documentElement.lang === 'tr' ? 'Menüyü kapat' : 'Close menu';

function openMobileMenu() {
    navMenu?.classList.add('active');
    navToggle?.classList.add('active');
    navToggle?.setAttribute('aria-expanded', 'true');
    navToggle?.setAttribute('aria-label', navToggleCloseLabel);
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    navMenu?.classList.remove('active');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', navToggleOpenLabel);
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

// One-page nav: highlight the current homepage section while scrolling
function setupOnePageNavHighlight() {
    const sectionLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    if (!sectionLinks.length) return;

    const linkedSections = sectionLinks
        .map(link => {
            const id = link.getAttribute('href');
            return id ? { link, section: document.querySelector(id) } : null;
        })
        .filter(item => item?.section);

    if (!linkedSections.length) return;

    function updateActiveLink() {
        const offset = 130;
        let activeItem = linkedSections[0];

        linkedSections.forEach(item => {
            const top = item.section.getBoundingClientRect().top;
            if (top <= offset) {
                activeItem = item;
            }
        });

        sectionLinks.forEach(link => link.classList.remove('active'));
        activeItem.link.classList.add('active');
    }

    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
}
setupOnePageNavHighlight();

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

// Sticky View Menu (mobile): show after hero CTA leaves, hide again once menu is reached
function setupStickyCtaWhenPastHeroButton() {
    const heroMenuBtn = document.querySelector('.hero .btn-hero-menu');
    const stickyCta = document.querySelector('.sticky-cta-mobile');
    const menuSection = document.querySelector('#home-menu');
    if (!stickyCta) return;

    stickyCta.classList.remove('sticky-cta-visible');

    if (!heroMenuBtn) {
        if (stickyCta.classList.contains('sticky-cta-mobile-page')) {
            stickyCta.classList.add('sticky-cta-visible');
        }
        return;
    }

    function updateStickyCta() {
        const heroBtnRect = heroMenuBtn.getBoundingClientRect();
        const menuRect = menuSection?.getBoundingClientRect();
        const hasScrolledPastHeroButton = heroBtnRect.top < 0;
        const hasReachedMenu = menuRect ? menuRect.top <= window.innerHeight : false;

        if (hasScrolledPastHeroButton && !hasReachedMenu) {
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

// Allergen emoji badges should be meaningful for assistive tech too.
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.allergen-badge[title]').forEach(badge => {
        badge.setAttribute('role', 'img');
        badge.setAttribute('aria-label', badge.getAttribute('title'));
    });
});

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

    // Homepage redesigned sections
    document.querySelectorAll('.home-section-header.reveal, .instagram-widget-placeholder.reveal, .home-instagram-cta.reveal, .home-chef-feature.reveal, .home-story-panel.reveal, .chef-scroll-media-inner.reveal, .chef-block.reveal, .home-map-card.reveal').forEach(el => revealObserver.observe(el));
    
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

    // Allergen chart: open image in an in-page lightbox with a clear close button
    const allergenImageLinks = document.querySelectorAll('.allergen-image-link');
    let allergenLightbox = document.getElementById('allergenImageLightbox');

    if (allergenImageLinks.length > 0 && !allergenLightbox) {
        allergenLightbox = document.createElement('div');
        allergenLightbox.id = 'allergenImageLightbox';
        allergenLightbox.className = 'allergen-lightbox';
        allergenLightbox.setAttribute('role', 'dialog');
        allergenLightbox.setAttribute('aria-modal', 'true');
        allergenLightbox.setAttribute('aria-label', 'Allergen list image');
        allergenLightbox.hidden = true;
        allergenLightbox.innerHTML = `
            <button type="button" class="allergen-lightbox-close" aria-label="Close allergen list">&times;</button>
            <div class="allergen-lightbox-inner">
                <img alt="Az Orta allergen list" class="allergen-lightbox-img">
            </div>
        `;
        document.body.appendChild(allergenLightbox);
    }

    const allergenLightboxImg = allergenLightbox?.querySelector('.allergen-lightbox-img');
    const allergenLightboxClose = allergenLightbox?.querySelector('.allergen-lightbox-close');

    function openAllergenLightbox(src) {
        if (!allergenLightbox || !allergenLightboxImg) return;
        allergenLightboxImg.src = src;
        allergenLightbox.hidden = false;
        requestAnimationFrame(() => allergenLightbox.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
    }

    function closeAllergenLightbox() {
        if (!allergenLightbox) return;
        allergenLightbox.classList.remove('is-open');
        allergenLightbox.hidden = true;
        document.body.style.overflow = '';
    }

    allergenImageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;
            e.preventDefault();
            openAllergenLightbox(href);
        });
    });

    if (allergenLightboxClose) allergenLightboxClose.addEventListener('click', closeAllergenLightbox);
    if (allergenLightbox) {
        allergenLightbox.addEventListener('click', (e) => {
            if (e.target === allergenLightbox) closeAllergenLightbox();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && allergenLightbox?.classList.contains('is-open')) closeAllergenLightbox();
    });
});

// Konum (location) modal – translucent centered card, closable via X / click-outside / Esc, focus-trapped
(function setupKonumModal() {
    const modal = document.getElementById('konumModal');
    const triggers = document.querySelectorAll('[data-konum-open]');
    if (!modal || !triggers.length) return;

    const closeEls = modal.querySelectorAll('[data-konum-close]');
    const googleLink = modal.querySelector('#konumGoogleLink');
    const mapLoadButton = modal.querySelector('[data-map-load]');

    // Reuse the Google Maps link already present in the footer address (avoid duplicating the URL)
    const footerMapLink = document.querySelector('.footer-map-address');
    if (googleLink && footerMapLink) {
        const footerHref = footerMapLink.getAttribute('href');
        if (footerHref) googleLink.setAttribute('href', footerHref);
    }

    if (mapLoadButton) {
        mapLoadButton.addEventListener('click', () => {
            const mapContainer = mapLoadButton.closest('.konum-modal-map');
            const mapSrc = mapLoadButton.dataset.mapSrc;
            if (!mapContainer || !mapSrc) return;

            const iframe = document.createElement('iframe');
            iframe.title = mapLoadButton.dataset.mapTitle || 'Google Map';
            iframe.src = mapSrc;
            iframe.referrerPolicy = 'no-referrer';
            iframe.setAttribute('allowfullscreen', '');
            mapContainer.replaceChildren(iframe);
            closeEls[0]?.focus();
        }, { once: true });
    }

    let lastFocused = null;

    function getFocusable() {
        return Array.from(modal.querySelectorAll(
            'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
    }

    function openModal(trigger) {
        lastFocused = trigger || document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            modal.classList.add('is-open');
            const focusables = getFocusable();
            (focusables[0] || modal).focus();
        });
    }

    function closeModal() {
        if (!modal.classList.contains('is-open') && modal.hidden) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        const finish = () => { modal.hidden = true; };
        const onEnd = (e) => {
            if (e.target !== modal) return;
            modal.removeEventListener('transitionend', onEnd);
            finish();
        };
        modal.addEventListener('transitionend', onEnd);
        setTimeout(() => {
            if (!modal.classList.contains('is-open')) finish();
        }, 320);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    triggers.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn);
    }));

    closeEls.forEach(el => el.addEventListener('click', closeModal));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') {
            closeModal();
            return;
        }
        if (e.key === 'Tab') {
            const focusables = getFocusable();
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
})();

/* Chef story: pin the photo + scrub bio text with page scroll, then release to footer */
(function initChefScrollScrub() {
    const section = document.querySelector('.chef-scroll-section');
    if (!section) return;

    const pin = section.querySelector('.chef-scroll-pin');
    const text = section.querySelector('.chef-scroll-text');
    const viewport = section.querySelector('.chef-scroll-text-viewport');
    if (!pin || !text || !viewport) return;

    const mq = window.matchMedia('(max-width: 968px)');
    const STICKY_TOP = 92;
    let frame = 0;

    function desktopEnabled() {
        return !mq.matches;
    }

    function measureAndPaint() {
        if (!desktopEnabled()) {
            section.style.height = '';
            text.style.transform = '';
            section.classList.remove('is-complete');
            return;
        }

        section.querySelectorAll('.chef-block.reveal').forEach((el) => el.classList.add('visible'));

        const overflow = Math.max(0, text.scrollHeight - viewport.clientHeight);
        const pinH = pin.offsetHeight;
        section.style.height = `${Math.round(pinH + overflow)}px`;

        const distance = Math.max(1, section.offsetHeight - pinH);
        const scrolled = Math.min(distance, Math.max(0, STICKY_TOP - section.getBoundingClientRect().top));
        const progress = scrolled / distance;
        text.style.transform = `translate3d(0, ${-overflow * progress}px, 0)`;
        section.classList.toggle('is-complete', progress >= 0.98);
    }

    function onScrollOrResize() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measureAndPaint);
    }

    measureAndPaint();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onScrollOrResize);
    } else if (typeof mq.addListener === 'function') {
        mq.addListener(onScrollOrResize);
    }
    window.addEventListener('load', onScrollOrResize, { once: true });
})();
