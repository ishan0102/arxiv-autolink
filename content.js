// content.js
const arxivLinkPattern = /^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/(.*)($|.pdf$)/;

// Get all <a> elements on the page
const links = document.getElementsByTagName("a");
let arxivLinks = [];

for (let link of links) {
    if (arxivLinkPattern.test(link.href)) {
        arxivLinks.push({
            link: link.href,
            position: link.getBoundingClientRect().top + window.pageYOffset,
        });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getArxivLinks") {
        sendResponse({ arxivLinks: arxivLinks });
    } else if (request.message === "scrollToLink") {
        window.scrollTo({ top: request.position - 10, behavior: 'smooth' });
    }
});

