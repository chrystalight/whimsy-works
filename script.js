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
});
