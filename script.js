// =============================================
// WHIMSY WORKS - Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
        lastScrollY = window.scrollY;
    });

    // Smooth scroll for anchor links (backup for browsers without CSS smooth scroll)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Simple fade-in animation on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.character-category, .custom-content, .cta').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Update copyright year automatically
    const copyrightYear = document.querySelector('.footer-bottom p');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        copyrightYear.textContent = copyrightYear.textContent.replace('2024', currentYear);
    }

    // Show filename labels on placeholder images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const src = this.getAttribute('src');
            if (src && src.startsWith('images/')) {
                const filename = src.replace('images/', '');
                const wrapper = document.createElement('div');
                wrapper.className = 'placeholder-image';
                wrapper.innerHTML = `<span class="placeholder-label">${filename}</span>`;
                this.parentNode.insertBefore(wrapper, this);
                wrapper.appendChild(this);
            }
        });
    });

    // Slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slide-arrow.prev');
    const nextBtn = document.querySelector('.slide-arrow.next');

    if (slides.length > 0) {
        let currentSlide = 0;

        function showSlide(index) {
            // Wrap around
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;

            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Show current slide
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        // Arrow navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Auto-advance every 6 seconds
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000);
    }

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCurrent = document.querySelector('.lightbox-current');
    const lightboxTotal = document.querySelector('.lightbox-total');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxTriggers.length > 0) {
        let currentGallery = [];
        let currentIndex = 0;

        function openLightbox(images, startIndex = 0) {
            currentGallery = images;
            currentIndex = startIndex;
            lightboxTotal.textContent = images.length;
            showLightboxImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showLightboxImage(index) {
            if (index < 0) index = currentGallery.length - 1;
            if (index >= currentGallery.length) index = 0;
            currentIndex = index;
            lightboxImage.src = currentGallery[currentIndex];
            lightboxImage.alt = 'Gallery image ' + (currentIndex + 1);
            lightboxCurrent.textContent = currentIndex + 1;
        }

        function nextImage() {
            showLightboxImage(currentIndex + 1);
        }

        function prevImage() {
            showLightboxImage(currentIndex - 1);
        }

        // Click on character images to open lightbox
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const imagesData = this.getAttribute('data-images');
                if (imagesData) {
                    const images = imagesData.split(',').map(img => img.trim());
                    const startIndex = parseInt(this.getAttribute('data-start') || '0');
                    openLightbox(images, startIndex);
                }
            });
        });

        // Close lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);

        // Navigation
        lightboxNext.addEventListener('click', nextImage);
        lightboxPrev.addEventListener('click', prevImage);

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });
    }

    // Expand panel slideshows — built from data-images attribute
    document.querySelectorAll('.expand-gallery[data-images]').forEach(gallery => {
        const srcs = gallery.getAttribute('data-images').split(',').map(s => s.trim()).filter(Boolean);
        if (srcs.length === 0) return;

        const prevBtn = gallery.querySelector('.expand-slide-prev');
        const nextBtn = gallery.querySelector('.expand-slide-next');
        let slides = [];
        let current = 0;

        function showExpandSlide(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            current = index;
        }

        srcs.forEach((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Gallery photo';
            img.className = 'expand-slide' + (i === 0 ? ' active' : '');
            img.addEventListener('click', () => showExpandSlide(current + 1));
            gallery.insertBefore(img, prevBtn);
            slides.push(img);
        });

        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        } else {
            if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); showExpandSlide(current - 1); });
            if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); showExpandSlide(current + 1); });
        }
    });

    // Main card image slideshow
    document.querySelectorAll('.card-slideshow[data-images]').forEach(container => {
        const srcs = container.getAttribute('data-images').split(',').map(s => s.trim()).filter(Boolean);
        if (srcs.length === 0) return;

        let current = 0;
        const slides = srcs.map((src, i) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = container.closest('.character-card').querySelector('h2')?.textContent || 'Character photo';
            img.className = 'card-slide' + (i === 0 ? ' active' : '');
            container.appendChild(img);
            return img;
        });

        function showCardSlide(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            current = index;
        }

        if (slides.length > 1) {
            const prev = document.createElement('button');
            prev.className = 'card-slide-btn card-slide-prev';
            prev.innerHTML = '&#10094;';
            prev.setAttribute('aria-label', 'Previous photo');

            const next = document.createElement('button');
            next.className = 'card-slide-btn card-slide-next';
            next.innerHTML = '&#10095;';
            next.setAttribute('aria-label', 'Next photo');

            container.appendChild(prev);
            container.appendChild(next);

            prev.addEventListener('click', e => { e.stopPropagation(); showCardSlide(current - 1); });
            next.addEventListener('click', e => { e.stopPropagation(); showCardSlide(current + 1); });
            slides.forEach(img => img.addEventListener('click', () => showCardSlide(current + 1)));
        }
    });

    // Princess expand panels
    document.querySelectorAll('.see-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const wrapper = this.closest('.character-card-wrapper');
            const expand = wrapper.querySelector('.character-expand');
            const isOpen = expand.classList.contains('open');

            if (isOpen) {
                expand.style.maxHeight = expand.scrollHeight + 'px';
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    expand.style.maxHeight = '0';
                    expand.style.opacity = '0';
                }));
                setTimeout(() => expand.classList.remove('open'), 550);
                this.textContent = 'See More';
                this.setAttribute('aria-expanded', 'false');
            } else {
                expand.classList.add('open');
                expand.style.maxHeight = expand.scrollHeight + 'px';
                expand.style.opacity = '1';
                this.textContent = 'See Less';
                this.setAttribute('aria-expanded', 'true');
                setTimeout(() => {
                    expand.style.maxHeight = 'none';
                }, 560);
            }
        });
    });

    // Outfit image fan switcher
    document.querySelectorAll('.outfit-section').forEach(section => {
        const singlePreview = section.querySelector('.outfit-preview');
        const buttons = Array.from(section.querySelectorAll('.outfit-btn'));
        if (!singlePreview || buttons.length === 0) return;

        // Build stacked image set
        const stack = document.createElement('div');
        stack.className = 'outfit-preview-stack';
        singlePreview.parentNode.insertBefore(stack, singlePreview);
        singlePreview.remove();

        const images = buttons.map((btn, i) => {
            const img = document.createElement('img');
            img.src = btn.getAttribute('data-img');
            img.alt = btn.textContent.trim() + ' outfit';
            img.className = 'outfit-preview' + (btn.classList.contains('active') ? ' active' : '');
            stack.appendChild(img);
            return img;
        });

        const spread = 84;
        const count = images.length;

        // Set fixed positions once — never move on click
        images.forEach((img, i) => {
            const x = (i - (count - 1) / 2) * spread;
            img.style.transform = `translateX(${x}px)`;
            img.style.zIndex = count - i;
        });

        function activate(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
                img.style.zIndex = i === index ? count + 1 : count - Math.abs(i - index);
            });
            buttons.forEach((btn, i) => btn.classList.toggle('active', i === index));
        }

        const initialActive = buttons.findIndex(b => b.classList.contains('active'));
        activate(initialActive >= 0 ? initialActive : 0);

        buttons.forEach((btn, i) => btn.addEventListener('click', () => activate(i)));
    });

    // Booking form — Web3Forms async submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('booking-submit');
            const successDiv = document.getElementById('booking-success');
            const errorDiv = document.getElementById('booking-error');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            errorDiv.style.display = 'none';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: new FormData(bookingForm)
                });
                const data = await response.json();

                if (data.success) {
                    bookingForm.querySelectorAll('.form-group, .form-row').forEach(el => el.style.display = 'none');
                    submitBtn.style.display = 'none';
                    successDiv.style.display = 'block';
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (err) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Request';
                errorDiv.style.display = 'block';
            }
        });
    }

    // Sparkle cursor trail
    const sparkleChars = ['\u2728', '\u2B50', '\u00B7', '\u2736', '\u2022'];
    const sparkleColors = ['#937288', '#FFA7A0', '#A0CBD4', '#D67A74', '#7192A6'];
    let lastSparkle = 0;
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastSparkle < 50) return;
        lastSparkle = now;
        const el = document.createElement('span');
        el.className = 'sparkle';
        el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        document.body.appendChild(el);
        const dx = (Math.random() - 0.5) * 40 + 'px';
        const dy = (Math.random() * -30 - 10) + 'px';
        el.animate([
            { opacity: 1, transform: `scale(1) translate(0, 0) rotate(0deg)` },
            { opacity: 0, transform: `scale(0.2) translate(${dx}, ${dy}) rotate(180deg)` }
        ], { duration: 700, easing: 'ease-out', fill: 'forwards' }
        ).onfinish = () => el.remove();
    });
});
