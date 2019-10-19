$(document).ready(function () {
    //show current time
    function showTime() {
        $("#currentDay").html((moment().format('MMMM Do YYYY')) + "<br><br>" + (moment().format('hh:mm:ss a')));
    }
    setInterval(showTime, 1000);


    //build Row Function
    function buildRow() {
        //set up a loop to build time one-hour block from 8am-8pm, since 9am is built, we start at 10am
        for (var i = 9; i <= 20; i++) {
            var tempRow = $("<tr id='" + i + "'>");
            $("tbody").append(tempRow);
            var timeStr;
            if (i <= 12) timeStr = i + " " + "AM";
            else timeStr = (i - 12) + " " + "PM";
            //append time block
            tempRow.append("<td class='time-block hour' value='" + i + "'>" + timeStr + "</td>");

            //apend textarea and saveBtn row
            var textarea = "<textarea type='event' class='description'></textarea>";
            var saveBtn = "<button type='save' class='btn saveBtn'><i class='fas fa-lock'></i></button>";
            tempRow.append("<td class='row'>" + textarea + saveBtn + "</td>");
        }
    }
    buildRow();

    //recover the localStorage
    var data = {};
    var storageData = JSON.parse(localStorage.getItem("schedule"));
    if (storageData !== null) data = storageData;
    else localStorage.setItem("schedule", JSON.stringify(data));

    function showData() {
        $.each(data, function (key, value) {
            $("#" + key + " .description").html(value);
        });
    }
    showData();


    //save to localStorage
    $(".saveBtn").on("click", saveData);
    function saveData() {
        event.preventDefault();
        //console.log(event.target.matches("i"));
        //when the button is clicked 
        if (event.target.matches("button")) {
            var tempEvent = event.target.previousElementSibling.value;
            var time = event.target.parentElement.parentElement.id;
        }
        //when the only icon is clicked
        else if (event.target.matches("i")) {
            var tempEvent = event.target.parentElement.previousElementSibling.value;
            var time = event.target.parentElement.parentElement.parentElement.id;
        }
        data[time] = tempEvent;

        localStorage.setItem("schedule", JSON.stringify(data));
    }

    function updateStatus() {
        var currentHour = moment().format('k');
        var currentMin = moment().format('m');
        var currentSec = moment().format('s');
        if (currentHour == 24) {
            currentHour = 0;
            if (currentMin == 0 && currentSec == 0) //make sure clearSchedule function only trigger once
                clearSchdule();
        }
        //another date
        //console.log(currentHour);
        for (var i = 8; i <= 20; i++) {
            if (i < currentHour) {
                $("#" + i + " .row .description").removeClass("present");
                $("#" + i + " .row .description").removeClass("future");
                $("#" + i + " .row .description").addClass("past");
            } else if (i == currentHour) {
                $("#" + i + " .row .description").removeClass("past");
                $("#" + i + " .row .description").removeClass("future");
                $("#" + i + " .row .description").addClass("present");
            } else {
                $("#" + i + " .row .description").removeClass("present");
                $("#" + i + " .row .description").removeClass("past");
                $("#" + i + " .row .description").addClass("future");
            }
        }
    }
    //updateStatus();
    setInterval(updateStatus, 1000);


    // clear the calendar when next date
    function clearSchdule() {
        localStorage.clear();
    }

    var alarmSound = new Audio();
    alarmSound.src = "./Sounds/Alert/Alert-01.mp3";
    alarmSound.muted = "muted";
        alarmSound.play();
});

// // set Alarm
// setTimeout(iniAlarm,5000);
// function iniAlarm() {
//     //var currentTime = moment().format('k'); //string
//     var currentTime = 10;
//     //console.log($("#20 .row .description").val());
//     var alarmTrigger = $("#" + currentTime + " .row .description").val();
//     console.log(alarmTrigger.length);
//     if (alarmTrigger !== undefined && alarmTrigger.length > 0) {
//         //$("#alarmSound").trigger('load');
//         $("#alarmSound").trigger('load');
//         triggerAlarm();
//     }
// }
// //setInterval(iniAlarm,1000);
// function triggerAlarm() {
//     $("#alarmSound").trigger('play');
// }