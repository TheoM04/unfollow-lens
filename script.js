const fileInput = document.getElementById("followers-input");
const output = document.getElementById("output");

fileInput.addEventListener('change', function (event) {
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
        console.log("Successfully parsed JSON data:", parsedData.Greeting);
        output.innerHTML = `${parsedData.Greeting}`
    };

    // Start reading the file as plain text
    reader.readAsText(file);
});