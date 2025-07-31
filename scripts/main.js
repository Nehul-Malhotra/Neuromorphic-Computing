let isDark = true;
let theme = "Seaglass Mint";

let scheme = localStorage.getItem("scheme")

if (scheme) {
    [theme, isDark] = scheme.split(":")
    isDark = (isDark === "true")
}

console.log(isDark)
console.log(theme)

const themes = ["Seaglass Mint", "Spiced Tangerine", "Crystal Current", "Solar Flare"]
const themesData = {
    "Seaglass Mint": {
        "hex": "#58B09C",
        "hsl": {
            "hue": 166,
            "saturation": 36,
            "lightness": 52
        }
    },

    "Spiced Tangerine":{
        "hex": "#FE5E41",
        "hsl": {
            "hue": 9,
            "saturation": 99,
            "lightness": 63
        }
    },

    "Crystal Current":{
        "hex": "#1098F7",
        "hsl": {
            "hue": 205,
            "saturation": 94,
            "lightness": 52
        }
    },

    "Solar Flare":{
        "hex": "#F0E100",
        "hsl": {
            "hue": 56,
            "saturation": 100,
            "lightness": 47
        }
    }
}

const colorScheme = {
    "accent": {
        "rgb": themesData[theme].hex,
        "hsl": {
            "hue": themesData[theme].hsl.hue,
            "saturation": themesData[theme].hsl.saturation,
            "lightness": themesData[theme].hsl.lightness
        }
    },
    "primary": "",
    "secondary": "",
    "alpha": 0,
    "blur": "",
    "blurHover": ""
}
updateTheme();

function updateTheme() {
    colorScheme.accent.rgb = themesData[theme].hex;
    colorScheme.accent.hsl = themesData[theme].hsl;

    colorScheme.primary = (isDark) ? "#141415" : "#DCDCDD";
    colorScheme.secondary = (isDark) ? "#DCDCDD" : "#141415";
    colorScheme.alpha = (isDark) ? 0.1 : 0.3;
    colorScheme.blur = (isDark) ? "rgba(255, 255, 255, 0)" : "rgba(20, 20, 21, 0.1)";
    colorScheme.blurHover = (isDark) ? "rgba(255, 255, 255, 0.1)" : "rgba(20, 20, 21, 0.2)";

    const root = document.documentElement;
    root.style.setProperty('--accent', colorScheme.accent.rgb);
    root.style.setProperty('--primary', colorScheme.primary);
    root.style.setProperty('--secondary', colorScheme.secondary);
    root.style.setProperty('--alpha', colorScheme.alpha);
    root.style.setProperty('--blur', colorScheme.blur);
    root.style.setProperty('--blurHover', colorScheme.blurHover);
    root.style.setProperty('--accentHue', colorScheme.accent.hsl.hue);
    root.style.setProperty("--accentSaturation", colorScheme.accent.saturation);
    root.style.setProperty("--accentLightness", colorScheme.accent.lightness);

    localStorage.setItem("scheme", `${theme}:${isDark}`)
    const themeName = document.querySelector(".theme-name")

    if (themeName){
        themeName.innerText = `${theme}`
    }
    
    if (theme === "Seaglass Mint"){
        changeIcon("assets/icons/green.svg");
    } else if (theme === "Spiced Tangerine"){
        changeIcon("assets/icons/orange.svg");
    } else if (theme === "Crystal Current"){
        changeIcon("assets/icons/blue.svg");
    } else {
        changeIcon("assets/icons/yellow.svg");
    }
}

function loadLandingPageInfo(){
    renderNavbar()
    renderContent()
    renderTitleBar()


    setTimeout(() => {
        addNavScrollHandlers();
        handleHashNavigation();
    }, 100);

    document.body.addEventListener("dblclick", () => {
        isDark = !isDark;
        updateTheme();
        console.log('Is dark:', isDark);
        mouseMoveEffect(mouseX, mouseY);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderGrid();
});

function scrollToAnchor(anchorId) {
    const targetElement = document.getElementById(anchorId);
    const container = document.querySelector('.articles-container');

    if (targetElement && container) {
        const titleBarHeight = window.innerHeight * 0.1;
        const elementTop = targetElement.offsetTop;
        const scrollPosition = elementTop - titleBarHeight - 20;

        container.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }
}

function handleHashNavigation() {
    if (window.location.hash) {
        setTimeout(() => {
            scrollToAnchor(window.location.hash.substring(1));
        }, 100);
    }
}

window.addEventListener('hashchange', handleHashNavigation);

function changeIcon(iconPath) {
    // Remove existing favicon
    const existingIcon = document.querySelector("link[rel*='icon']");
    if (existingIcon) {
        existingIcon.remove();
    }

    // Create new favicon link
    const newIcon = document.createElement('link');
    newIcon.rel = 'icon';
    newIcon.type = 'image/svg+xml';
    newIcon.href = iconPath;

    // Add to head
    document.head.appendChild(newIcon);
}
