chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { message: "getArxivLinks" }, (response) => {
        const linksElement = document.getElementById("links");
        const countElement = document.getElementById("count");  // Get the count element

        // Update the link count
        countElement.textContent = `Found ${response.arxivLinks.length} links.`;

        // Generate all fetch Promises
        const fetchPromises = response.arxivLinks.map((linkInfo) =>
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
                    anchor.style.textDecoration = "none"; // Remove underline

                    const arrowContainer = document.createElement("span");
                    arrowContainer.innerHTML = "&#8595;";
                    arrowContainer.title = "Click to jump to page content";
                    arrowContainer.style.cursor = "pointer";
                    arrowContainer.style.color = "blue"; // Change the color of the arrow

                    arrowContainer.addEventListener("click", function (event) {
                        event.stopPropagation(); // Prevent the click event from bubbling up to the anchor link
                        chrome.tabs.sendMessage(tabs[0].id, {
                            message: "scrollToLink",
                            position: linkInfo.position,
                            link: linkInfo.link
                        });
                    });

                    arrowContainer.addEventListener("mouseenter", function () {
                        arrowContainer.style.backgroundColor = "#b31b1b";
                        arrowContainer.style.color = "white";
                    });

                    arrowContainer.addEventListener("mouseleave", function () {
                        arrowContainer.style.backgroundColor = "";
                        arrowContainer.style.color = "blue";

                    });

                    const arrowWrapper = document.createElement("span");
                    arrowWrapper.style.marginLeft = "5px";
                    arrowWrapper.addEventListener("mouseenter", function () {
                        arrowContainer.style.backgroundColor = "transparent"; // Set background-color to transparent on hover
                    });

                    arrowWrapper.addEventListener("mouseleave", function () {
                        arrowContainer.style.backgroundColor = ""; // Reset background-color when not hovering
                    });

                    arrowWrapper.appendChild(arrowContainer);
                    anchor.appendChild(arrowWrapper);
                    listItem.appendChild(anchor);
                    linksElement.appendChild(listItem);

                    // Open the link in a new tab when clicked
                    anchor.addEventListener("click", function (event) {
                        event.preventDefault();  // Prevent the default link click behavior
                        chrome.tabs.create({ url: event.target.href });  // Open the link in a new tab
                    });
                    return listItem;
                })
        );

        // Wait for all fetch Promises to complete
        Promise.all(fetchPromises)
            .then((listItems) => {
                for (let listItem of listItems) {
                    linksElement.appendChild(listItem);
                }
            })
            .catch((error) => {
                console.error("Error fetching links: ", error);
            });
    });
});
