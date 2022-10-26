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


    // Scroll smoother
    scrollInit() {
        const asscroll = new ASScroll({
            disableRaf: true,
            ease: .0625
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
    }


    scrollDestroy() {

    }


    navElements() {
        return {
            navBar: document.querySelector('#dm__navbar-container'),
            navBarLogo: document.querySelector('#dm__navbar-logo'),
            navBarList: document.querySelector('#dm__nav'),
            navBarCta: document.querySelector('#dm__nav-call-to-action'),
            navBarSubmenuLinks: document.querySelectorAll('#dm__nav .dm__has-children'),
            navBarSubmenuBackground: document.querySelector('.dm__nav-background'),
            navBarSubmenuBackgroundArrow: document.querySelector('.dm__nav-background .dm__nav-background-arrow'),
            navBarMobileList: document.querySelector('#dm__mobile-nav'),
            navBarMobileToggle: document.querySelector('#dm__mobile-nav .dm__nav-toggle')
        }
    }


    navToggleHandler() {

    }


    navAnimations() {
        
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
        const {navBar, navBarMobileToggle, navBarList} = this.navElements();

        if (!navBar || !navBarMobileToggle || !navBarList) return;

        this.navHeadroomAnimations();
    }


    navHeadroomAnimations() {
        const _ = this;
        const {navBarMobileList, navBarCta, navBarList} = this.navElements();
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
                    self.isActive ? animationObj.navListTL.play() : animationObj.navListTL.reverse();
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