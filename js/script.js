const currentWindow = require('electron').remote.getCurrentWindow();

const Store = require('electron-store');
const store = new Store();
const Dialogs = require('dialogs')
const dialogs = Dialogs()

var workTime = 25;
var breakTime = 5;

var counterDOM = document.getElementById('counter')
var sessionLengthDOM = document.getElementById('session-length')
var breakLengthDOM = document.getElementById('break-length')

counterDOM.innerHTML = workTime + ":00";
sessionLengthDOM.innerHTML = workTime;
breakLengthDOM.innerHTML = breakTime;

var ding = new Audio("audio/ding.mp3"),
    pomodoro = {
        isBreak: false,
        isPaused: false,
        timeRemaining: 0,
        startTime: 0,
        stopTime: 0,
        action1: "start", // The text of the first action button
        // is stored here because it was annoying
        // evaluating the button text directly.
        sessionLength: {
            increase: function () {
                workTime++;
                $("#session-length").text(workTime);
                $("#counter").text(workTime.toString() + ":00");
            },
            decrease: function () {
                if (workTime > 1) {
                    workTime--;
                    $("#session-length").text(workTime);
                    $("#counter").text(workTime.toString() + ":00");
                }
            }
        },
        breakLength: {
            increase: function () {
                breakTime++;
                $("#break-length").text(breakTime);
            },
            decrease: function () {
                if (breakTime > 1) {
                    breakTime--;
                    $("#break-length").text(breakTime);
                }
            }
        },
        reset: function () {
            // This resets the pomodoro object
            // and the DOM to its original state.

            $("#session-length").text(workTime);
            $("#break-length").text(breakTime);

            this.isBreak = false;
            this.isPaused = false;
            this.timeRemaining = 0;
            this.action1 = "start"
            $("#action1").text("start");
            $("#action2").css({
                "visibility": "hidden"
            });
            toggleVisible("show");
            this.startTime = 0;
            this.endTime = 0;
            $("#counter").text(workTime.toString() + ":00");
            makeFullscreen(false)
        },
        start: function () {
            // This starts the timer.
            store.set('isStarted', true);

            this.startTime = new Date().getTime();
            this.endTime = this.startTime + (workTime * 60 * 1000) + 1000; // I added an extra second so that the time the counter displays will start with the inputted breaktime/endtime (start with 18:00 instead of 17:59)
            makeFullscreen(false)
        },
        stop: function () {
            // This stops the timer and resets it using
            // the current values for session and break
            // length.
            store.set('isStarted', false);

            this.reset(); // Do a soft reset.
            makeFullscreen(false)
        },
        pause: function () {
            // This pauses the timer, allowing the user to
            // resume at any later time.
            store.set('isStarted', false);

            this.isPaused = true;
            makeFullscreen(false)
        },
        resume: function () {
            // This starts the timer using the time remaining.
            this.isPaused = false;
            this.startTime = new Date().getTime();
            this.endTime = this.startTime + this.timeRemaining;
            if (pomodoro.isBreak)
                makeFullscreen(true)
            else
                makeFullscreen(false)
        }
    },
    modal = {
        show: function () {
            $("#overlay").css({
                "display": "flex",
                "visibility": "hidden"
            });
            $("#overlay").hide();
            $("#overlay").css({
                "visibility": "visible"
            })
            $("#overlay").fadeIn(300, function () {
                $("#modal").fadeIn(300);
            });
        },
        hide: function () {
            $("#modal").fadeOut(300, function () {
                $("#overlay").fadeOut(300);
            });
        }
    }

function playDing() {
    // Checks if sound is enabled and plays a ding.
    if ($("#switch-sound").is(':checked')) {
        ding.play();
    }
}

function toggleVisible(showHide) {
    // Toggle between the options being visible or not.
    var top = $(".mdl-card__title");
    var bottom = $(".mdl-card__supporting-text");
    if (showHide === "show") {
        $("#message").fadeOut(300, function () {
            top.animate({
                height: 125
            }, 300);
            bottom.slideDown(300);
        });
    } else {
        // hide options.
        top.animate({
            height: top.height() + bottom.height() + 64
        }, 300, function () {
            $("#message").text("Do the thing!");
            $("#message").fadeIn(300);
        });
        bottom.slideUp(300);
    }
}

function msToMinutes(ms) {
    // converts miliseconds into a 0:00 format string
    // showing minutes on the left and seconds on
    // the right.
    var minutes = Math.floor(ms / 60000).toString();
    var seconds = Math.floor((ms % 60000) / 1000).toString();
    if (seconds.length === 1) {
        seconds = "0" + seconds
    }
    return pomodoro.timeRemaining > 0 ? minutes + ":" + seconds : "0:00";
}

window.setInterval(function () {
    if (pomodoro.startTime > 0 &&
        pomodoro.isPaused === false) {
        var now = new Date().getTime();

        pomodoro.timeRemaining = pomodoro.endTime - now;
        $("#counter").text(msToMinutes(pomodoro.timeRemaining));
        if (pomodoro.timeRemaining < 0 &&
            pomodoro.isBreak === false) {
            pomodoro.isBreak = true;
            $("#message").fadeOut(300, function () {
                $("#message").text("Take a break!");
                $("#message").fadeIn(300, function () {
                    playDing();
                });
            })
            pomodoro.endTime = now + (breakTime * 60 * 1000) + 1000;
            makeFullscreen(true)
        } else if (pomodoro.timeRemaining < 0 &&
            pomodoro.isBreak === true) {
            pomodoro.isBreak = false;

            // Because, I want to take breaks as long as possible :P
            pomodoro.stop()
        }
    }
}, 100);

$(document).ready(function () {
    $("#ti255").click(function () {
        pomodoro.reset();
    });
    $("#action1").click(function () {
        if (pomodoro.action1 === "start" ||
            pomodoro.action1 === "resume") {
            // Decide whether to start or resume.
            if (pomodoro.action1 === "start") {
                toggleVisible("hide");
                pomodoro.start();
            } else {
                pomodoro.resume();
            }
            // Change which action buttons are visible.
            pomodoro.action1 = "pause";
            $(this).text(pomodoro.action1);
            $("#action2").css({
                "visibility": "visible"
            });
        } else if (pomodoro.action1 === "pause") {
            pomodoro.pause();
            pomodoro.action1 = "resume";
            $(this).text(pomodoro.action1);
        }
    })
    $("#action2").click(function () {
        toggleVisible("show");
        pomodoro.stop();
        pomodoro.action1 = "start"
        $("#action1").text(pomodoro.action1);
        $("#action2").css({
            "visibility": "hidden"
        });
    })

    $("#session-plus").click(function () {
        pomodoro.sessionLength.increase();
    });
    $("#session-minus").click(function () {
        pomodoro.sessionLength.decrease();
    });
    $("#break-plus").click(function () {
        pomodoro.breakLength.increase();
    });
    $("#break-minus").click(function () {
        pomodoro.breakLength.decrease();
    });

    $("#switch-sound").change(function () {
        playDing();
    });

    $("#about").click(function () {
        modal.show();
    })
    $("#close").click(function () {
        modal.hide();
    })
    $("#overlay").click(function () {
        modal.hide();
    });
    $("#session-length").click(function () {
        setWorkLength()
    })
    $("#session-min").click(function () {
        setWorkLength()
    })
    $("#break-length").click(function () {
        setBreakLength()
    })
    $("#break-min").click(function () {
        setBreakLength()
    })
})

function makeFullscreen(b) {
    if (b) {
        currentWindow.maximize()
        currentWindow.setAlwaysOnTop(b)
        currentWindow.setFullScreen(b)
    } else {
        currentWindow.setAlwaysOnTop(b)
        currentWindow.setFullScreen(b)
        currentWindow.unmaximize()
    }
}

function setWorkLength() {
    console.log("setWorkLength")
    dialogs.prompt('Work Length', ok => {
        if (ok) {
            workTime = parseInt(ok) < 1 ? 1 : parseInt(ok);
            counterDOM.innerHTML = workTime + ":00";
            sessionLengthDOM.innerHTML = workTime;
            breakLengthDOM.innerHTML = breakTime;
        }
    })
}

function setBreakLength() {
    console.log("setBreakLength")
    dialogs.prompt('Break Length', ok => {
        if (ok) {
            breakTime = parseInt(ok) < 1 ? 1 : parseInt(ok);
            counterDOM.innerHTML = workTime + ":00";
            sessionLengthDOM.innerHTML = workTime;
            breakLengthDOM.innerHTML = breakTime;
        }
    })
}