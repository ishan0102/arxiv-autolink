// popup.js
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "getArxivLinks" }, (response) => {
        const linksElement = document.getElementById("links");

        for (let link of response.arxivLinks) {
            // Fetch the page and extract the title
            fetch(link)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const title = doc.querySelector('meta[property="og:title"]').content;

                    // Create a new list item with a link to the paper
                    const listItem = document.createElement("li");
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.textContent = title;
                    listItem.appendChild(anchor);
                    linksElement.appendChild(listItem);
                    
                    // Open the link in a new tab when clicked
                    anchor.addEventListener("click", function(event) {
                        event.preventDefault();  // Prevent the default link click behavior
                        chrome.tabs.create({ url: event.target.href });  // Open the link in a new tab
                    });
                });
        }
    });
});
