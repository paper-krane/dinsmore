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
        this.scrollInit();
    }

    // Scroll smoother
    scrollInit() {
        // const asscroll = new ASScroll({
        //     disableRaf: true,
        //     ease: .0625
        // });

        // gsap.ticker.add(asscroll.update);

        // ScrollTrigger.defaults({
        //     scroller: asscroll.containerElement
        // });

        // ScrollTrigger.scrollerProxy(asscroll.containerElement, {
        //     scrollTop(value) {
        //         return arguments.length ? asscroll.currentPos = value : asscroll.currentPos;
        //     },
        //     getBoundingClientRect() {
        //         return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
        //     }
        // });
        
        // asscroll.on("update", ScrollTrigger.update);

        // ScrollTrigger.addEventListener("refresh", asscroll.resize);

        // window.addEventListener("load", () => {
        //     asscroll.enable();
        // });
    }

    scrollDestroy() {

    }
}

new Dinsmore;