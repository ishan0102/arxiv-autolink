const arxivLinkPattern = /^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/(.*)$/;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getArxivLinks") {
        // Get all <a> elements on the page
        const links = document.getElementsByTagName("a");
        let arxivLinks = [];

        for (let link of links) {
            if (arxivLinkPattern.test(link.href)) {
                let modifiedLink = link.href.replace('/pdf/', '/abs/');
                modifiedLink = modifiedLink.replace('.pdf', '');
                arxivLinks.push({
                    link: modifiedLink,
                    position: link.getBoundingClientRect().top + window.pageYOffset,
                });
            }
        }

        sendResponse({ arxivLinks: arxivLinks });
    } else if (request.message === "scrollToLink") {
        window.scrollTo({ top: request.position - 50, behavior: 'smooth' });
    }
});
