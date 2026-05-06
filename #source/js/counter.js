var endDate = new Date("sep 9, 2023 15:30:00").getTime();
var timer = setInterval(function() {
    let now = new Date().getTime();
    console.log(now);
    let t = endDate - now;
    
    if (t >= 0) {
    
        let days = Math.floor(t / (1000 * 60 * 60 * 24));
        let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        let secs = Math.floor((t % (1000 * 60)) / 1000);
    
        document.getElementById("timer-days").innerHTML = days +
        "<span class='label'><br> дней</span>";
    
        document.getElementById("timer-hours").innerHTML = ("0"+hours).slice(-2) +
        "<span class='label'><br>часов</span>";
    
        document.getElementById("timer-mins").innerHTML = ("0"+mins).slice(-2) +
        "<span class='label'><br>минут</span>";
    
        document.getElementById("timer-secs").innerHTML = ("0"+secs).slice(-2) +
        "<span class='label'><br>секунд</span>";
    
    } else {
        document.getElementById("timer").innerHTML = "День нашей свадьбы наступил!";
    
    }
    
}, 1000);