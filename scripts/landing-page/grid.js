// VARIABLES
let mouseMoveEffectBool = true;
let mouseX = 0;
let mouseY = 0;

// HTML LAYOUT
const svg = `
<div class="cross-container">
    <svg class="cross" viewBox="0 0 16 16" width="20" height="20">
        <rect width="16" height="16" fill="none" />
        <polygon points="15,7 9,7 9,1 7,1 7,7 1,7 1,9 7,9 7,15 9,15 9,9 15,9"/>
    </svg>
</div>
`;

function mouseMoveEffect(mouseX, mouseY) {
    document.querySelectorAll(".cross").forEach((cross) => {
        const polygon = cross.querySelector("polygon");

        const rect = cross.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const radius = 200;
        const maxSaturation = colorScheme.accent.hsl.saturation;
        const saturation = Math.max(0, maxSaturation * (1 - distance / radius));

        if (distance < radius) {
            polygon.style.fill = `hsl(${colorScheme.accent.hsl.hue}, ${saturation}%, ${colorScheme.accent.hsl.lightness}%)`;
            polygon.style.opacity = Math.max((colorScheme.alpha + 0.2), 1 - distance / radius);
            cross.style.transform = `rotate(45deg)`;
        } else {
            polygon.style.fill = colorScheme.secondary;
            polygon.style.opacity = colorScheme.alpha;
            cross.style.transform = `rotate(0deg)`;
        }
    });
}

function renderGrid() {
    document.body.insertAdjacentHTML('afterbegin', `<div class="grid">${svg.repeat(1000)}</div>`);

    // PARALLAX EFFECT
    const grid = document.querySelector('.grid');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const maxShift = 200;

        grid.style.transform = `translate(${x * maxShift}px, ${y * maxShift}px)`;
    });

    // MOUSE EFFECTS EVENT LISTENERS
    document.addEventListener("mousemove", (e) => {
        if (!mouseMoveEffectBool) return;
        mouseX = e.clientX;
        mouseY = e.clientY;
        mouseMoveEffect(mouseX, mouseY);
    });
}

// LOADED TRANSITION
function loadedTransition(){
    mouseMoveEffectBool = false;

    document.querySelectorAll(".cross").forEach((cross) => {
        const polygon = cross.querySelector("polygon");

        polygon.style.transition = "all 1s ease";
        polygon.style.fill = colorScheme.accent.rgb;
        cross.style.transform = `rotate(45deg)`;
        polygon.style.opacity = 1;
    });

    setTimeout(() => {
        const title = document.querySelector(".title");
        const container = document.querySelector(".container");

        title.style.opacity = "0";
        mouseMoveEffectBool = true;
        mouseMoveEffect(mouseX, mouseY);
        document.querySelectorAll("polygon").forEach(polygon => {polygon.style.transition = ""})
        setTimeout(() => {
            container.remove();
            loadLandingPageInfo();
        }, 1000)

    }, 5*1000)
}