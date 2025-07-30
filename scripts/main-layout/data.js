let articleDivs = ""; // Initialize as empty string, not undefined
let i = 0;

for (let articleName in articles) {
    articleDivs +=
        `<div id="${articles[articleName]}" class="article-div">
            <div class="article-title">${articleName}</div>
            ${articlesContent[i]}
        </div>`;
    i++;
}

console.log(articleDivs);

function renderContent() {
    document.body.insertAdjacentHTML('beforeend', `
        <div class="articles-container">
            <div class="articles-divs">${articleDivs}</div>
        </div>
    `);
}