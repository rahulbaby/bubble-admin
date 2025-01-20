let countdownInterval;

// Function to start the countdown
function startCountdown() {
    clearInterval(countdownInterval);
    const expiryInput = document.getElementById('expiryDate').value;
    const expiryDate = new Date(expiryInput);

    if (!expiryInput || isNaN(expiryDate.getTime())) {
        document.getElementById('countdown').innerText = "Invalid date and time.";
        return;
    }

    countdownInterval = setInterval(() => {
        const now = new Date();
        const timeDifference = expiryDate - now;

        if (timeDifference <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerText = "The countdown has expired!";
            return;
        }

        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerText =
            `${days}d ${hours}h ${minutes}m ${seconds}s left`;
    }, 1000);
}

// Function to save the expiry date to the database
function saveExpiry() {
    const expiryDate = document.getElementById('expiryDate').value;

    if (!expiryDate) {
        alert("Please select an expiry date!");
        return;
    }

    fetch('/save-expiry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expiryDate })
    })
    .then(response => {
        if (response.ok) {
            alert("Expiry date saved successfully!");
        } else {
            alert("Failed to save expiry date.");
        }
    })
    .catch(error => {
        alert("Error saving expiry date: " + error);
    });
}
