const arxivLinkPattern = /^https?:\/\/(www\.)?arxiv\.org\/(abs|pdf)\/(.*)$/;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getArxivLinks") {
        // Get all <a> elements on the page
        const links = document.getElementsByTagName("a");
        let arxivLinks = {};

        for (let link of links) {
            if (arxivLinkPattern.test(link.href)) {
                let modifiedLink = link.href.replace('/pdf/', '/abs/');
                modifiedLink = modifiedLink.replace('.pdf', '');

                // Add the link object to the arxivLinks object
                // If the URL is already in the object, it will simply overwrite the existing entry
                arxivLinks[modifiedLink] = {
                    link: modifiedLink,
                    position: link.getBoundingClientRect().top + window.scrollY,
                };
            }
        }

        // Convert the Object to an Array
        arxivLinks = Object.values(arxivLinks);
        sendResponse({ arxivLinks: arxivLinks });
    } else if (request.message === "scrollToLink") {
        window.scrollTo({ top: request.position - 50, behavior: 'smooth' });
    }
});
