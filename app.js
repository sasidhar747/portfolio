/**
 * Gamini Sasidhar Varma - Premium Portfolio Application Script
 * -------------------------------------------------------------
 * Fully engineered in Vanilla JavaScript to manage premium micro-interactions,
 * terminal commands, custom music streams, drag mechanics, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. GLOBAL THEME AND ACTIVE NAVBAR SCROLL
       ========================================================================== */
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('gamini-portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    // Toggle theme
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('gamini-portfolio-theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('gamini-portfolio-theme', 'dark');
        }
    });

    // Handle scroll for navbar sizing & active navigation link highlight
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarWrapper.classList.add('scrolled');
        } else {
            navbarWrapper.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. INTERACTIVE HERO LETTER HOVERS
       ========================================================================== */
    const interactiveName = document.getElementById('interactiveName');
    const chars = interactiveName.querySelectorAll('.char-span');

    chars.forEach((char, index) => {
        char.addEventListener('mouseenter', () => {
            // Apply unique transformation dynamic styles dynamically
            const angle = (Math.random() * 20 - 10).toFixed(2); // between -10 and 10 degrees
            const scale = (Math.random() * 0.15 + 1.15).toFixed(2); // between 1.15 and 1.3
            const translateY = (Math.random() * -12 - 5).toFixed(2); // between -5px and -17px
            
            char.style.transform = `scale(${scale}) rotate(${angle}deg) translateY(${translateY}px)`;
        });

        char.addEventListener('mouseleave', () => {
            char.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
        });
    });

    /* ==========================================================================
       3. DRAGGABLE RETRO TERMINAL ENGINE
       ========================================================================== */
    const draggableTerminal = document.getElementById('draggableTerminal');
    const terminalHeader = draggableTerminal.querySelector('.terminal-header');
    
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let termLeft = 0;
    let termTop = 0;

    // Draggable mechanics for desktop and touch displays
    terminalHeader.addEventListener('mousedown', dragStart);
    terminalHeader.addEventListener('touchstart', dragStart, { passive: true });

    function dragStart(e) {
        // Prevent dragging if maximize is toggled
        if (draggableTerminal.classList.contains('fullscreen')) return;
        
        isDragging = true;
        const event = e.type.includes('touch') ? e.touches[0] : e;
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        // Get computed bounds
        const style = window.getComputedStyle(draggableTerminal);
        const transform = new DOMMatrixReadOnly(style.transform);
        termLeft = transform.m41;
        termTop = transform.m42;

        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }

    function dragMove(e) {
        if (!isDragging) return;
        
        // Prevent default touch scrolls while dragging terminal
        if (e.cancelable) e.preventDefault();

        const event = e.type.includes('touch') ? e.touches[0] : e;
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;

        // Bounding window check to avoid screen loss
        const newLeft = termLeft + deltaX;
        const newTop = termTop + deltaY;

        draggableTerminal.style.transform = `translate(${newLeft}px, ${newTop}px)`;
    }

    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }

    // Terminal controls
    const termClose = document.getElementById('termClose');
    const termMin = document.getElementById('termMin');
    const termMax = document.getElementById('termMax');

    termClose.addEventListener('click', () => {
        draggableTerminal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        draggableTerminal.style.opacity = '0';
        setTimeout(() => {
            draggableTerminal.style.display = 'none';
        }, 300);
    });

    termMin.addEventListener('click', () => {
        draggableTerminal.classList.toggle('minimized');
        if (draggableTerminal.classList.contains('minimized')) {
            draggableTerminal.style.height = '48px';
            draggableTerminal.querySelector('.terminal-body').style.display = 'none';
        } else {
            draggableTerminal.style.height = '400px';
            draggableTerminal.querySelector('.terminal-body').style.display = 'flex';
        }
    });

    termMax.addEventListener('click', () => {
        draggableTerminal.classList.toggle('fullscreen');
        if (draggableTerminal.classList.contains('fullscreen')) {
            draggableTerminal.style.position = 'fixed';
            draggableTerminal.style.top = '60px';
            draggableTerminal.style.left = '20px';
            draggableTerminal.style.right = '20px';
            draggableTerminal.style.width = 'calc(100% - 40px)';
            draggableTerminal.style.height = 'calc(100vh - 100px)';
            draggableTerminal.style.transform = 'none';
            draggableTerminal.style.zIndex = '999';
        } else {
            draggableTerminal.style.position = 'relative';
            draggableTerminal.style.top = 'auto';
            draggableTerminal.style.left = 'auto';
            draggableTerminal.style.right = 'auto';
            draggableTerminal.style.width = 'auto';
            draggableTerminal.style.height = '400px';
            draggableTerminal.style.transform = 'translate(0px, 0px)';
            draggableTerminal.style.zIndex = '1';
        }
    });

    /* ==========================================================================
       4. INTERACTIVE RETRO TERMINAL INTERPRETER
       ========================================================================== */
    const terminalInput = document.getElementById('terminalInput');
    const terminalHistory = document.getElementById('terminalHistory');
    const terminalOutput = document.getElementById('terminalOutput');

    // Auto focus terminal inside section
    draggableTerminal.addEventListener('click', () => {
        terminalInput.focus();
    });

    const commandDatabase = {
        help: `Available commands:
  <span class="term-highlight">about</span>          - Prints educational bio & info
  <span class="term-highlight">skills</span>         - Displays technical core competencies
  <span class="term-highlight">projects</span>       - Outputs verified resume projects
  <span class="term-highlight">experience</span>     - Displays full-stack internship details
  <span class="term-highlight">certifications</span> - Outputs verified professional credentials
  <span class="term-highlight">lofi</span>           - Plays or pauses ambient portfolio music
  <span class="term-highlight">clear</span>          - Clears screen buffer history
  <span class="term-highlight">help</span>           - Lists commands`,
        
        about: `<b>Gamini Sasidhar Varma</b>
-----------------------
Headline: Dedicated IT Undergraduate | Java & Web Developer | Tech Enthusiast
Education: B.Tech in Information Technology
Institution: Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology
CGPA: 8.1 / 10.0
Description: Focused on building scalable applications, designing robust database registers, and engineering technical solutions to solve real-world problems.`,
        
        skills: `<b>TECHNICAL CORE COMPETENCIES</b>
---------------------------
Programming Languages : <span class="term-highlight">Java</span>, <span class="term-highlight">C</span>
Frameworks & Libraries: <span class="term-highlight">React</span>, <span class="term-highlight">Node.js</span>, <span class="term-highlight">Express</span>, <span class="term-highlight">Bootstrap</span>
Web Technologies      : <span class="term-highlight">HTML5</span>, <span class="term-highlight">CSS3</span>, JavaScript (ES6+), JWT Authentication
Databases & Storage   : <span class="term-highlight">MySQL</span>, Relational SQL Design
Specializations       : Blockchain Architectures, AI Concepts, GenAI Powered Data Analytics`,
        
        projects: `<b>VERIFIED RESUME PROJECTS</b>
--------------------------
1. <span class="term-highlight">Blockchain Cold Chain Monitoring System</span>
   - Implemented real-time temperature/humidity telemetry with cryptographic storage blocks.
2. <span class="term-highlight">AI-Powered Personalized Health Assistant</span>
   - Built adaptive health support layers and multimodal UX features for specially-abled individuals.
3. <span class="term-highlight">Skill Learning Marketplace Course Platform</span>
   - Built robust MVC architecture with Express, secure MySQL, JWT credentials, and dashboard UI.
4. <span class="term-highlight">Smart LPG Regulator (IoT & Fail-Safe)</span>
   - Engineered ESP32 dual-sensor module, automatic relay valve cutoffs, and cloud dashboards.`,

        experience: `<b>AI INTEGRATED FULL STACK INTERN</b>
----------------------------------
Organization : Internship Studio
Duration     : 2026
Tasks        : Engineered cognitive integrations into full-stack applications. Gained deep hands-on expertise across frontend UI layers, database relational models, and backend server routing.`,

        certifications: `<b>VERIFIED FORAGE CREDENTIALS</b>
-------------------------------
1. <span class="term-highlight">Electronic Arts Software Engineering Virtual Experience</span>
2. <span class="term-highlight">GenAI Powered Data Analytics Virtual Experience</span>`,
        
        clear: '',
        lofi: ''
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCommand = terminalInput.value;
            const cleanCommand = rawCommand.trim().toLowerCase();
            
            // Output command prompt line
            const userLine = document.createElement('div');
            userLine.className = 'terminal-entry';
            userLine.innerHTML = `<span class="prompt">gamini@portfolio:~$</span> <span class="input-text">${rawCommand}</span>`;
            terminalHistory.appendChild(userLine);

            if (cleanCommand === 'clear') {
                terminalHistory.innerHTML = '';
            } else if (cleanCommand === 'lofi') {
                toggleLofiMusic();
                const outputBlock = document.createElement('div');
                outputBlock.className = 'output-block';
                outputBlock.innerHTML = `Toggled lofi music play stream status. Status: ${!lofiAudio.paused ? 'Playing' : 'Paused'}`;
                userLine.appendChild(outputBlock);
            } else if (cleanCommand in commandDatabase) {
                const outputBlock = document.createElement('div');
                outputBlock.className = 'output-block';
                outputBlock.innerHTML = commandDatabase[cleanCommand];
                userLine.appendChild(outputBlock);
            } else if (cleanCommand !== '') {
                const outputBlock = document.createElement('div');
                outputBlock.className = 'output-block';
                outputBlock.innerHTML = `Command not found: <span class="term-highlight">${cleanCommand}</span>. Type <span class="term-highlight">help</span> for assistance.`;
                userLine.appendChild(outputBlock);
            }

            terminalInput.value = '';
            // Scroll down
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    /* ==========================================================================
       5. LOFI SYNTHWAVE AUDIO CONTROLLER
       ========================================================================== */
    const lofiAudio = document.getElementById('lofiAudio');
    const lofiPlayBtn = document.getElementById('lofiPlayBtn');
    const audioVisualizer = document.getElementById('audioVisualizer');

    // Reduce volume default
    lofiAudio.volume = 0.35;

    function toggleLofiMusic() {
        if (lofiAudio.paused) {
            lofiAudio.play()
                .then(() => {
                    lofiPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    audioVisualizer.classList.add('playing');
                })
                .catch(err => {
                    console.log('Stream block or autoplay rules prevented immediate playing: ', err);
                });
        } else {
            lofiAudio.pause();
            lofiPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            audioVisualizer.classList.remove('playing');
        }
    }

    lofiPlayBtn.addEventListener('click', toggleLofiMusic);

    /* ==========================================================================
       6. 3D FLIPPABLE VISA CARD SUPPORT
       ========================================================================== */
    const visaCard = document.getElementById('visaCard');
    const contactForm = document.getElementById('contactForm');

    // Support tap to flip on mobile devices
    visaCard.addEventListener('click', (e) => {
        // Do not flip if clicked elements are input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') {
            return;
        }
        visaCard.classList.toggle('flipped');
    });

    // Reset card form placeholder response
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formName = document.getElementById('formName').value;
        const formEmail = document.getElementById('formEmail').value;
        const formMessage = document.getElementById('formMessage').value;

        // Custom micro feedback
        const originalBtn = contactForm.querySelector('.cc-submit-btn');
        originalBtn.innerHTML = 'Connecting... <i class="fa-solid fa-spinner animate-spin"></i>';
        originalBtn.disabled = true;

        setTimeout(() => {
            originalBtn.innerHTML = 'Signal Sent! <i class="fa-solid fa-check"></i>';
            originalBtn.style.backgroundColor = 'var(--color-green)';
            
            // Log message trigger to simulated terminal
            const systemLog = document.createElement('div');
            systemLog.className = 'terminal-entry';
            systemLog.innerHTML = `<span class="prompt">system@gateway:~$</span> <span class="input-text">echo 'Message parsed from ${formName} (${formEmail})'</span><div class="output-block">Signal processed successfully. Gateway logs updated.</div>`;
            terminalHistory.appendChild(systemLog);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;

            // Reset form fields
            setTimeout(() => {
                contactForm.reset();
                originalBtn.innerHTML = 'Send Signal <i class="fa-solid fa-paper-plane"></i>';
                originalBtn.style.backgroundColor = 'var(--color-primary)';
                originalBtn.disabled = false;
                visaCard.classList.remove('flipped');
            }, 2000);
        }, 1500);
    });

    /* ==========================================================================
       7. SPRING-LOADED PROJECT DETAIL MODALS
       ========================================================================== */
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn, .modal-close-action');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                body.style.overflow = 'hidden'; // Lock scrolling
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        body.style.overflow = 'auto'; // Restore scrolling
    }

    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const activeModal = e.target.closest('.modal-overlay');
            if (activeModal) {
                closeModal(activeModal);
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Escape Key closing
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    /* ==========================================================================
       8. SMOOTH ANCHOR NAVIGATION & POLISH
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
