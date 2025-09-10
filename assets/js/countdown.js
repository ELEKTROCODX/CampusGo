
// Event starts at Nov 29, 2025
// Counter ends exactly at 6:00 PM UTC-6
const eventStartDate = new Date("2025-11-29T00:00:00");
// Access countdown elements
let countdownDays = document.getElementById("countdownDays");
let countdownHours = document.getElementById("countdownHours");
let countdownMinutes = document.getElementById("countdownMinutes");
let countdownSeconds = document.getElementById("countdownSeconds");

function updateCountdown() {
    let now = new Date();
    let timeDifference = eventStartDate - now;
    
    if (timeDifference > 0) {
        let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        if(days < 1) {
            countdownDays.style.display = "none";
            countdownSeconds.style.display = "block";
        } else if(days < 10) {
            countdownDays.innerHTML = "0" + days;
            //countdownSeconds.style.display = "none";
        } else {
            countdownDays.innerHTML = days;
            //countdownSeconds.style.display = "none";
        }
        let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(hours < 10) {
            countdownHours.innerHTML = "0" + hours;
        } else {
            countdownHours.innerHTML = hours;
        }
        let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        if(minutes < 10) {
            countdownMinutes.innerHTML = "0" + minutes;
        } else {
            countdownMinutes.innerHTML = minutes;
        }
        let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        if(seconds < 10) {
            countdownSeconds.innerHTML = "0" + seconds;
        } else {
            countdownSeconds.innerHTML = seconds;
        }
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
// Initial call to display countdown immediately
updateCountdown();