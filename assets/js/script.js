document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dynamic Component Loader
    // Finds elements with data-include and fetches the HTML
    const includes = document.querySelectorAll('[data-include]');
    
    Promise.all(Array.from(includes).map(async (el) => {
        const path = el.getAttribute('data-include');
        try {
            const response = await fetch(path);
            if (response.ok) {
                el.innerHTML = await response.text();
            } else {
                console.error(`Failed to load ${path}: ${response.statusText}`);
            }
        } catch (err) {
            console.error(`Error fetching ${path}:`, err);
        }
    })).then(() => {
        // Run scroll setup AFTER components (like navbar) are loaded into the DOM
        setupSmoothScrolling();
    });

    // 2. Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });

    // 3. Smooth Scrolling Logic
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Only prevent default if we are on the home page and clicking a hash link
                const href = this.getAttribute('href');
                const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
                
                if (isHomePage && href.includes('#')) {
                    e.preventDefault();
                    const targetId = href.substring(href.indexOf('#'));
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
});