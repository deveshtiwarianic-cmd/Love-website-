/*
==========================================
Love Website Generator
script.js
Vanilla JavaScript
==========================================
*/

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const generateBtn = document.querySelector("button");

    if (!form || !generateBtn) return;

    // ===============================
    // Handle Generate Button
    // ===============================
    generateBtn.addEventListener("click", handleGenerate);

    /**
     * Main Function
     */
    async function handleGenerate(event) {
        event.preventDefault();

        clearErrors();

        const data = getFormData();

        if (!validate(data)) return;

        disableButton(true);

        showLoading();

        // Convert images to Base64
        const yourPhoto = await fileToBase64(data.yourPhoto);
        const partnerPhoto = await fileToBase64(data.partnerPhoto);

        // Save Data
        saveData({
            yourName: data.yourName,
            partnerName: data.partnerName,
            occasion: data.occasion,
            yourPhoto,
            partnerPhoto
        });

        // Fake Loading
        setTimeout(() => {
            window.location.href = "website.html";
        }, 2000);
    }

    /**
     * Read Form Values
     */
    function getFormData() {
        return {
            yourName: document.getElementById("yourName")?.value.trim(),
            partnerName: document.getElementById("partnerName")?.value.trim(),
            yourPhoto: document.getElementById("yourPhoto")?.files[0],
            partnerPhoto: document.getElementById("partnerPhoto")?.files[0],
            occasion: document.getElementById("occasion")?.value
        };
    }

    /**
     * Validate Form
     */
    function validate(data) {

        let valid = true;

        if (!data.yourName) {
            showError("yourName", "Please enter your name.");
            valid = false;
        }

        if (!data.partnerName) {
            showError("partnerName", "Please enter your partner name.");
            valid = false;
        }

        if (!data.yourPhoto) {
            showError("yourPhoto", "Please upload your photo.");
            valid = false;
        }

        if (!data.partnerPhoto) {
            showError("partnerPhoto", "Please upload your partner photo.");
            valid = false;
        }

        if (!data.occasion) {
            showError("occasion", "Please select an occasion.");
            valid = false;
        }

        return valid;
    }

    /**
     * Error Message
     */
    function showError(id, message) {
        const input = document.getElementById(id);

        if (!input) return;

        input.style.border = "2px solid #ff4d6d";
        input.animate(
            [
                { transform: "translateX(-6px)" },
                { transform: "translateX(6px)" },
                { transform: "translateX(-6px)" },
                { transform: "translateX(0px)" }
            ],
            {
                duration: 300
            }
        );

        const error = document.createElement("small");
        error.className = "form-error";
        error.style.color = "#ff4d6d";
        error.style.display = "block";
        error.style.marginTop = "6px";
        error.textContent = message;

        input.parentElement.appendChild(error);
    }

    /**
     * Remove Previous Errors
     */
    function clearErrors() {

        document.querySelectorAll(".form-error").forEach(e => e.remove());

        document.querySelectorAll("input, select").forEach(el => {
            el.style.border = "";
        });
    }

    /**
     * Button Loading Animation
     */
    function showLoading() {

        generateBtn.dataset.originalText = generateBtn.textContent;

        generateBtn.innerHTML = "⏳ Generating...";

        let dots = 0;

        const interval = setInterval(() => {

            dots++;

            generateBtn.innerHTML =
                "⏳ Generating" + ".".repeat(dots % 4);

        }, 400);

        setTimeout(() => {
            clearInterval(interval);
        }, 2000);
    }

    /**
     * Enable / Disable Button
     */
    function disableButton(state) {
        generateBtn.disabled = state;
        generateBtn.style.opacity = state ? "0.8" : "1";
        generateBtn.style.cursor = state ? "not-allowed" : "pointer";
    }

    /**
     * Save Local Storage
     */
    function saveData(data) {
        localStorage.setItem(
            "loveWebsiteData",
            JSON.stringify(data)
        );
    }

    /**
     * Convert File -> Base64
     */
    function fileToBase64(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = reject;

            reader.readAsDataURL(file);

        });

    }

});