import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import ASScroll from '@ashthornton/asscroll';

gsap.registerPlugin(ScrollTrigger, CustomEase);

class Dinsmore {
    constructor() {
        this.init();
    }


    init() {
        console.log('Initializing Dinsmore...');

        // this.scrollInit();
        this.scrollWatch();
        this.navToggleHandler();
        this.offCanvasNavSubmenuToggle();
        this.offCanvasNavSubmenuBack();
        this.navDropdownHandler();
        this.navHeadroomHandler();
        this.homeHeroParallax();
        this.homeServicesHandler();
        this.homeServicesParallax();
    }


    windowDisableScroll() {
        // Get the current page scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
        // if any scroll is attempted, set this to the previous value
        window.onscroll = () => {
            window.scrollTo(scrollLeft, scrollTop);
        };
    }
      

    windowEnableScroll() {
        window.onscroll = () => {};
    }


    eventHandler(element, eventType, callback) {
        element.addEventListener(eventType, (e) => {
            if (e.keyCode === 13 || e.type === "click") {
                e.preventDefault();
                e.stopPropagation();

                callback(e);
            } else {
                callback(e);
            }
        });
    }


    // Scroll smoother
    scrollInit() {
        const asscroll = new ASScroll({
            disableRaf: true,
            ease: .0625,
        });

        gsap.ticker.add(asscroll.update);

        ScrollTrigger.defaults({
            scroller: asscroll.containerElement
        });

        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
            scrollTop(value) {
                return arguments.length ? asscroll.currentPos = value : asscroll.currentPos;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
            }
        });

        // App colors
        const _this = this;
        const actions = document.querySelector('#dm__navbar-container');
        const light = document.querySelectorAll('.light');
        let lightMode = [];

        for (let lightEl of light) {
            const elFromTop = lightEl.offsetTop;
            const elHeight = lightEl.offsetHeight;
            const darkStart = elFromTop;
            const darkEnd = elFromTop + elHeight;

            lightMode.push({
               start: darkStart,
               end: darkEnd 
            })
        }

        window.addEventListener('resize', () => {
            lightMode = [];

            for (let lightEl of light) {
                const elFromTop = lightEl.offsetTop;
                const elHeight = lightEl.offsetHeight;
                const darkStart = elFromTop;
                const darkEnd = elFromTop + elHeight;
    
                lightMode.push({
                   start: darkStart,
                   end: darkEnd 
                })
            }
        });


        // init asscroll
        asscroll.on("update", ScrollTrigger.update);
        asscroll.on('scroll', (scrollPos) => {
            let changeArray = [];
            for (let i = 0; i < lightMode.length; i++) {
                if (scrollPos >= lightMode[i].start && scrollPos <= lightMode[i].end) {
                    changeArray.push(true);
                } else {
                    changeArray.push(false);
                }
            }

            if (changeArray.includes(true)) {
                actions.classList.add('is-dark');
            } else {
                actions.classList.remove('is-dark');
            }
        })

        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        window.addEventListener("load", () => {
            asscroll.enable();
        });
    }


    scrollWatch() {
        const _this = this;
        const actions = document.querySelector('#dm__navbar-container');
        const light = document.querySelectorAll('.light');
        let lightMode = [];

        for (let lightEl of light) {
            const elFromTop = lightEl.offsetTop;
            const elHeight = lightEl.offsetHeight;
            const darkStart = elFromTop;
            const darkEnd = elFromTop + elHeight;

            lightMode.push({
               start: darkStart,
               end: darkEnd 
            })
        }

        window.addEventListener('resize', () => {
            lightMode = [];

            for (let lightEl of light) {
                const elFromTop = lightEl.offsetTop;
                const elHeight = lightEl.offsetHeight;
                const darkStart = elFromTop;
                const darkEnd = elFromTop + elHeight;
    
                lightMode.push({
                   start: darkStart,
                   end: darkEnd 
                })
            }
        });

        window.addEventListener('scroll', (e) => {
            const scrollPos = window.scrollY;
            let changeArray = [];

            for (let i = 0; i < lightMode.length; i++) {
                if (scrollPos >= lightMode[i].start && scrollPos <= lightMode[i].end) {
                    changeArray.push(true);
                } else {
                    changeArray.push(false);
                }
            }

            if (changeArray.includes(true)) {
                actions.classList.add('is-dark');
            } else {
                actions.classList.remove('is-dark');
            }
        });
    }


    navElements() {
        return {
            page: document.querySelector('#dm__page-wrap'),

            navBar: document.querySelector('#dm__navbar-container'),
            navBarLogo: document.querySelector('#dm__navbar-logo'),
            navBarList: document.querySelector('#dm__nav'),
            navBarCta: document.querySelector('#dm__nav-call-to-action'),
            navBarSubmenuLinks: document.querySelectorAll('#dm__nav .dm__has-children'),
            navBarSubmenuBackground: document.querySelector('.dm__nav-background'),
            navBarSubmenuBackgroundArrow: document.querySelector('.dm__nav-background .dm__nav-background-arrow'),
            navBarMobileList: document.querySelector('#dm__mobile-nav'),
            navBarToggle: document.querySelector('#dm__mobile-nav .dm__nav-toggle'),
            
            // Offcanvas nav
            offCanvasNav: document.querySelector('#dm__offcanvas-nav-container'),
            offCanvasNavBg1: document.querySelector('#dm__offcanvas-nav-bg-one'),
            offCanvasNavBg2: document.querySelector('#dm__offcanvas-nav-bg-two'),
            offCanvasNavLi: document.querySelectorAll('#dm__offcanvas-nav > li'),
            offCanvasNavLinks: document.querySelectorAll('#dm__offcanvas-nav > li > a > span'),
            subnavToggleLI: document.querySelectorAll('#dm__offcanvas-nav li.dm__has-children'),
            subnavToggleNavBack: document.querySelectorAll('#dm__offcanvas-nav li.dm__has-children .dm__nav-back')
        }
    }


    navToggleHandler() {
        const _this = this;
        const {navBarToggle, navBar} = _this.navElements();
        const {offCanvasNavTl} = _this.navAnimations();

        if (!navBar || !navBarToggle) return;

        const callback = () => {
            const isActive = navBarToggle.dataset.navActive;

            if (isActive === 'false') {
                offCanvasNavTl.play();

                navBarToggle.dataset.navActive = 'true';

                navBar.dataset.navActive = 'true';

                _this.windowDisableScroll();
            } else {
                offCanvasNavTl.reverse();

                navBarToggle.dataset.navActive = 'false';

                navBar.dataset.navActive = 'false';

                _this.windowEnableScroll();
            }
        }

        this.eventHandler(navBarToggle, 'click', callback);
        this.eventHandler(navBarToggle, 'keyup', callback);

        window.addEventListener('resize', (e) => {
            if (navBarToggle.dataset.navActive === 'true') callback(e);
        });
    }


    navAnimations() {
        const {offCanvasNav, offCanvasNavBg1, offCanvasNavBg2, page, offCanvasNavLinks, offCanvasNavLi} = this.navElements();
        const animObj = {
            offCanvasNavTl: gsap.timeline({paused: true, reverse: true}),

            duration: .8,
            easing: CustomEase.create("custom", "M0,0 C0.404,0 0.098,1 1,1 ")
        }

        gsap.set(offCanvasNav, {
            opacity: 0,
            display: 'none'
        });

        gsap.set([offCanvasNavBg1, offCanvasNavBg2], {
            scaleX: 0,
            display: 'none'
        });

        gsap.set(offCanvasNavLinks, {
            translateY: `100%`,
        })

        animObj.offCanvasNavTl.to(page, {
            translateX: '-10%',
            scale: .95,
            filter: 'blur(20px)',
            duration: animObj.duration,
            ease: animObj.easing,
            onStart: () => {
                gsap.set(offCanvasNavLi, {
                    clearProps: 'all'
                })
            }
        }).to(offCanvasNavBg1, {
            display: 'block',
            scaleX: 1,
            rotate: 0,
            skewY: 0,
            duration: animObj.duration,
            delay: -animObj.duration,
            ease: animObj.easing
        }).to(offCanvasNav, {
            display: 'block',
            opacity: 1,
            duration: 0.3,
            ease: animObj.easing
        }).to(offCanvasNavLinks, {
            delay: -.2,
            translateY: 0,
            duration: .4,
            stagger: {from: 'start', each: .15},
            clearProps: 'transform'
        })

        return animObj;
    }

    
    offCanvasNavSubmenuToggle() {
        const _this = this;
        const {subnavToggleLI, subnavToggleNavBack} = this.navElements();

        if (subnavToggleLI.length < 1) return;

        const callback = (e) => {
            _this.offCanvasNavSubmenuAnimations(e.target);
        }


        for (let subnavToggle of subnavToggleLI) {
            _this.eventHandler(subnavToggle.querySelector('a'), 'click', callback);
            _this.eventHandler(subnavToggle.querySelector('a'), 'keyup', callback);
        }
    }


    offCanvasNavSubmenuBack() {
        const _this = this;
        const {subnavToggleNavBack} = this.navElements();

        if (subnavToggleNavBack.length < 1) return;

        const callback = (e) => {
            _this.offCanvasNavSubmenuBackAnimations(e.target.parentElement.parentElement.previousElementSibling);
        }

        for (let navBack of subnavToggleNavBack) {
            _this.eventHandler(navBack, 'click', callback);
        }
    }


    offCanvasNavSubmenuAnimations(link) {
        const parentUL = link.parentElement.parentElement;
        const parentLI = link.parentElement;
        const siblingUL = link.nextElementSibling;
        const tl = gsap.timeline({paused: true});
        const duration = .4;
        const easing = CustomEase.create("custom", "M0,0 C0.404,0 0.098,1 1,1 ");

        tl.to(parentUL.querySelectorAll(':scope > li > a'), {
            duration: duration,
            opacity: 0,
            ease: easing
        }).to(parentUL, {
            delay: -duration,
            scale: 1.1,
            pointerEvents: 'none',
            duration: duration,
            ease: easing
        }).to(siblingUL, {
            delay: -duration,
            duration: duration,
            display: 'block',
            opacity: 1,
            scale: .9,
            pointerEvents: 'auto'
        });

        tl.play();
    }


    offCanvasNavSubmenuBackAnimations(link) {
        const parentUL = link.parentElement.parentElement;
        const parentLI = link.parentElement;
        const siblingUL = link.nextElementSibling;
        const tl = gsap.timeline({reversed: true, paused: true});
        const duration = .4;
        const easing = CustomEase.create("custom", "M0,0 C0.404,0 0.098,1 1,1 ");

        tl.to(siblingUL, {
            duration: duration,
            display: 'none',
            opacity: 0,
            scale: .8,
            pointerEvents: 'none'
        }).to(parentUL.querySelectorAll(':scope > li > a'), {
            delay: -duration,
            duration: duration,
            opacity: 1,
            ease: easing
        }).to(parentUL, {
            delay: -duration,
            scale: 1,
            pointerEvents: 'auto',
            duration: duration,
            ease: easing
        });

        tl.play();
    }


    clearOffCanvasSubmenuAnimations() {

    }


    navDropdownHandler() {
        const _this = this;
        const subnavParents = this.navElements().navBarSubmenuLinks;
        const subnavBg = this.navElements().navBarSubmenuBackground;

        if (subnavParents.length === 0 && !subnavBg) return;

        for (let subnavParent of subnavParents) {
            subnavParent.addEventListener('mouseenter', (e) => {_this.navDropdownAnimationsEnter(e)});
            subnavParent.addEventListener('mouseleave', (e) => {_this.navDropdownAnimationsExit(e)});
        }

        const subnavDetails = subnavParents[0].parentElement.getBoundingClientRect();

        subnavBg.style.height = `${subnavDetails.height * 4}px`;
        subnavBg.style.width = `${subnavDetails.width}px`;
    }


    navDropdownAnimationsEnter(e) {
        const subnav = e.target.querySelector('ul');
        const navBackground = this.navElements().navBarSubmenuBackground;
        const navBackgroundArrow = this.navElements().navBarSubmenuBackgroundArrow;
        const linkWidth = e.target.offsetWidth;
        const linkMiddle = e.target.getBoundingClientRect().left + linkWidth / 2;
        let direction = e.clientX >= linkMiddle ? '' : '-';
        let subnavDetails;

        const subnavTL = gsap.timeline();
        const translationOffset = gsap.set(subnav, {
            translateX: `${direction}16px`,
            display: 'none'
        });
        const subnavAnimation = subnavTL.to(subnav, {
            duration: 0,
            display: 'block',
            onComplete: () => {
                subnavDetails = subnav.getBoundingClientRect();
            }
        }).to(subnav, {
            opacity: 1,
            translateX: 0,
            duration: .2
        });

        const navBackgroundAnimation = gsap.to(navBackground, {
            duration: .2,
            opacity: 1,
            height: subnavDetails.height
        });

        const navBackgroundArrowAnimation = gsap.to(navBackgroundArrow, {
            duration: .2,
            left: e.target.offsetLeft + (e.target.offsetWidth / 2) - (navBackgroundArrow.offsetWidth / 2)
        });
    }


    navDropdownAnimationsExit(e) {
        const subnav = e.target.querySelector('ul');
        const navBackground = this.navElements().navBarSubmenuBackground;
        const linkWidth = e.target.offsetWidth;
        const linkMiddle = e.target.getBoundingClientRect().left + linkWidth / 2;
        let direction = e.clientX >= linkMiddle ? '' : '-';

        const subnavAnimation = gsap.to(subnav, {
            duration: .2,
            display: 'none',
            opacity: 0,
            translateX: `${direction}16px`,
        });

        const navBackgroundAnimation = gsap.to(navBackground, {
            duration: .2,
            opacity: 0
        })
    }


    navHeadroomHandler() {
        const {navBar, navBarToggle, navBarList} = this.navElements();

        if (!navBar || !navBarToggle || !navBarList) return;

        this.navHeadroomAnimations();
    }


    navHeadroomAnimations() {
        const _this = this;
        const {navBarMobileList, navBarCta, navBarList, navBarToggle, navBar} = this.navElements();
        const {offCanvasNavTl} = _this.navAnimations();
        const animationObj = {
            navListTL: gsap.timeline({paused: true, reversed: true}),

            mediaQuery: gsap.matchMedia(),

            duration: .5,
            easing: CustomEase.create("custom", "M0,0 C0.404,0 0.098,1 1,1 ")
        }

        animationObj.mediaQuery.add('(min-width: 1280px)', () => {
            animationObj.navListTL.to(navBarList, {
                duration: animationObj.duration, 
                opacity: 0, 
                display: 'none', 
                ease: animationObj.easing
            }).to(navBarCta, {
                delay: `-${animationObj.duration}`,
                duration: animationObj.duration,
                opacity: 0, 
                display: 'none',
                ease: animationObj.easing
            }).to(navBarMobileList, {
                duration: animationObj.duration * 2, 
                opacity: 1, 
                display: 'flex', 
                ease: animationObj.easing
            });
        });

        animationObj.mediaQuery.add('(min-width: 1280px)', () => {
            ScrollTrigger.create({
                start: `top -156`,
                end: 99999,
                onUpdate: (self) => {
                    if (self.isActive) {
                        animationObj.navListTL.play()
                    } else {
                        animationObj.navListTL.reverse();
                    }
                }
            });
        });

        return animationObj;
    }

    
    homeHeroParallax() {
        const heroBanner = document.querySelector('#dm__home-banner-container');
        const parallaxBG = document.querySelector('#dm__home-banner-image-container');
        const scrollIcon = document.querySelector('.dm__scroll-icon');
        const scrollIconText = document.querySelector('.dm__scroll-icon .text');
        const mediaQuery = gsap.matchMedia();

        if (!heroBanner || !parallaxBG) return;

        gsap.to(parallaxBG, {
            translateY: '-400px',
            scale: 1.2,
            opacity: .8,
            scrollTrigger: {
                trigger: heroBanner,
                scrub: 2
            }
        });

        mediaQuery.add('(min-width: 1280px)', () => {
            gsap.to(scrollIconText, {
                opacity: 0,
                filter: 'blur(10px)',
                scrollTrigger: {
                    trigger: scrollIcon,
                    scrub: 2,
                    start: '10% top',
                    end: 'bottom center'
                }
            });
        });
    }


    homeServicesHandler() {
        const _this = this;
        const servicesSection = document.querySelector('#dm__home-services-container');
        const serviceImages = document.querySelector('#dm__services-hover-container');
        const services = document.querySelectorAll('.dm__service');
        const img1 = document.querySelector('.dm__services-media');
        const img2 = document.querySelector('.dm__services-media.container-2');

        if (services.length < 1) return;

        const callbackIn = (e) => {
            gsap.to(serviceImages, {
                opacity: 1,
                duration: .4
            });
            gsap.to([img1, img2], {
                opacity: .7,
                filter: 'blur(5px)',
                duration: .4
            });
        }

        const callbackOut = (e) => {
            gsap.to(serviceImages, {
                opacity: 0,
                duration: .4
            });
            gsap.to([img1, img2], {
                opacity: 1,
                filter: 'blur(0px)',
                duration: .4
            });
        }

        _this.eventHandler(servicesSection, 'mousemove', (e) => {
            gsap.to(serviceImages, {
                left: e.clientX,
                top: e.clientY,
                duration: .4
            });
        });

        for (let service of services) {
            _this.eventHandler(service, 'mouseover', callbackIn);
            _this.eventHandler(service, 'mouseleave', callbackOut);
        }
    }

    
    homeServicesParallax() {
        const img1 = document.querySelector('.dm__services-media');
        const img1Inner = document.querySelector('.dm__services-media figure');
        const img2 = document.querySelector('.dm__services-media.container-2');
        const img2Inner = document.querySelector('.dm__services-media.container-2 figure');

        const animation1 = gsap.to(img1, {
            translateY: '-10%',
            scrollTrigger: {
                trigger: img1,
                scrub: 1
            }
        });

        const animation1Inner = gsap.to(img1Inner, {
            translateY: '-5%',
            scrollTrigger: {
                trigger: img1,
                scrub: 1
            }
        });

        const animation2 = gsap.to(img2, {
            translateY: '-16%',
            scrollTrigger: {
                trigger: img2,
                scrub: 1
            }
        });

        const animation2Inner = gsap.to(img2Inner, {
            translateY: '-5%',
            scrollTrigger: {
                trigger: img2,
                scrub: 1
            }
        });
    }
}

new Dinsmore;