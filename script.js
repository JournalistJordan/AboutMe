// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        localStorage.setItem('theme', theme);
        
        // Update toggle icon
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isOpen = this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', isOpen);
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }
}

// Smooth Scrolling and Active Navigation
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        // Add smooth scrolling to navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active navigation on scroll
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    updateActiveNav() {
        const scrollPos = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Navbar Background on Scroll
class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateNavbar());
    }

    updateNavbar() {
        this.navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        fetch(this.form.action, {
            method: 'POST',
            body: new FormData(this.form),
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (res.ok) {
                this.showSuccessMessage();
                this.form.reset();
            } else {
                this.showErrorMessage('Submission failed. Please email jordy3338@gmail.com directly.');
            }
        })
        .catch(() => {
            this.showErrorMessage('Network error. Please check your connection and try again.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        });
    }

    validateForm(data) {
        const errors = [];

        if (!data.name.trim()) {
            errors.push('Name is required');
        }

        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.message.trim()) {
            errors.push('Message is required');
        }

        if (errors.length > 0) {
            this.showErrorMessage(errors.join(', '));
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSuccessMessage() {
        this.showMessage('Thank you! Your message has been sent successfully.', 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element (styled via CSS classes in style.css)
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;
        messageEl.textContent = message;

        // Add message to form
        this.form.appendChild(messageEl);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-subtitle');
        this.texts = [
            'Data Analyst & Insights Specialist',
            'Python & R Programming Expert',
            'Data Visualization Specialist',
            'Machine Learning Enthusiast'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            setTimeout(() => this.type(), 2000); // Start after 2 seconds
        }
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            const remaining = currentText.substring(0, this.currentCharIndex - 1);
            this.element.textContent = remaining || ' ';
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Parallax Effect for Hero Section
class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (this.hero) {
            this.hero.style.transform = `translateY(${rate}px)`;
        }
    }
}

// Project Filter Functionality
class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.handleFilter(button));
        });
    }

    handleFilter(button) {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        this.projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
    }
}

// Skills Progress Animation
class SkillsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        // Observe skills section for animation
        const skillsSection = document.querySelector('.skills-section');
        if (skillsSection) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animated) {
                            this.animateSkills();
                            this.animated = true;
                        }
                    });
                },
                { threshold: 0.3 }
            );
            observer.observe(skillsSection);
        }
    }

    animateSkills() {
        this.skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 200);
        });
    }
}

// Hero Stats Counter Animation
class StatsCounter {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.init();
    }

    init() {
        // Observe hero section for animation
        const heroSection = document.querySelector('.hero-stats');
        if (heroSection) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !this.animated) {
                            this.animateCounters();
                            this.animated = true;
                        }
                    });
                },
                { threshold: 0.5 }
            );
            observer.observe(heroSection);
        }
    }

    animateCounters() {
        this.statNumbers.forEach(stat => {
            const target = stat.textContent;
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const isLessThan = target.includes('<');
            const number = parseFloat(target.replace(/[^0-9.]/g, ''));
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (isLessThan) {
                    displayValue = '< ' + displayValue;
                } else if (isPlus) {
                    displayValue = displayValue + '+';
                } else if (isPercentage) {
                    displayValue = displayValue + '%';
                } else if (number > 1000) {
                    displayValue = displayValue + 'M+';
                }
                
                stat.textContent = displayValue;
            }, 30);
        });
    }
}

// Enhanced Project Interactions
class EnhancedProjectInteractions {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            card.addEventListener('click', () => this.handleClick(card));
        });
    }

    handleMouseEnter(card) {
        const image = card.querySelector('.project-image');
        const icon = image.querySelector('i');
        
        image.style.transform = 'scale(1.05)';
        image.style.transition = 'transform 0.3s ease';
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    handleMouseLeave(card) {
        const image = card.querySelector('.project-image');
        const icon = image.querySelector('i');
        
        image.style.transform = 'scale(1)';
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    handleClick(card) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(212, 175, 55, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Resume Download Tracking
class ResumeTracker {
    constructor() {
        this.resumeLinks = document.querySelectorAll('.resume-card a');
        this.init();
    }

    init() {
        this.resumeLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleDownload(e, link));
        });
    }

    handleDownload(e, link) {
        const format = link.textContent.includes('PDF') ? 'PDF' : 
                      link.textContent.includes('DOCX') ? 'DOCX' : 'Online';
        
        // Show loading state
        const originalText = link.innerHTML;
        link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        link.style.pointerEvents = 'none';
        
        // Simulate processing
        setTimeout(() => {
            link.innerHTML = originalText;
            link.style.pointerEvents = 'auto';
            
            // Show success message
            this.showSuccessMessage(format);
        }, 1000);
    }

    showSuccessMessage(format) {
        const message = document.createElement('div');
        message.className = 'resume-success';
        message.textContent = `${format} ${format === 'Online' ? 'opened' : 'downloaded'} successfully!`;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-green);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
}

// Enhanced Scroll Animations
class EnhancedScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        const animatedElements = document.querySelectorAll(
            '.hero-content, .section-title, .about-content, .project-card, .blog-card, .contact-content, .skill-category, .resume-card, .achievement-item, .timeline-item'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileNavigation();
    new NavigationManager();
    new EnhancedScrollAnimations();
    new NavbarManager();
    new ContactForm();
    new TypingAnimation();
    new ParallaxEffect();
    new ProjectFilter();
    new SkillsAnimation();
    new StatsCounter();
    new EnhancedProjectInteractions();
    new ResumeTracker();

    // Dynamic footer year
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--accent-gold);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    loader.appendChild(spinner);
    document.body.appendChild(loader);
    
    // Remove loader after a short delay
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1000);
});
