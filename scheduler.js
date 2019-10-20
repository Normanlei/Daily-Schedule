$(document).ready(function () {
    //Variable define
    var loadAlarm;

    //show current time
    function showTime() {
        $("#currentDay").html((moment().format('MMMM Do YYYY')) + "<br><br>" + (moment().format('hh:mm:ss a')));
        // trigger updateStatus function every hour and clear localStore everyday
        var currentMin = moment().format('m');
        var currentSec = moment().format('s'); 
        var currentHour = moment().format('H');
        if (currentHour==24 && currentMin == 0 && currentSec == 0) {
            updateStatus();
            clearSchedule();
            showData();
        }      
        else if (currentMin == 0 && currentSec == 0) {
            updateStatus();
        }
    }
    setInterval(showTime, 1000);


    //build Row Function
    function buildRow() {
        //set up a loop to build time one-hour block from 8am-8pm, since 9am is built, we start at 10am
        for (var i = 9; i <= 20; i++) {
            var tempRow = $("<tr id='" + i + "'>");
            $("tbody").append(tempRow);
            var timeStr;
            if (i < 12) timeStr = i + " " + "AM";
            else if (i == 12) timeStr = i + " " + "PM";
            else timeStr = (i - 12) + " " + "PM";
            //append time block
            tempRow.append("<td class='time-block hour' value='" + i + "'>" + timeStr + "</td>");

            //apend textarea and saveBtn row
            var textarea = "<textarea type='event' class='description'></textarea>";
            var saveBtn = "<button type='save' class='btn saveBtn'><i class='fas fa-lock'></i></button>";
            tempRow.append("<td class='row'>" + textarea + saveBtn + "</td>");

            //build time-options 
            var tempOption = "<option value='" + i + "'>" + timeStr + "</option>";
            $("#time-options").append(tempOption);
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
        var currentHour = moment().format('H');
        if (currentHour == 24) {
            currentHour = 0;
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
    updateStatus();


    // clear the calendar when next date
    function clearSchedule() {
        localStorage.clear();
    }


    // set Alarm
    var alarmSound = new Audio();
    alarmSound.src = "./Sounds/Alert/Alert-01.mp3";



    $("#enable").on('click', iniAlarm);
    $("#unable").on('click', cancelAlarm);
    $("#snooze").on('click', snoozeAlarm);
    $("#stop").on('click', stopAlarm);

    function iniAlarm() {
        var currentYear = moment().format('YYYY');
        var currentMonth = moment().format('M');
        var currentDay = moment().format('D');
        //var currentTime = 10;
        var alarmHour = parseInt($("#time-options").val());
        localStorage.setItem("alarm", alarmHour);
        var alarmTime = parseInt((new Date(currentYear, currentMonth - 1, currentDay, alarmHour)).getTime());
        //console.log(alarmTime);
        var currentTime = parseInt((new Date()).getTime());

        if (currentTime >= alarmTime) {
            alert("The alarm you set has passed!!!");
            return;
        }
        else {
            var alarmTrigger = $("#" + alarmHour + " .row .description").val();
            //console.log(alarmTrigger.length);
            if (alarmTrigger !== undefined && alarmTrigger.length > 0) {
                loadAlarm = setTimeout(triAlarm, (alarmTime-currentTime));
            }else {
                var flag = confirm("There is no event at this hour, are you sure to set an alarm?");
                if (flag) {
                    loadAlarm = setTimeout(triAlarm, (alarmTime-currentTime));
                }
            }
        }
        $("#enable").css("display","none");
        $("#unable").css("display","inline-block");
    }

    function cancelAlarm(){
        clearTimeout(loadAlarm);
        stopAlarm();
        localStorage.removeItem("alarm");
        $("#unable").css("display","none");
        $("#enable").css("display","inline-block");
    }

    function triAlarm() {
        alarmSound.play();
        alarmSound.loop = true;
        $(".alarmSelect").css("display", "none");
        $(".alarmControl").css("display", "inline-block");
        $("#ps").css("display", "none");
    }

    function snoozeAlarm() {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        $(".alarmControl").css("display", "none");
        $(".alarmSelect").css("display", "inline-block");
        $("#ps").css("display", "");
        setTimeout(triAlarm, 5000); //snooze in 5min
    }

    function stopAlarm() {
        alarmSound.pause();
        alarmSound.currentTime = 0;
        $(".alarmControl").css("display", "none");
        $(".alarmSelect").css("display", "inline-block");
        $("#ps").css("display", "");
        $("#unable").css("display","none");
        $("#enable").css("display","inline-block");
    }
    recoverAlarm();
    function recoverAlarm(){
        var preAlarm = localStorage.getItem("alarm");
        if (!isNaN(preAlarm) && preAlarm!==null){
        console.log(preAlarm);
        $("#time-options").val(preAlarm);
        iniAlarm();
        }
    }
});

