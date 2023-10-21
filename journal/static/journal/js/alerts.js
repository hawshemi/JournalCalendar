document.addEventListener("DOMContentLoaded", () => {
    const alertDiv = document.getElementById("alert");
    
    if (alertDiv) { // Check if the element with ID "alert" exists
        const alertContent = alertDiv.textContent.trim();
        
        if (alertContent.startsWith("Entry already exists on")) {
            const dateText = alertContent.split("Entry already exists on")[1].trim();
            const localeDate = new Date(dateText).toLocaleDateString();
            alertDiv.textContent = `Entry already exists on ${localeDate}.`;
        }

        if (!alertDiv.classList.contains("alert-danger")) {
            setTimeout(() => {
                alertDiv.style.display = "none";
            }, 3000);
        }
    }
});
