document.addEventListener("DOMContentLoaded", () => {
    const followersInput = document.getElementById("followers-input");
    const followingInput = document.getElementById("following-input");
    const followersOutput = document.getElementById("followers-output");
    const followingOutput = document.getElementById("following-output");

    let followersSet = null;
    let followingList = null;

    // Process Followers File
    followersInput.addEventListener("change", (event) => {
        readFile(event, (parsedData) => {
            // Store just usernames in a Set for fast lookup
            followersSet = new Set(
                parsedData.map((user) => user.string_list_data[0].value)
            );

            console.log(`Followers size: ${followersSet.size}`)
            console.log(`Followers set: ${parsedData.map((user) => user.string_list_data[0].value)}`)

            // Render followers list UI
            //followersOutput.innerHTML = parsedData
            //    .map((user) => `<p>${user.string_list_data[0].value}</p>`)
            //    .join("");

            if (followersSet !== null && followingList !== null)
                checkAndCompare(followersSet, followingList);
        });
    });

    // Process Following File
    followingInput.addEventListener("change", (event) => {
        readFile(event, (parsedData) => {
            followingList = parsedData.relationships_following.map((item) => ({
                username: item.title,
                href: getCleanInstagramUrl(item.title)
            })).filter(user => !user.username.startsWith("__deleted__"));

            console.log(`Following size: ${followingList.length}`)
            console.log(`Following list: ${followingList.map(user => user.username)}`)

            // Render following list UI
            //followingOutput.innerHTML = followingList
            //    .map((user) => `<p>${user.username}</p>`)
            //    .join("");

            if (followersSet !== null && followingList !== null)
                checkAndCompare(followersSet, followingList);
        });
    });
});

// Reusable Async FileReader Helper
function readFile(event, callback) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const parsedData = JSON.parse(e.target.result);
        callback(parsedData); // Pass data back to caller when ready
    };

    reader.readAsText(file);
}

// Comparison Function
function checkAndCompare(followersSet, followingList) {
    if (!followersSet || !followingList) return;

    // Accounts i follow that do not follow back
    const nonFollowers = followingList
        .filter(user => !followersSet.has(user.username));

    console.log("Non-followers count:", nonFollowers.length);
    console.log("Non-followers:", nonFollowers);

    // Convert followingList to a Set of usernames for O(1) lookup
    const followingSet = new Set(followingList.map(u => u.username));

    // People that i don't follow back
    const fans = [...followersSet]
        .filter((username) => !followingSet.has(username))
        .map((username) => ({
            username: username,
            href: getCleanInstagramUrl(username)
        }));

    console.log("Fans count:", fans.length);
    console.log("Fans:", fans);

    renderResults(nonFollowers, fans);
}

function renderResults(nonFollowers, fans) {
    const resultsOutput = document.getElementById("results-output");
    if (!resultsOutput) return;

    // Clear previous output safely
    resultsOutput.replaceChildren();

    // Create Tab Header Container
    const tabsHeader = document.createElement("div");
    tabsHeader.className = "tabs-header";

    // Create Tab Buttons
    const nonFollowersBtn = document.createElement("button");
    nonFollowersBtn.className = "tab-btn active";
    nonFollowersBtn.textContent = `Not Following Back (${nonFollowers.length})`;

    const fansBtn = document.createElement("button");
    fansBtn.className = "tab-btn";
    fansBtn.textContent = `Fans (${fans.length})`;

    tabsHeader.appendChild(nonFollowersBtn);
    tabsHeader.appendChild(fansBtn);

    // Create Content Panels
    const nonFollowersPanel = document.createElement("div");
    nonFollowersPanel.className = "tab-content active";
    nonFollowersPanel.appendChild(buildUserListElement(nonFollowers, "No non-followers found!"));

    const fansPanel = document.createElement("div");
    fansPanel.className = "tab-content";
    fansPanel.appendChild(buildUserListElement(fans, "No fans found!"));

    // Attach Tab Switcher Event Listeners
    nonFollowersBtn.addEventListener("click", () => {
        nonFollowersBtn.classList.add("active");
        fansBtn.classList.remove("active");
        nonFollowersPanel.classList.add("active");
        fansPanel.classList.remove("active");
    });

    fansBtn.addEventListener("click", () => {
        fansBtn.classList.add("active");
        nonFollowersBtn.classList.remove("active");
        fansPanel.classList.add("active");
        nonFollowersPanel.classList.remove("active");
    });

    // Mount everything to the output container
    resultsOutput.appendChild(tabsHeader);
    resultsOutput.appendChild(nonFollowersPanel);
    resultsOutput.appendChild(fansPanel);
}

// Helper function to build user cards HTML
function buildUserListElement(users, emptyMessage) {
    const container = document.createElement("div");

    if (users.length === 0) {
        const emptyParagraph = document.createElement("p");
        emptyParagraph.className = "empty-msg";
        emptyParagraph.textContent = emptyMessage; // Safe text insertion
        container.appendChild(emptyParagraph);
        return container;
    }

    const listDiv = document.createElement("div");
    listDiv.className = "user-list";

    users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";

        const link = document.createElement("a");
        link.href = user.href;
        link.target = "_blank"; // open in new tab
        link.rel = "noopener noreferrer";
        link.textContent = `@${user.username}`;

        card.appendChild(link);
        listDiv.appendChild(card);
    });

    container.appendChild(listDiv);
    return container;
}

function getCleanInstagramUrl(username) {
    return `https://www.instagram.com/${username}/`;
}