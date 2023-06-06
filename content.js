// content.js
const arxivLinkPattern = /^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/(.*)($|.pdf$)/;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getArxivLinks") {
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

        sendResponse({ arxivLinks: arxivLinks });
    } else if (request.message === "scrollToLink") {
        window.scrollTo({ top: request.position - 40, behavior: 'smooth' });
    }
});
