// content.js
const arxivLinkPattern = /^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/(.*)($|.pdf$)/;

// Get all <a> elements on the page
const links = document.getElementsByTagName("a");
let arxivLinks = [];

for (let link of links) {
    let ct = 0;
    if (arxivLinkPattern.test(link.href)) {
        console.log("Found arXiv link: " + link.href);
        arxivLinks.push(link.href);
        ct++;
        if (ct > 10) {
            break;
        }
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getArxivLinks") {
        sendResponse({ arxivLinks: arxivLinks });
    }
});

