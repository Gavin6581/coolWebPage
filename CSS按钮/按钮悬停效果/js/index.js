let y = 50;
let x = 50;

const reset = (element) => {
    y = 50;
    x = 50;
    console.log(reset);
    element.setAttribute("data-x", x);
    element.setAttribute("data-y", y);
    element.style.setProperty("--x", x);
    element.style.setProperty("--y", y);
};
const shineItUp = (element) => {
    const rect = element.getBoundingClientRect();
    const data = {
        top: rect.top,
        left: rect.left,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width,
        width: rect.width,
        height: rect.height
    };

    element.addEventListener("mouseout", () => {
        reset(element);
    });
    element.addEventListener("mousemove", (e) => {
        if (
            e.clientX + 20 >= data.left &&
            e.clientX - 20 <= data.right &&
            e.clientY + 20 >= data.top &&
            e.clientY - 20 <= data.bottom
        ) {
            x = Math.round((100 / data.width) * (e.clientX - data.left));
            y = Math.round((100 / data.height) * (e.clientY - data.top));
            element.setAttribute("data-x", x);
            element.setAttribute("data-y", y);
            element.style.setProperty("--x", x);
            element.style.setProperty("--y", y);
        } else {
            reset(element);
        }
    });
};

const shiners = document.querySelectorAll(".shine");
shiners.forEach((shiner) => {
    shineItUp(shiner);
});