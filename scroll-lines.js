document.addEventListener('DOMContentLoaded', () => {
    if (window.gsap && window.ScrollTrigger) {
        gsap.utils.toArray('.scroll-line-section').forEach((section) => {
            gsap.fromTo(section,
                { "--line-scale": 0 },
                {
                    "--line-scale": 1,
                    duration: 2,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top center",
                        end: "bottom center",
                        scrub: true
                    }
                }
            );
        });
    }
});
