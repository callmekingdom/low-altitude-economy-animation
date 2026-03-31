// OpenMAIC - Main JavaScript
// Video Player with Draggable Progress Bar & Fullscreen Support

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const spans = mobileMenuBtn.querySelectorAll('span');
            
            if (mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }
    
    // Video Modal Functionality
    const videoModal = document.getElementById('videoModal');
    const videoClose = document.getElementById('videoClose');
    const mainVideo = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const timeDisplay = document.getElementById('timeDisplay');
    
    let isDragging = false;
    let wasPlayingBeforeDrag = false;
    
    // Course data with sample video URLs
    const courseVideos = {
        'openclaw': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        'tax': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        'flowers': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'fraction': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        'taylor': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        'rocket': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        'avalon': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        'ai-education': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    };
    
    // Open video modal
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.dataset.course;
            const videoUrl = courseVideos[courseId];
            
            if (videoUrl && mainVideo) {
                mainVideo.src = videoUrl;
                mainVideo.load();
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Auto play after short delay
                setTimeout(() => {
                    mainVideo.play().catch(e => console.log('Auto-play prevented:', e));
                }, 300);
            }
        });
    });
    
    // Close video modal
    function closeVideoModal() {
        if (mainVideo) {
            mainVideo.pause();
            mainVideo.currentTime = 0;
        }
        if (videoModal) {
            videoModal.classList.remove('active');
        }
        document.body.style.overflow = '';
        
        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Update UI
        updatePlayPauseIcon(false);
    }
    
    if (videoClose) {
        videoClose.addEventListener('click', closeVideoModal);
    }
    
    // Close on backdrop click
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    // Play/Pause functionality
    function togglePlayPause() {
        if (!mainVideo) return;
        
        if (mainVideo.paused) {
            mainVideo.play();
        } else {
            mainVideo.pause();
        }
    }
    
    function updatePlayPauseIcon(isPlaying) {
        if (playPauseBtn) {
            if (isPlaying) {
                playPauseBtn.classList.add('playing');
            } else {
                playPauseBtn.classList.remove('playing');
            }
        }
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (mainVideo) {
        mainVideo.addEventListener('play', () => updatePlayPauseIcon(true));
        mainVideo.addEventListener('pause', () => updatePlayPauseIcon(false));
        mainVideo.addEventListener('click', togglePlayPause);
        
        // Update progress bar as video plays
        mainVideo.addEventListener('timeupdate', function() {
            if (!isDragging && mainVideo.duration) {
                const progress = (mainVideo.currentTime / mainVideo.duration) * 100;
                updateProgressUI(progress);
            }
            updateTimeDisplay();
        });
        
        // Video ended
        mainVideo.addEventListener('ended', function() {
            updatePlayPauseIcon(false);
            updateProgressUI(0);
        });
        
        // Video loaded
        mainVideo.addEventListener('loadedmetadata', updateTimeDisplay);
    }
    
    // Progress Bar - Click and Drag functionality
    function updateProgressUI(percent) {
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }
        if (progressHandle) {
            progressHandle.style.left = percent + '%';
        }
    }
    
    function updateTimeDisplay() {
        if (!mainVideo || !timeDisplay) return;
        
        const current = formatTime(mainVideo.currentTime || 0);
        const duration = formatTime(mainVideo.duration || 0);
        timeDisplay.textContent = `${current} / ${duration}`;
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    function getProgressPercent(clientX) {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        let percent = (offsetX / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        return percent;
    }
    
    function seekToPercent(percent) {
        if (!mainVideo || !mainVideo.duration) return;
        
        const time = (percent / 100) * mainVideo.duration;
        mainVideo.currentTime = time;
        updateProgressUI(percent);
    }
    
    // Click on progress bar
    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            const percent = getProgressPercent(e.clientX);
            seekToPercent(percent);
        });
        
        // Mouse down - start dragging
        progressContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            wasPlayingBeforeDrag = mainVideo && !mainVideo.paused;
            
            if (mainVideo) {
                mainVideo.pause();
            }
            
            progressContainer.classList.add('dragging');
            
            const percent = getProgressPercent(e.clientX);
            seekToPercent(percent);
        });
    }
    
    // Mouse move - dragging
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const percent = getProgressPercent(e.clientX);
        seekToPercent(percent);
    });
    
    // Mouse up - end dragging
    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        
        if (progressContainer) {
            progressContainer.classList.remove('dragging');
        }
        
        // Resume playback if it was playing before
        if (wasPlayingBeforeDrag && mainVideo) {
            mainVideo.play();
        }
    });
    
    // Touch support for mobile
    if (progressContainer) {
        progressContainer.addEventListener('touchstart', function(e) {
            isDragging = true;
            wasPlayingBeforeDrag = mainVideo && !mainVideo.paused;
            
            if (mainVideo) {
                mainVideo.pause();
            }
            
            const touch = e.touches[0];
            const percent = getProgressPercent(touch.clientX);
            seekToPercent(percent);
        }, { passive: true });
        
        progressContainer.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const percent = getProgressPercent(touch.clientX);
            seekToPercent(percent);
        }, { passive: true });
        
        progressContainer.addEventListener('touchend', function() {
            isDragging = false;
            
            if (wasPlayingBeforeDrag && mainVideo) {
                mainVideo.play();
            }
        });
    }
    
    // Fullscreen functionality
    function toggleFullscreen() {
        if (!videoModal) return;
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (videoModal.requestFullscreen) {
                videoModal.requestFullscreen();
            } else if (videoModal.webkitRequestFullscreen) {
                videoModal.webkitRequestFullscreen();
            } else if (videoModal.msRequestFullscreen) {
                videoModal.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    function updateFullscreenIcon() {
        if (!fullscreenBtn) return;
        
        if (document.fullscreenElement) {
            fullscreenBtn.classList.add('active');
        } else {
            fullscreenBtn.classList.remove('active');
        }
    }
    
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
    
    // Double click video to toggle fullscreen
    if (mainVideo) {
        mainVideo.addEventListener('dblclick', toggleFullscreen);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Only when video modal is active
        if (!videoModal || !videoModal.classList.contains('active')) return;
        
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (mainVideo) {
                    mainVideo.currentTime = Math.max(0, mainVideo.currentTime - 10);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (mainVideo) {
                    mainVideo.currentTime = Math.min(
                        mainVideo.duration || 0, 
                        mainVideo.currentTime + 10
                    );
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (mainVideo) {
                    mainVideo.volume = Math.min(1, mainVideo.volume + 0.1);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (mainVideo) {
                    mainVideo.volume = Math.max(0, mainVideo.volume - 0.1);
                }
                break;
            case 'm':
                e.preventDefault();
                if (mainVideo) {
                    mainVideo.muted = !mainVideo.muted;
                }
                break;
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.9)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.course-card, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // AI Assistant - Chat Input Auto-resize
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // AI Assistant - Send Button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Global function to fill input from example chips
function fillInput(text) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value = text;
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        chatInput.focus();
    }
}

// Send message function
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-message';
    userMsgDiv.innerHTML = `
        <div class="message-bubble user-bubble">
            <p>${escapeHtml(message)}</p>
        </div>
    `;
    
    // Insert before welcome text
    const welcomeText = chatMessages.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.style.display = 'none';
    }
    
    chatMessages.appendChild(userMsgDiv);
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate AI response (placeholder)
    setTimeout(() => {
        const aiMsgDiv = document.createElement('div');
        aiMsgDiv.className = 'ai-message';
        aiMsgDiv.innerHTML = `
            <div class="message-avatar">👨‍🏫</div>
            <div class="message-bubble ai-bubble">
                <p>正在思考中...</p>
            </div>
        `;
        chatMessages.appendChild(aiMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Update response after a delay
        setTimeout(() => {
            aiMsgDiv.querySelector('p').textContent = '这是一个模拟回复。实际使用时，这里会连接AI后端生成解答过程。';
        }, 1500);
    }, 500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
