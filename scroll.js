window.addEventListener('load', () => {
    const html = document.documentElement;
    const canvas = document.querySelector('#scroll');
    const context = canvas.getContext('2d');
    const frameCount = 120;
    const currentFrame = index => (`./images/scene/${index.toString().padStart(4, '0')}.jpg`);

    const preloadImages = () => {
        for (let i = 1; 1 < frameCount; i++) {
            const img = new Image();

            img.src = currentFrame(i);
        }
    }

    const img = new Image();
    img.src = currentFrame(1);


    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    img.onload = function() {
        context.drawImage(
            img, 
            canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2
        );
    }

    const updateImage = index => {
        img.src = currentFrame(index);
        context.drawImage(
            img, 
            canvas.width / 2 - img.width / 2,
            canvas.height / 2 - img.height / 2
        );
    }

    window.addEventListener('scroll', () => {
        const scrollTop = html.scrollTop;
        const maxScrollTop = html.scrollHeight - window.innerHeight;
        const scrollFraction = scrollTop / maxScrollTop;
        const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));

        requestAnimationFrame(() => updateImage(frameIndex + 1));
    });

    // preloadImages();
});