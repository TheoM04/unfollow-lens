document.addEventListener("DOMContentLoaded", () => {

    const followersInput = document.getElementById("followers-input");
    const output = document.getElementById("output");

    followersInput.addEventListener('change', function (event) {
        // event.target.files contains the list of files selected by the user
        const file = event.target.files[0];

        // Make sure a file was actually selected in case they clicked cancel
        if (!file) {
            return;
        }

        // read the file
        const reader = new FileReader();

        // This function runs automatically once the file is finished loading
        reader.onload = function (e) {
            const rawText = e.target.result;
            const parsedData = JSON.parse(rawText);
            console.log("Successfully parsed JSON data");

            // Map each entry to an object with username and href
            const followersSet = new Set(parsedData.map(user => {
                const entry = user.string_list_data[0];
                return {
                    username: entry.value,
                    href: entry.href
                };
            }));

            const followersList = parsedData.map(user => {
                const entry = user.string_list_data[0];
                return {
                    username: entry.value,
                    href: entry.href
                };
            });

            console.log(`Followers List: ${followersList.map(item => { return item.username })}`);
            console.log(`Followers List: ${followersList.length}`)
            console.log(`Followers Set: ${followersSet.size}`)
            output.innerHTML = followersList.map(user => `<p>${user.username}</p>`).join("");
        };

        // Start reading the file as plain text
        reader.readAsText(file);
    });
});