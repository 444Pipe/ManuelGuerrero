/* ===================================
   MANUEL GUERRERO ARQUITECTOS
   Interactividad
   =================================== */

(function () {
    'use strict';

    /* ===========================
       PRELOADER
       =========================== */
    window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 1800);
    });
    document.body.classList.add('no-scroll');

    /* ===========================
       CUSTOM CURSOR
       =========================== */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (cursor && cursorFollower && window.matchMedia('(min-width: 1025px)').matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverables = document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn, input, textarea, select, .testimonial-btn, .social-link, .dot');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    /* ===========================
       HEADER SCROLL EFFECT
       =========================== */
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scrollProgress');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';

        updateActiveNav();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ===========================
       MOBILE MENU
       =========================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });

    /* ===========================
       ACTIVE NAV ON SCROLL
       =========================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ===========================
       SMOOTH SCROLL
       =========================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    /* ===========================
       SCROLL REVEAL
       =========================== */
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ===========================
       COUNTER ANIMATION
       =========================== */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                let current = 0;
                const duration = 2000;
                const step = target / (duration / 16);

                const update = () => {
                    current += step;
                    if (current < target) {
                        el.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = target + '+';
                    }
                };
                update();
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* ===========================
       PROJECTS FILTER
       =========================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.classList.add('filtering');
                setTimeout(() => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hidden');
                        setTimeout(() => card.classList.remove('filtering'), 50);
                    } else {
                        card.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });

    /* ===========================
       TESTIMONIALS SLIDER
       =========================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    let autoSlideInterval;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetAutoSlide();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 6000);
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    startAutoSlide();

    /* ===========================
       CONTACT FORM
       =========================== */
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            formSuccess.classList.add('show');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        }, 1500);
    });

    /* ===========================
       PARALLAX HERO
       =========================== */
    const heroVisual = document.querySelector('.hero-visual');
    const heroTitle = document.querySelector('.hero-title');

    if (heroVisual && window.matchMedia('(min-width: 1025px)').matches) {
        document.addEventListener('mousemove', (e) => {
            if (window.scrollY > 600) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroVisual.style.transform = `translate(${x}px, ${y}px)`;
            if (heroTitle) {
                heroTitle.style.transform = `translate(${-x * 0.3}px, ${-y * 0.3}px)`;
            }
        });
    }

    /* ===========================
       MAGNETIC BUTTONS
       =========================== */
    const magneticEls = document.querySelectorAll('.btn');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            if (!window.matchMedia('(min-width: 1025px)').matches) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    /* ===========================
       CONSOLE EASTER EGG
       =========================== */
    console.log('%c MANUEL GUERRERO ARQUITECTOS ', 'background: #0a0a0a; color: #fff; font-size: 18px; padding: 10px 20px; letter-spacing: 4px; font-weight: bold;');
    console.log('%c Gerencia & Desarrollo de Proyectos', 'color: #4a4a4a; font-size: 12px; letter-spacing: 2px;');
    console.log('%c 📞 320 247 8954 | 310 669 9840', 'color: #7a7a7a; font-size: 11px;');

})();
