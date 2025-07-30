// CONSTANTS
let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let numChars = 1/6;
let time = 30

let interval = null;


// HTML LAYOUT
document.querySelector("body").insertAdjacentHTML('beforeend', `
    <div class="container">
        <div class="title">
            <div class="title-text">
                <span class="title-span" data-value="NEUROMORPHIC">NEUROMORPHIC</span>
                <p class="title-p" data-value="COMPUTING">COMPUTING</p>
            </div>
            <div class="title-underline">
                <div class="loading">100%</div>
                <div class="text-underline"></div>
            </div>
        </div>
    </div>
`)


// FUNCTIONS
function showLoading(time) {
    const loadingBar = document.querySelector(".loading");
    let loadingInt = 0

    let loading = setInterval(() => {
        document.querySelector(".loading").innerText = `${loadingInt}%`;
        loadingInt++

        if (loadingInt > 100) {
            clearInterval(loading);
        }
    }, time / 100)
}

function underline(underlineElement){
    const loading_width = document.querySelector(".loading").offsetWidth - 10;
    const p_length = document.querySelector(".title-p").dataset.value.length;
    const span_length = document.querySelector(".title-span").dataset.value.length;
    const targetWidth = document.querySelector(".title-text").offsetWidth;

    const timeTaken = ((1/numChars) * time * (p_length + span_length + 4))

    underlineElement.style.width = "0px";
    underlineElement.style.transition = `width ${timeTaken}ms linear`;

    void underlineElement.offsetWidth;

    underlineElement.style.width = `${targetWidth-loading_width}px`;

    showLoading(timeTaken)
}


function letterEffect(pClass, onComplete){
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        pClass.innerText = pClass.innerText
            .split("")
            .map((letter, index) => {
                if(index < iteration) {
                    return pClass.dataset.value[index];
                }

                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if(iteration >= pClass.dataset.value.length){
            clearInterval(interval);
            if (onComplete) onComplete();
        }

        iteration += numChars;
    }, time);
}

function titleUp() {
    const title = document.querySelector(".title");

    title.style.marginBottom = "40px";

    const byLine = document.createElement("p");
    byLine.classList.add("by-line");
    byLine.textContent = "an Overview";

    byLine.style.opacity = "0";
    byLine.style.marginTop = "1.5vh";
    byLine.style.fontFamily = "Poppins";

    title.appendChild(byLine);

    requestAnimationFrame(() => {
        byLine.style.opacity = "1";
    });

    loadedTransition()
}


// PROGRAMS
underline(document.querySelector(".text-underline"));

letterEffect(document.querySelector(".title-span"), () => {
    letterEffect(document.querySelector(".title-p"), titleUp);
});
