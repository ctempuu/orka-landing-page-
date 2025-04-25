document.addEventListener('DOMContentLoaded', () => {

    // --- Background Cycling Logic ---

    const backgroundMedia = [
        // ** IMPORTANT: Replace these with YOUR actual file paths relative to index.html **
        { type: 'video', src: 'media/animation 1.mp4' },
        { type: 'image', src: 'media/advert 1.png' },
        { type: 'image', src: 'media/advert 2.png' },
        { type: 'image', src: 'media/cafe shot 2.png' },
        { type: 'image', src: 'media/cafe shot 3.png' },
        { type: 'image', src: 'media/cafe shot 5.png' },
        { type: 'image', src: 'media/cup shot 3.png' },
        { type: 'image', src: 'media/search.png' },
    ];
    const cycleInterval = 9000; // 9 seconds per item
    let currentMediaIndex = 0;
    const bgContainer1 = document.getElementById('bg-container-1');
    const bgContainer2 = document.getElementById('bg-container-2');
    let visibleContainer = bgContainer1;
    let hiddenContainer = bgContainer2;

    function loadMedia(container, mediaItem) {
        container.innerHTML = ''; // Clear previous

        if (mediaItem.type === 'image') {
            const img = document.createElement('img');
            img.src = mediaItem.src;
            img.alt = "Orka Coffee Background";
            container.appendChild(img);
        } else if (mediaItem.type === 'video') {
            const video = document.createElement('video');
            video.src = mediaItem.src;
            video.autoplay = true;
            video.muted = true; // Required for autoplay
            video.loop = true;
            video.playsInline = true;
            video.setAttribute('preload', 'auto');
            container.appendChild(video);
            // Ensure playback starts reliably
            video.play().catch(error => console.log("Video play prevented possibly: ", error));
        }
    }

    function cycleBackground() {
        currentMediaIndex = (currentMediaIndex + 1) % backgroundMedia.length;
        const nextMedia = backgroundMedia[currentMediaIndex];

        loadMedia(hiddenContainer, nextMedia); // Load into hidden first

        // Short delay to allow loading/buffering before fade
        setTimeout(() => {
            visibleContainer.classList.remove('visible');
            hiddenContainer.classList.add('visible');

            // Pause video in the container that just became hidden
            const oldVideo = visibleContainer.querySelector('video'); // Check the one becoming hidden
            if (oldVideo) {
                oldVideo.pause();
            }

            // Swap roles for next cycle
            let temp = visibleContainer;
            visibleContainer = hiddenContainer;
            hiddenContainer = temp;

        }, 150); // Slightly longer delay
    }

    // Initial Background Load
    if (backgroundMedia.length > 0) {
         loadMedia(visibleContainer, backgroundMedia[0]);
         visibleContainer.classList.add('visible');
         // Start cycling only if there's more than one item
         if (backgroundMedia.length > 1) {
            setInterval(cycleBackground, cycleInterval);
         }
    } else {
        console.log("No background media items defined.");
    }


    // --- Cursor Trail Logic ---

    const trailLength = 15; // Number of dots
    const dots = [];
    let mouseX = 0, mouseY = 0;
    let animationFrameId = null;
    let trailInitialized = false; // Flag to add body class only once

    // Create dot elements function
    function createDot(index) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        document.body.appendChild(dot);
        const scale = Math.max(0.1, 1 - index / trailLength); // Ensure minimum scale
        // Apply initial styles that depend on index
        dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
        dot.style.opacity = '0'; // Start hidden
        // Add slightly different transition delays for a more fluid wave? (Optional)
        // dot.style.transitionDelay = `${index * 0.01}s`;
        return {
            element: dot,
            x: 0,
            y: 0,
            scale: scale
        };
    }

    // Populate dots array
    for (let i = 0; i < trailLength; i++) {
        dots.push(createDot(i));
    }

    // Mouse move listener
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Start animation and hide default cursor on first move
        if (!animationFrameId) {
            if (!trailInitialized) {
                 document.body.classList.add('trail-active'); // Hide default cursor
                 dots.forEach(dot => dot.element.style.opacity = '1'); // Make dots potentially visible
                 trailInitialized = true;
            }
            animateDots(); // Start the animation loop
        }
    });

    // Animation loop using requestAnimationFrame
    function animateDots() {
        let leaderX = mouseX;
        let leaderY = mouseY;

        dots.forEach((dot, index) => {
            const currentX = dot.x;
            const currentY = dot.y;

            // Simple linear interpolation (easing)
            const easeFactor = 0.5;
            dot.x += (leaderX - currentX) * easeFactor;
            dot.y += (leaderY - currentY) * easeFactor;

            // Apply position and scale transform
            dot.element.style.transform = `translate(${dot.x - dot.element.offsetWidth / 2}px, ${dot.y - dot.element.offsetHeight / 2}px) scale(${dot.scale})`;

            // The current dot's previous position becomes the leader for the next dot
            leaderX = currentX;
            leaderY = currentY;
        });

        animationFrameId = requestAnimationFrame(animateDots); // Continue the loop
    }

    // Optional: Stop animation if mouse leaves window?
    // document.addEventListener('mouseleave', () => {
    //     if (animationFrameId) {
    //         cancelAnimationFrame(animationFrameId);
    //         animationFrameId = null;
    //         // Optionally hide dots or fade them out
    //         // document.body.classList.remove('trail-active'); // Show default cursor again
    //     }
    // });

}); // End DOMContentLoaded
