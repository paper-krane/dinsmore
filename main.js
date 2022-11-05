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

        this.scrollInit();
        this.navToggleHandler();
        this.offCanvasNavSubmenuToggle();
        this.offCanvasNavSubmenuBack();
        this.navDropdownHandler();
        this.navHeadroomHandler();
        this.homeHeroInit();
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
        
        asscroll.on("update", ScrollTrigger.update);

        ScrollTrigger.addEventListener("refresh", asscroll.resize);

        window.addEventListener("load", () => {
            asscroll.enable();
        });

        return asscroll;
    }


    scrollDestroy() {

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
            } else {
                offCanvasNavTl.reverse();

                navBarToggle.dataset.navActive = 'false';

                navBar.dataset.navActive = 'false';
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

        console.log(siblingUL);

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

    
    magneticButton() {

    }


    homeHeroInit() {
        
    }
}

new Dinsmore;