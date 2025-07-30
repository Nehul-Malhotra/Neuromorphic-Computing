function createStaggerEffect(className, svgPath = null, showUnderline = true) {
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

        // Clear original element and replace with container
        el.innerHTML = '';
        el.appendChild(container);
        container.appendChild(textWrapper);

        // Create underline (optional) - append AFTER text
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

        // Add hover events
        textWrapper.addEventListener('mouseenter', () => {
            // Animate letters
            const letters = textWrapper.querySelectorAll('span[style*="position: relative"]');
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

        textWrapper.addEventListener('mouseleave', () => {
            // Reset letters
            const letters = textWrapper.querySelectorAll('span[style*="position: relative"]');
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
    });
}

pageFiles = {
    "Overview": "index.html",
    "Description": "neuromorphic.html",
    "E-Waste": "E-Waste.html",
}
let pagesHTML = ``
for (const page of pages) {
    if (page !== title){
        pagesHTML += `<a class="pages-div" data-text="${page}" href="${pageFiles[page]}">${page}</a>`;
    }
}

function renderTitleBar() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="title-bar">
            <div class="bar-title" data-text="${title}">${title}</div>
            <div class="pages">${pagesHTML}</div>
        </div>
    `);

    const svgPath = "m16.004 9.414-8.607 8.607-1.414-1.414L14.589 8H7.004V6h11v11h-2z";
    createStaggerEffect('pages-div', svgPath, true);
    createStaggerEffect('bar-title', null, false);
}
