function staggerHover(className) {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach(el => {
        const container = el.querySelector('div[style*="flex-direction: column"]');
        if (!container) return;

        const textWrapper = container.querySelector('div[style*="display: flex"]');
        if (!textWrapper) return;

        // Get letter elements
        const letters = textWrapper.querySelectorAll('span[style*="position: relative"]');
        const underline = container.querySelector('div[style*="height: 3px"]');

        // Animate letters
        letters.forEach(letter => {
            const top = letter.querySelector('span:first-child, div:first-child');
            const bottom = letter.querySelector('span:last-child, div:last-child');
            if (top && bottom) {
                top.style.transform = 'translateY(-100%)';
                bottom.style.transform = 'translateY(-100%)';
            }
        });

        // Animate underline (if it exists)
        if (underline) {
            underline.style.width = '100%';
            underline.style.alignSelf = 'flex-start';
        }
    });
}


function staggerLeave(className) {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach(el => {
        const container = el.querySelector('div[style*="flex-direction: column"]');
        if (!container) return;

        const textWrapper = container.querySelector('div[style*="display: flex"]');
        if (!textWrapper) return;

        // Get letter elements
        const letters = textWrapper.querySelectorAll('span[style*="position: relative"]');
        const underline = container.querySelector('div[style*="height: 3px"]');

        // Reset letters
        letters.forEach(letter => {
            const top = letter.querySelector('span:first-child, div:first-child');
            const bottom = letter.querySelector('span:last-child, div:last-child');
            if (top && bottom) {
                top.style.transform = 'translateY(0%)';
                bottom.style.transform = 'translateY(0%)';
            }
        });

        // Reset underline (if it exists)
        if (underline) {
            underline.style.width = '0%';
            underline.style.alignSelf = 'flex-end';
        }
    });
}

function setupStagger(className, svgPath = null, showUnderline = true) {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach(el => {
        const text = el.dataset.text;
        if (!text) return;

        // Create container
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'relative',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        });

        // Create text wrapper
        const textWrapper = document.createElement('div');
        Object.assign(textWrapper.style, {
            display: 'flex',
            gap: '0.05em',
            cursor: 'pointer',
            margin: '0',
            padding: '0',
            alignItems: 'center'
        });

        // Create underline (optional)
        let underline = null;
        if (showUnderline) {
            underline = document.createElement('div');
            Object.assign(underline.style, {
                height: '3px',
                width: '0%',
                backgroundColor: 'currentColor',
                transition: 'width 0.6s ease',
                alignSelf: 'flex-start'
            });
        }

        // Clear original element and replace with container
        el.innerHTML = '';
        el.appendChild(container);
        container.appendChild(textWrapper);

        // Append underline AFTER text wrapper
        if (underline) {
            container.appendChild(underline);
        }

        // Create letters
        [...text].forEach((char, i) => {
            if (char === ' ') {
                const space = document.createElement('span');
                space.innerHTML = '&nbsp;';
                Object.assign(space.style, {
                    display: 'inline-block',
                    width: '0.5em'
                });
                textWrapper.appendChild(space);
                return;
            }

            const wrapper = document.createElement('span');
            Object.assign(wrapper.style, {
                position: 'relative',
                display: 'inline-block',
                overflow: 'hidden'
            });

            const topSpan = document.createElement('span');
            Object.assign(topSpan.style, {
                display: 'block',
                transition: 'transform 0.5s ease',
                transform: 'translateY(0%)',
                transitionDelay: `${i * 50}ms`
            });
            topSpan.textContent = char;

            const bottomSpan = document.createElement('span');
            Object.assign(bottomSpan.style, {
                position: 'absolute',
                top: '100%',
                left: '0',
                display: 'block',
                transition: 'transform 0.5s ease',
                transform: 'translateY(0%)',
                transitionDelay: `${i * 50}ms`
            });
            bottomSpan.textContent = char;

            wrapper.appendChild(topSpan);
            wrapper.appendChild(bottomSpan);
            textWrapper.appendChild(wrapper);
        });

        // Add SVG icon if provided
        if (svgPath) {
            const svgWrapper = document.createElement('span');
            Object.assign(svgWrapper.style, {
                position: 'relative',
                display: 'inline-block',
                overflow: 'hidden',
                marginLeft: '0.5em',
                width: '1em',
                height: '1em'
            });

            // Create SVG element for top layer (empty initially)
            const topSvg = document.createElement('div');
            Object.assign(topSvg.style, {
                display: 'block',
                transition: 'transform 0.5s ease',
                transform: 'translateY(0%)',
                transitionDelay: `${text.replace(/ /g, "").length * 50}ms`,
                width: '1em',
                height: '1em'
            });

            // Create SVG element for bottom layer
            const bottomSvg = document.createElement('div');
            Object.assign(bottomSvg.style, {
                position: 'absolute',
                top: '100%',
                left: '0',
                display: 'block',
                transition: 'transform 0.5s ease',
                transform: 'translateY(0%)',
                transitionDelay: `${text.replace(/ /g, "").length * 50}ms`,
                width: '1em',
                height: '1em'
            });

            // Create the actual SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.fill = 'currentColor';

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', svgPath);
            path.setAttribute('fill', 'currentColor');

            svg.appendChild(path);
            bottomSvg.appendChild(svg);

            svgWrapper.appendChild(topSvg);
            svgWrapper.appendChild(bottomSvg);
            textWrapper.appendChild(svgWrapper);
        }

        // Calculate timing for underline (if it exists)
        if (underline) {
            const numChars = text.replace(/ /g, "").length;
            underline.style.transition = `width ${numChars * 50}ms linear`;
        }

        // Store references for later use (needs to be after all elements are created)
        textWrapper.staggerElements = {
            letters: textWrapper.querySelectorAll('span[style*="position: relative"]'),
            underline: underline
        };
    });
}

function setupUnderline(className, color = "currentColor", thickness = "3px") {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach(el => {
        // Create container
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'relative',
            display: 'inline-block',
            cursor: 'pointer'
        });

        // Move the existing content inside the container
        const content = document.createElement('span');
        content.innerHTML = el.innerHTML;
        container.appendChild(content);

        // Create underline
        const underline = document.createElement('div');
        Object.assign(underline.style, {
            position: 'absolute',
            bottom: '0',
            left: '0',
            height: thickness,
            width: '0%',
            backgroundColor: `var(--accent)`,
            transition: 'width 0.3s ease',
        });
        container.appendChild(underline);

        // Clear original element and insert container
        el.innerHTML = '';
        el.appendChild(container);

        // Hover effect
        container.addEventListener('mouseenter', () => {
            underline.style.width = '100%';
        });
        container.addEventListener('mouseleave', () => {
            underline.style.width = '0%';
        });
    });
}


// FUNCTIONS
function renderNavbar(){

    let articlesHTML = ""
    for (let articleName in articles) {
        articlesHTML += `<div class="nav-article">${articleName}</div>`
    }

    // HTML LAYOUT
    document.body.insertAdjacentHTML('afterbegin', `
            <div class="navbar-wrapper">
                <div class="navbar">
                    <div class="navbar-top">
                        <div class="navbar-title" data-text="${title}">
                            ${title}
                        </div>
                        <div class="nav-articles">${articlesHTML}</div>
                    </div>
                    <div class="themes">
                        <div class="theme-name">${theme}</div>
                        <div class="themes-options">
                            <div class="mode">
                                <div class="light" onclick="isDark=false; updateTheme()"></div>
                                <div class="dark" onclick="isDark=true; updateTheme()"></div>
                            </div>
                            <div class="colors">
                                <div class="colors-1">
                                    <div class="blue" onclick="theme='Crystal Current'; updateTheme()"></div>
                                    <div class="green" onclick="theme='Seaglass Mint'; updateTheme()"></div>
                                </div>
                                <div class="colors-2">
                                    <div class="orange" onclick="theme='Spiced Tangerine'; updateTheme()"></div>
                                    <div class="yellow" onclick="theme='Solar Flare'; updateTheme()"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="arrow-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492.004 492.004" class="navbar-arrow">
                        <path
                            d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z"
                            fill="#ffffff"/>
                    </svg>
                </div>
            </div>
        `)

    // INTERACTIVITY
    const navArea = document.querySelector(".navbar-wrapper");
    const arrow = document.querySelector(".navbar-arrow");
    const arrowButton = document.querySelector(".arrow-button");
    const nav = document.querySelector(".navbar");
    const path = arrow.querySelector("path");
    const nav_title = document.querySelector(".navbar-title")
    const navWidth = 30;
    const letter = nav_title.querySelector(".letter")
    setupStagger("navbar-title", null, false)
    const onNavHover = () => staggerHover("navbar-title");
    const onNavLeave = () => staggerLeave("navbar-title");


    setupUnderline("nav-article", colorScheme.accent.rgb, "3px");

    navArea.addEventListener("mouseover", () => {
        arrow.style.opacity = "1";
        path.style.fill = colorScheme.accent.rgb;
        arrowButton.style.left = `${navWidth}vw`;
        arrowButton.style.transform = "rotate(180deg)";
        arrowButton.style.backgroundColor = `rgba(255, 255, 255, 0)`;
        nav.style.width = `${navWidth}vw`;

        nav_title.addEventListener("mouseover", onNavHover);
        nav_title.addEventListener("mouseleave", onNavLeave);
    })

    navArea.addEventListener("mouseleave", () => {
        arrow.style.opacity = colorScheme.accent + 0.4;
        path.style.fill = colorScheme.secondary;
        arrowButton.style.left = "0";
        arrowButton.style.transform = "rotate(0deg)";
        arrowButton.style.backgroundColor = `rgba(255, 255, 255, 0)`;
        nav.style.width = "0";

        nav_title.removeEventListener("mouseover", onNavHover);
        nav_title.removeEventListener("mouseleave", onNavLeave);
    })
}

function addNavScrollHandlers() {
    const navArticles = document.querySelectorAll('.nav-article');
    const articleKeys = Object.keys(articles);

    navArticles.forEach((article, index) => {
        article.addEventListener('click', (e) => {
            e.preventDefault();

            const articleId = articles[articleKeys[index]];

            history.pushState(null, null, `#${articleId}`);

            scrollToAnchor(articleId);
        });
        article.style.cursor = 'pointer';
    });
}
