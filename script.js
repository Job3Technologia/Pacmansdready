// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initAnimations();
            }, 500);
        }, 1500);
    } else {
        initAnimations();
    }
    
    initModal();
    initMobileMenu();
    initHeroSlideshow();
});

function initHeroSlideshow() {
    const heroImage = document.getElementById('hero-image');
    if (!heroImage) return;

    const images = ['FB_IMG_1767419803312.jpg'];
    heroImage.src = images[0];
}

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.mobile-link');
    let isOpen = false;

    if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                // Open Menu
                menu.classList.remove('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-times"></i>';
                document.body.classList.add('overflow-hidden');
                
                // Animate Links
                gsap.fromTo(links, 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
                );
            } else {
                // Close Menu
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            }
        });

        // Close on Link Click
        links.forEach(link => {
            link.addEventListener('click', () => {
                isOpen = false;
                menu.classList.add('opacity-0', 'pointer-events-none');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('overflow-hidden');
            });
        });
    }
}

function initAnimations() {
    gsap.from("nav", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from("#hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from("#hero-image", {
        scale: 1,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        delay: 0.8
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            const navbar = document.getElementById('navbar');
            const navHeight = navbar ? navbar.offsetHeight : 0;
            
            if (targetSection) {
                const top = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    gsap.from(".album-cover", {
        scrollTrigger: {
            trigger: "#music",
            start: "top 60%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Section 3: Booking Animations
    gsap.from("#booking-card", {
        scrollTrigger: {
            trigger: "#booking",
            start: "top 70%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from("#gallery-main-image", {
        scrollTrigger: {
            trigger: "#gallery",
            start: "top 75%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out"
    });

    // Section 5: Events Animations
    gsap.from(".event-item", {
        scrollTrigger: {
            trigger: "#events",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out"
    });
}

const audio = new Audio();
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const downloadBtn = document.getElementById('download-btn');
const progressBar = document.getElementById('progress-bar');
const trackTitle = document.getElementById('current-track');
const trackArtist = document.getElementById('current-artist');
const playerCover = document.getElementById('player-cover');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const trackItems = document.querySelectorAll('.track-item');

const tracks = [
    {
        file: 'AUD-20260107-WA0017.mp3',
        title: 'Umdlalo Wemoya',
        artist: 'Pacman SD',
        cover: 'cover.jpg'
    },
    {
        file: 'AUD-20260107-WA0018.mp3',
        title: 'Thank You',
        artist: 'Pacman SD',
        cover: 'cover.jpg'
    },
    {
        file: 'AUD-20260107-WA0019.mp3',
        title: 'Ziphi Lah [Feat. Mthobisi]',
        artist: 'Pacman SD',
        cover: 'IMG-20251009-WA0030~2.png'
    },
    {
        file: 'AUD-20260107-WA0020.mp3',
        title: 'Black Anthem [Feat. SmoothRamz]',
        artist: 'Pacman SD',
        cover: 'FB_IMG_1767419803312.jpg'
    },
    {
        file: 'AUD-20260108-WA0001.mp3',
        title: 'Delayed Visions [Feat. Plord]',
        artist: 'Pacman SD',
        cover: 'FB_IMG_1767419848838.jpg'
    },
    {
        file: 'AUD-20260108-WA0002.mp3',
        title: 'Wrong Time',
        artist: 'Pacman SD',
        cover: '1000186736.png'
    },
    {
        file: 'AUD-20260108-WA0003.mp3',
        title: 'Army Commander',
        artist: 'Pacman SD',
        cover: 'PSX_20251020_233755~3 (2) (1) (1) (1).png'
    },
    {
        file: 'AUD-20260108-WA0004.mp3',
        title: 'Makasane',
        artist: 'Pacman SD',
        cover: '1000186749.png'
    }
];

let currentIndex = 0;
let isPlaying = false;
let isSeeking = false;

function formatTime(seconds) {
    if (!seconds || Number.isNaN(seconds)) return '0:00';
    const floored = Math.floor(seconds);
    const m = Math.floor(floored / 60);
    const s = floored % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updatePlayIcon() {
    if (!playIcon) return;
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
    }
}

function highlightTrack(index) {
    trackItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('ring-2', 'ring-yellow-500');
        } else {
            item.classList.remove('ring-2', 'ring-yellow-500');
        }
    });
}

function updateDownloadLink(track) {
    if (!downloadBtn) return;
    downloadBtn.href = track.file;
    const safeName = track.title.replace(/\s+/g, '_');
    downloadBtn.setAttribute('download', `${safeName}.mp3`);
}

function loadTrack(index) {
    if (!tracks[index]) return;
    currentIndex = index;
    const track = tracks[index];
    audio.src = track.file;
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (playerCover && track.cover) playerCover.src = track.cover;
    if (progressBar) {
        progressBar.value = 0;
    }
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (totalTimeEl) totalTimeEl.textContent = '0:00';
    highlightTrack(index);
    updateDownloadLink(track);
}

function playCurrent() {
    audio
        .play()
        .then(() => {
            isPlaying = true;
            updatePlayIcon();
        })
        .catch(() => {});
}

function pauseCurrent() {
    audio.pause();
    isPlaying = false;
    updatePlayIcon();
}

function togglePlay() {
    if (!audio.src) {
        loadTrack(currentIndex);
    }
    if (isPlaying) {
        pauseCurrent();
    } else {
        playCurrent();
    }
}

function playNext() {
    const nextIndex = (currentIndex + 1) % tracks.length;
    loadTrack(nextIndex);
    playCurrent();
}

function playPrevious() {
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(prevIndex);
    playCurrent();
}

if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
}

if (nextBtn) {
    nextBtn.addEventListener('click', playNext);
}

if (prevBtn) {
    prevBtn.addEventListener('click', playPrevious);
}

trackItems.forEach(item => {
    const indexAttr = item.getAttribute('data-index');
    const index = indexAttr ? parseInt(indexAttr, 10) : 0;
    item.addEventListener('click', () => {
        loadTrack(index);
        playCurrent();
    });
});

if (progressBar) {
    progressBar.addEventListener('input', () => {
        isSeeking = true;
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(progressBar.value);
        }
    });
    progressBar.addEventListener('change', () => {
        audio.currentTime = Number(progressBar.value);
        isSeeking = false;
    });
}

audio.addEventListener('timeupdate', () => {
    if (!progressBar || isSeeking) return;
    progressBar.max = audio.duration || 0;
    progressBar.value = audio.currentTime;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    if (progressBar) {
        progressBar.max = audio.duration || 0;
        progressBar.value = 0;
    }
    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
});

audio.addEventListener('ended', () => {
    playNext();
});

if (tracks.length > 0) {
    loadTrack(0);
}

// Bio Modal Logic
function initModal() {
    const bioModal = document.getElementById('bio-modal');
    const openBioBtn = document.getElementById('open-bio-btn');
    const closeBioBtn = document.getElementById('close-bio');

    if (openBioBtn && bioModal && closeBioBtn) {
        openBioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            bioModal.classList.remove('hidden');
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => {
                bioModal.classList.remove('opacity-0');
            }, 10);
            // Optional: Blur main content
            const main = document.querySelector('main');
            if(main) main.classList.add('blur-sm');
        });

        closeBioBtn.addEventListener('click', () => {
            bioModal.classList.add('opacity-0');
            // Remove blur
            const main = document.querySelector('main');
            if(main) main.classList.remove('blur-sm');
            
            setTimeout(() => {
                bioModal.classList.add('hidden');
            }, 500);
        });
        
        // Close on clicking outside
        bioModal.addEventListener('click', (e) => {
            if (e.target === bioModal || e.target.classList.contains('absolute')) {
                // If clicking the overlay (absolute div) or container
                // Actually the absolute div covers inset-0.
                // Let's check if the click is NOT inside the content div
                // Easier: just attach to the overlay
            }
        });
        
        // Better way to handle outside click given the structure
        const overlay = bioModal.querySelector('.absolute');
        if(overlay) {
            overlay.addEventListener('click', () => {
                closeBioBtn.click();
            });
        }
    }
}

// WhatsApp booking integration
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-whatsapp');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const name = document.getElementById('booking-name')?.value || '';
            const email = document.getElementById('booking-email')?.value || '';
            const message = document.getElementById('booking-message')?.value || '';
            const errorEl = document.getElementById('booking-error');
            if (errorEl) errorEl.classList.add('hidden');

            if (!name.trim() || !message.trim()) {
                if (errorEl) errorEl.classList.remove('hidden');
                return;
            }

            const composed = `Booking Inquiry\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            const encoded = encodeURIComponent(composed);
            const isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const base = isMobile ? 'whatsapp://send?phone=26878270065&text=' : 'https://wa.me/26878270065?text=';
            const url = `${base}${encoded}`;
            window.open(url, '_blank');
        });
    }
});

// Lightbox Logic
function openLightbox(element) {
    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const sourceImg = element.querySelector('img');
    const sourceCaption = element.querySelector('span');

    if (modal && img && sourceImg) {
        img.src = sourceImg.src;
        caption.innerText = sourceCaption ? sourceCaption.innerText : '';
        
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('close-lightbox');

    if (modal && closeBtn) {
        const close = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', close);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                close();
            }
        });
    }

    const galleryMain = document.getElementById('gallery-main-image');
    const galleryCaption = document.getElementById('gallery-caption');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');

    let galleryIndex = 0;

    function setGalleryImage(index) {
        const thumb = galleryThumbs[index];
        if (!thumb || !galleryMain || !galleryCaption) return;
        galleryIndex = index;
        const src = thumb.getAttribute('data-src');
        const caption = thumb.getAttribute('data-caption') || '';
        galleryMain.src = src;
        galleryCaption.textContent = caption;
        galleryThumbs.forEach(t => t.classList.remove('border-swazi-blue'));
        thumb.classList.add('border-swazi-blue');
    }

    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const indexAttr = thumb.getAttribute('data-index');
            const index = indexAttr ? parseInt(indexAttr, 10) : 0;
            setGalleryImage(index);
        });
    });

    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => {
            const nextIndex = (galleryIndex - 1 + galleryThumbs.length) % galleryThumbs.length;
            setGalleryImage(nextIndex);
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener('click', () => {
            const nextIndex = (galleryIndex + 1) % galleryThumbs.length;
            setGalleryImage(nextIndex);
        });
    }

    if (galleryThumbs.length > 0) {
        setGalleryImage(0);
    }
});
