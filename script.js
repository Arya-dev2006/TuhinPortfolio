// ===========================
// GSAP Animations & Setup
// ===========================

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===========================
// Mouse Follower with Delay - Video Editor Theme
// ===========================

// Create mouse follower elements
const createMouseFollower = () => {
    // Main follower - play button style
    const follower = document.createElement('div');
    follower.className = 'mouse-follower';
    document.body.appendChild(follower);

    // Play button inner circle
    const playButton = document.createElement('div');
    playButton.className = 'mouse-follower-play';
    follower.appendChild(playButton);

    // Film strip decoration
    const filmStrip = document.createElement('div');
    filmStrip.className = 'mouse-follower-film';
    document.body.appendChild(filmStrip);

    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let followerFilmX = 0;
    let followerFilmY = 0;
    let rotation = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animation loop with delay
    const animateFollower = () => {
        // Main follower with delay
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;

        // Film strip with more delay
        followerFilmX += (mouseX - followerFilmX) * 0.08;
        followerFilmY += (mouseY - followerFilmY) * 0.08;

        // Rotation animation
        rotation += 2;

        // Apply positions
        gsap.set(follower, {
            x: followerX - 20,
            y: followerY - 20
        });

        gsap.set(filmStrip, {
            x: followerFilmX - 15,
            y: followerFilmY - 15,
            rotation: rotation
        });

        requestAnimationFrame(animateFollower);
    };

    animateFollower();

    // Change follower style on interactive element hover
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .filter-btn, .social-link, a, button, .portfolio-item, .service-card, .blog-card');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            // Scale up main follower
            gsap.to(follower, {
                scale: 1.4,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Highlight play button
            gsap.to(playButton, {
                scale: 0.7,
                background: '#ec4899',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
                duration: 0.3
            });

            // Scale film strip
            gsap.to(filmStrip, {
                scale: 1.3,
                opacity: 1,
                duration: 0.3
            });
        });

        element.addEventListener('mouseleave', () => {
            // Reset main follower
            gsap.to(follower, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Reset play button
            gsap.to(playButton, {
                scale: 1,
                background: '#ffffff',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)',
                duration: 0.3
            });

            // Reset film strip
            gsap.to(filmStrip, {
                scale: 1,
                opacity: 0.7,
                duration: 0.3
            });
        });
    });
};

// Initialize mouse follower when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(pointer:fine)').matches) {
        createMouseFollower();
    }
});

// ===========================
// Navigation Menu Toggle
// ===========================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Close mobile menu
        navMenu.classList.remove('active');
        
        // Handle smooth scroll to section
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = 80;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===========================
// Video Player Modal
// ===========================

const videoModal = document.getElementById('videoModal');
const closeVideoModal = document.getElementById('closeVideoModal');
const portfolioVideo = document.getElementById('portfolioVideo');
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const videoProgressBar = document.querySelector('.video-progress-bar');
const videoProgressFill = document.querySelector('.video-progress-fill');
const videoProgressHandle = document.querySelector('.video-progress-handle');
const currentTimeDisplay = document.querySelector('.current-time');
const durationTimeDisplay = document.querySelector('.duration-time');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');

// Portfolio video data
const portfolioVideos = {
    commercial: {
        title: 'Brand Campaign - TechStart',
        description: '30-second commercial for a tech startup featuring motion graphics and product demonstrations',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4'
    },
    documentary: {
        title: 'Wildlife Documentary - "Voices of Nature"',
        description: '45-minute documentary featuring nature footage with professional color grading and sound design',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4'
    },
    music: {
        title: 'Indie Music Video - "Neon Dreams"',
        description: 'Visually stunning music video with creative color grading and motion graphics',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4'
    },
    social: {
        title: 'Social Reels Collection',
        description: 'Viral-worthy short-form content optimized for social platforms',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4'
    }
};

// Open video modal when portfolio item is clicked
document.querySelectorAll('.portfolio-item').forEach(item => {
    const overlay = item.querySelector('.portfolio-overlay');
    
    overlay.style.cursor = 'pointer';
    overlay.addEventListener('click', () => {
        // Check if item has a direct video file specified
        const videoFile = item.getAttribute('data-video');
        
        if (videoFile) {
            // Use the direct video file
            portfolioVideo.src = videoFile;
            const itemTitle = item.querySelector('.portfolio-info h3').textContent;
            const itemDesc = item.querySelector('.portfolio-info p').textContent;
            videoTitle.textContent = itemTitle;
            videoDescription.textContent = itemDesc;
        } else {
            // Fall back to category-based video data
            const category = item.getAttribute('data-category');
            const videoData = portfolioVideos[category] || portfolioVideos.commercial;
            
            portfolioVideo.src = videoData.url;
            videoTitle.textContent = videoData.title;
            videoDescription.textContent = videoData.description;
        }
        
        // Show modal with animation
        videoModal.style.display = 'flex';
        setTimeout(() => {
            videoModal.classList.add('active');
        }, 10);
        
        document.body.style.overflow = 'hidden';
        
        // Reset video
        portfolioVideo.currentTime = 0;
        
        // Remove old listener if exists
        portfolioVideo.removeEventListener('loadedmetadata', updateDuration);
        
        // Add listener for metadata
        portfolioVideo.addEventListener('loadedmetadata', updateDuration, { once: true });
        
        // Play video
        portfolioVideo.play();
        updatePlayPauseButton();
    });
});

// Format time display (MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update play/pause button icon
function updatePlayPauseButton() {
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    
    if (portfolioVideo.paused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
}

// Update duration display
function updateDuration() {
    durationTimeDisplay.textContent = formatTime(portfolioVideo.duration);
}

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (portfolioVideo.paused) {
        portfolioVideo.play();
    } else {
        portfolioVideo.pause();
    }
    updatePlayPauseButton();
});

// Update on play/pause
portfolioVideo.addEventListener('play', updatePlayPauseButton);
portfolioVideo.addEventListener('pause', updatePlayPauseButton);

// Mute button
muteBtn.addEventListener('click', () => {
    portfolioVideo.muted = !portfolioVideo.muted;
    const volumeHigh = muteBtn.querySelector('.volume-high');
    const volumeMute = muteBtn.querySelector('.volume-mute');
    
    if (portfolioVideo.muted) {
        volumeHigh.style.display = 'none';
        volumeMute.style.display = 'block';
    } else {
        volumeHigh.style.display = 'block';
        volumeMute.style.display = 'none';
    }
});

// Update progress bar (throttled for performance)
let updateProgressTimeout;
portfolioVideo.addEventListener('timeupdate', () => {
    clearTimeout(updateProgressTimeout);
    updateProgressTimeout = setTimeout(() => {
        const percent = (portfolioVideo.currentTime / portfolioVideo.duration) * 100;
        videoProgressFill.style.width = `${percent}%`;
        videoProgressHandle.style.left = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(portfolioVideo.currentTime);
    }, 0);
});

// Click on progress bar to seek
videoProgressBar.addEventListener('click', (e) => {
    if (!portfolioVideo.duration) return;
    const rect = videoProgressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    portfolioVideo.currentTime = percent * portfolioVideo.duration;
}, false);

// Fullscreen button
fullscreenBtn.addEventListener('click', () => {
    const videoPlayerContainer = document.querySelector('.video-player-container');
    
    if (videoPlayerContainer.requestFullscreen) {
        videoPlayerContainer.requestFullscreen();
    } else if (videoPlayerContainer.webkitRequestFullscreen) {
        videoPlayerContainer.webkitRequestFullscreen();
    } else if (videoPlayerContainer.mozRequestFullScreen) {
        videoPlayerContainer.mozRequestFullScreen();
    } else if (videoPlayerContainer.msRequestFullscreen) {
        videoPlayerContainer.msRequestFullscreen();
    }
});

// Close modal button
closeVideoModal.addEventListener('click', closeVideoPlayerModal);

// Close on background click
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoPlayerModal();
    }
});

// Close video player modal function
function closeVideoPlayerModal() {
    videoModal.classList.remove('active');
    portfolioVideo.pause();
    document.body.style.overflow = 'auto';
    
    // Delay hiding the modal to allow animation
    setTimeout(() => {
        if (!videoModal.classList.contains('active')) {
            videoModal.style.display = 'none';
        }
    }, 300);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoPlayerModal();
    }
});

// ===========================
// Hero Section Animations
// ===========================

gsap.timeline()
    .from('.hero-text h1', {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    })
    .from('.hero-subtitle', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-buttons', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        ease: 'power3.out'
    }, '-=0.6');

// Animate circle in hero visual
gsap.to('.circle-animation', {
    duration: 3,
    rotation: 360,
    repeat: -1,
    ease: 'none'
});

// ===========================
// Section Title Animations
// ===========================

const sectionTitles = document.querySelectorAll('.section-title');

sectionTitles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
            markers: false
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    });
});

// ===========================
// About Section Animations
// ===========================

gsap.from('.about-text h3', {
    scrollTrigger: {
        trigger: '.about-text h3',
        start: 'top 80%'
    },
    duration: 0.8,
    opacity: 0,
    x: -50,
    ease: 'power3.out'
});

gsap.from('.about-text p', {
    scrollTrigger: {
        trigger: '.about-text p',
        start: 'top 80%'
    },
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.1,
    ease: 'power3.out'
});

const statCards = document.querySelectorAll('.stat-card');
statCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Counter animation for stats
const animateCounter = (element, target) => {
    gsap.to({
        val: 0
    }, {
        val: target,
        duration: 2,
        ease: 'power1.out',
        onUpdate: function() {
            element.textContent = Math.floor(this.targets()[0].val) + (element.textContent.includes('+') ? '+' : '');
        }
    });
};

statCards.forEach(card => {
    ScrollTrigger.create({
        trigger: card,
        onEnter: () => {
            const number = card.querySelector('h3');
            const targetValue = parseInt(number.textContent);
            if (!number.dataset.animated) {
                animateCounter(number, targetValue);
                number.dataset.animated = true;
            }
        }
    });
});

// ===========================
// Portfolio Section Animations
// ===========================

const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: (index % 3) * 0.1,
        ease: 'power3.out'
    });
});

// Portfolio filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        // Filter portfolio items
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                gsap.to(item, {
                    duration: 0.4,
                    opacity: 1,
                    pointerEvents: 'auto',
                    ease: 'power2.out'
                });
                item.style.display = 'block';
            } else {
                gsap.to(item, {
                    duration: 0.4,
                    opacity: 0.3,
                    pointerEvents: 'none',
                    ease: 'power2.out'
                });
            }
        });
    });
});

// ===========================
// Services Section Animations
// ===========================

const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: (index % 3) * 0.1,
        ease: 'power3.out'
    });

    // Hover animation
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
        });
    });
});

// ===========================
// Tech Stack Animations
// ===========================

const techItems = document.querySelectorAll('.tech-item');

techItems.forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%'
        },
        duration: 0.6,
        opacity: 0,
        scale: 0.8,
        delay: (index % 4) * 0.05,
        ease: 'back.out'
    });
});

// ===========================
// Testimonials Section Animations
// ===========================

const testimonialCards = document.querySelectorAll('.testimonial-card');

testimonialCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: (index % 3) * 0.1,
        ease: 'power3.out'
    });
});

// ===========================
// Process Section Animations
// ===========================

const stepCards = document.querySelectorAll('.step-card');

stepCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// ===========================
// Blog Section Animations
// ===========================

const blogCards = document.querySelectorAll('.blog-card');

blogCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        y: 50,
        delay: (index % 3) * 0.1,
        ease: 'power3.out'
    });

    // Hover animation
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
        });
    });
});

// ===========================
// Contact Section Form Animation
// ===========================

const contactForm = document.getElementById('contactForm');
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach((group, index) => {
    gsap.from(group, {
        scrollTrigger: {
            trigger: group,
            start: 'top 85%'
        },
        duration: 0.6,
        opacity: 0,
        y: 30,
        delay: index * 0.05,
        ease: 'power3.out'
    });
});

// Form submission animation
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Animate submit button
        const submitBtn = this.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;

        gsap.to(submitBtn, {
            duration: 0.3,
            scale: 0.95,
            ease: 'power2.out'
        });

        setTimeout(() => {
            gsap.to(submitBtn, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });

            // Show success message (in a real app, you'd send the form)
            submitBtn.textContent = '✓ Message Sent!';
            submitBtn.style.background = '#10b981';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 3000);
        }, 300);
    });
}

// ===========================
// Contact Info Cards Animation
// ===========================

const infoCards = document.querySelectorAll('.info-card');

infoCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%'
        },
        duration: 0.8,
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// ===========================
// Smooth Scroll Behavior
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power2.inOut'
            });
        }
    });
});

// ===========================
// Scroll Animations on Elements
// ===========================

// Parallax effect on hero section
gsap.to('.circle-animation', {
    y: -100,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
    }
});

// ===========================
// Text Reveal Animation
// ===========================

const createTextReveal = () => {
    const texts = document.querySelectorAll('.about-text p, .service-card p, .blog-content p');
    
    texts.forEach(text => {
        const words = text.innerText.split(' ');
        text.innerHTML = words.map(word => 
            `<span class="word">${word}</span>`
        ).join(' ');

        const spans = text.querySelectorAll('.word');
        spans.forEach((span, index) => {
            span.style.opacity = '0.7';
        });
    });
};

createTextReveal();

// ===========================
// Navigation Bar Scroll Effect
// ===========================

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
    }

    lastScrollTop = scrollTop;
});

// ===========================
// Loading Animation
// ===========================

window.addEventListener('load', () => {
    gsap.from('body', {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.out'
    });
});

// ===========================
// Hover Effects on Interactive Elements
// ===========================

const buttons = document.querySelectorAll('.btn, .filter-btn, .social-link');

buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            duration: 0.2,
            scale: 1.05,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            duration: 0.2,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// ===========================
// Image Reveal Animation
// ===========================

const portfolioImages = document.querySelectorAll('.portfolio-image img, .blog-image');

portfolioImages.forEach(img => {
    gsap.from(img, {
        scrollTrigger: {
            trigger: img,
            start: 'top 80%'
        },
        duration: 1,
        opacity: 0,
        scale: 0.9,
        ease: 'power3.out'
    });
});

// ===========================
// Count Up Animation for Stats
// ===========================

const countUpElements = document.querySelectorAll('.stat-card h3');

const countUp = (element, target, duration = 2) => {
    let start = 0;
    const increment = target / (duration * 60);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 1000 / 60);
};

// ===========================
// Responsive Adjustments
// ===========================

const handleResize = () => {
    if (window.innerWidth < 768) {
        // Adjust animations for mobile
        gsap.set('.floating-card', {
            display: 'none'
        });
    } else {
        gsap.set('.floating-card', {
            display: 'block'
        });
    }
};

window.addEventListener('resize', handleResize);
handleResize();

// ===========================
// Intersection Observer for Lazy Loading
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
            observer.unobserve(element);
        }
    });
}, observerOptions);

// ===========================
// Performance Optimization
// ===========================

// Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        ScrollTrigger.update();
    });
}, false);

// ===========================
// Initial Page Setup
// ===========================

window.addEventListener('DOMContentLoaded', () => {
    // Disable animations on reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        gsap.globalTimeline.timeScale(0.5);
    }

    // Initialize all animations
    ScrollTrigger.refresh();
});

// ===========================
// Prevent Memory Leaks
// ===========================

window.addEventListener('unload', () => {
    gsap.killTweensOf('*');
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
