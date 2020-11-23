// Polyfill for IE
if (!Math.sign) {
    Math.sign = function(x) {
        return ((x > 0) - (x < 0)) || +x;
    };
}

// ------------

let canvas = document.getElementById('test'),
    ctx = canvas.getContext('2d'),
    height,
    width,
    particles;

let step = 7;

let init = () => {
    height = window.innerHeight;
    width = window.innerWidth;

    canvas.height = height;
    canvas.width = width;


    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#000';

    let fontSize = Math.min(height, width) / 2.5;

    step = Math.floor(fontSize / 25);

    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';

    ctx.fillText('青年码农', width / 2, height / 2 + fontSize / 4);

    const data = ctx.getImageData(0, 0, width, height).data;
    const data32 = new Uint32Array(data.buffer);

    particles = [];

    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
            const color = data32[y * width + x];

            if (color != 0xFFFFFFFF) {
                particles.push({ x, y });
            }
        }
    }
}

init();
window.onresize = init;

let counter = 0;

function drawIt() {
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        const dY = step * Math.cos(i * 3 + counter),
            radius = step * 0.5 * (dY < -1 ? 1 / Math.abs(dY) : 1);

        ctx.beginPath();
        ctx.arc(
            particles[i].x,
            particles[i].y + dY,
            radius,
            0, 2 * Math.PI,
            false);

        const color = ( /* counter + */ 60 * Math.sign(dY) + 250) % 360;

        ctx.fillStyle = `hsl(${color}, 100%, 50%)`;
        ctx.fill();
    }

    counter += .1;

    requestAnimationFrame(drawIt);
}

drawIt();