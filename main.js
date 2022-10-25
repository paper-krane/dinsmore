import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import ASScroll from '@ashthornton/asscroll';

gsap.registerPlugin(ScrollTrigger);

class Dinsmore {
    constructor() {
        this.init();
    }

    init() {
        console.log('Initializing Dinsmore...');
        this.navToggle();
        this.navDropdownHandler();
        this.navHeadroom();
        this.homeHeroInit();
        this.scrollInit();
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

    navToggle() {

    }

    navAnimations() {
        
    }

    navDropdownHandler() {
        const _this = this;
        const subnavParents = document.querySelectorAll('#dm__nav .dm__has-children');
        const subnavBg = document.querySelector('.dm__nav-background');

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
        const navBackground = document.querySelector('.dm__nav-background');
        const navBackgroundArrow = document.querySelector('.dm__nav-background .dm__nav-background-arrow')
        const linkWidth = e.target.offsetWidth;
        const linkMiddle = e.target.getBoundingClientRect().left + linkWidth / 2;
        let direction = e.clientX >= linkMiddle ? '' : '-';
        let subnavDetails;

        const subnavTL = gsap.timeline();
        const translationOffset = gsap.set(subnav, {
            translateX: `${direction}16px`
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
        const navBackground = document.querySelector('.dm__nav-background');
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

    navHeadroom() {

    }

    homeHeroInit() {
        
    }
}

new Dinsmore;