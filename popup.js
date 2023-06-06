// popup.js

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "getArxivLinks" }, (response) => {
        const linksElement = document.getElementById("links");

        for (let linkInfo of response.arxivLinks) {
            // Fetch the page and extract the title
            fetch(linkInfo.link)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const title = doc.querySelector('meta[property="og:title"]').content;

                    // Create a new list item with a link to the paper
                    const listItem = document.createElement("li");
                    const anchor = document.createElement("a");
                    anchor.href = linkInfo.link;
                    anchor.textContent = title;
                    listItem.appendChild(anchor);
                    linksElement.appendChild(listItem);

                    // Open the link in a new tab when clicked
                    anchor.addEventListener("click", function (event) {
                        event.preventDefault();  // Prevent the default link click behavior
                        chrome.tabs.create({ url: event.target.href });  // Open the link in a new tab
                    });

                    let downArrow = document.createElement("div");
                    downArrow.innerHTML = "&#8595;";
                    downArrow.title = "Click to jump to page content";
                    downArrow.style.cursor = "pointer";

                    downArrow.addEventListener("click", function () {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            message: "scrollToLink",
                            position: linkInfo.position
                        });
                    });

                    listItem.appendChild(downArrow);
                    linksElement.appendChild(listItem);
                });
        }
    });
});
