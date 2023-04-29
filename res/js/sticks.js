var double_pinch = ["Skip Back", "Skip Forward", "Voice Assistant"];
var triple_pinch = ["Skip Back", "Skip Forward", "Voice Assistant"];
var pinch_and_hold = ["Volume UP", "Volume Down", "Voice Assistant"];
var double_pinch_and_hold = ["No action", "Volume UP", "Volume Down", "Voice Assistant"];


//---------------------------------------------------------------------------------//

//CURRENTLY SELLECTED BUD ON THE SETTINGS PAGE
var current_site;

//VARS FOR GESTURE SETTINGS, OVERWRITING THHESE WITH EEL WILL MAKE THE TEXT APRPEAR IN THE SETTINGS PAGE ON INITIAL LOAD.
//IF YOU CLICK A BUTTON, IT WILL OVERWRITE THIS VARS AGAIN AND YOU CAN READ THE CONTEXT WITH EEL. YOU JUST NEED TO CHECK 
//IF THESE VARS ARE BEEING UPDATED OR NOT. IF THEY ARE, THEN YOU KNOW THAT THE USER HAS CHANGED THE SETTINGS AND YOU CAN
//READ THE CONTEXT FROM THESE VARS. IF THEY ARE NOT, THEN YOU KNOW THAT THE USER HAS NOT CHANGED THE SETTINGS AND YOU CAN
//READ THE CONTEXT FROM THE EEL VARIABLES. (OR YOU PUT YOUR CODE DIRECTY INTO THE FUNCTIIONS DOWN, MADE YOU SOME HINTS WHERE)
//
//IM JUST PICKING THE FIRST ELEMENT OF THE ARRAY TO INITIALIZE THE VARS AND TO DISPLAY SOMETHING OTHER THAN UNDEFINED ON THE
//SETTINGS PAGE ON INITIAL LOAD. YOU NEED TO REPLACE THIS WITH THE STUFF YOU READ FROM THE BUDS.
var left_triple_pinch_current = triple_pinch[0];
var left_pinch_and_hold_current = pinch_and_hold[0];
var right_triple_pinch_current = triple_pinch[0];
var right_pinch_and_hold_current = pinch_and_hold[0];
var right_double_pinch_and_hold_current = double_pinch_and_hold[0];
var left_double_pinch_and_hold_current = double_pinch_and_hold[0];
var right_double_pinch_current = double_pinch[0];
var left_double_pinch_current = double_pinch[0];

//---------------------------------------------------------------------------------//

async function ringBudLeft(e) {
    var e = document.getElementById("ring_button-l").classList
    if (e.contains("ringing-l")) {
        e.remove("ringing-l")
        document.getElementById("ring_button-l").style.backgroundColor = ""
        document.getElementById("ring_button-l").style.color = ""
        document.getElementById("ring_button-l").innerText = "Ring"
        eel.ringBuds(0, true)
    } else {
        e.add("ringing-l")
        document.getElementById("ring_button-l").style.backgroundColor = "#7f1d1d"
        document.getElementById("ring_button-l").style.color = "#ffffff"
        document.getElementById("ring_button-l").innerText = "STOP"
        eel.ringBuds(1, true)
    }
}

async function ringBudRight(e) {
    var e = document.getElementById("ring_button-r").classList
    if (e.contains("ringing-l")) {
        e.remove("ringing-l")
        document.getElementById("ring_button-r").style.backgroundColor = ""
        document.getElementById("ring_button-r").style.color = ""
        document.getElementById("ring_button-r").innerText = "Ring"
        eel.ringBuds(0, false)
    } else {
        e.add("ringing-l")
        document.getElementById("ring_button-r").style.backgroundColor = "#7f1d1d"
        document.getElementById("ring_button-r").style.color = "#ffffff"
        document.getElementById("ring_button-r").innerText = "STOP"
        eel.ringBuds(1, false)
    }
}

 leftEarPeace = document.getElementById("left_ear_peace")
 rightEarPeace = document.getElementById("right_ear_peace")

 leftEarBattery = document.getElementById("left_ear_battery")
 rightEarBattery = document.getElementById("right_ear_battery")

 prod_name = document.getElementById("prod_name")
 pages_container = document.getElementById("pages_container")
 settings_icon = document.getElementById("settings_icon")

 ringButton = document.getElementById("ring_button")

var intro_timeout;
var intro_timeout2;


intro_timeout = setTimeout(() => {
    leftEarPeace.style.marginTop = "0px"
    rightEarPeace.style.marginTop = "0px"

    intro_timeout2 = setTimeout(() => {
        leftEarBattery.style.opacity = "100"
        rightEarBattery.style.opacity = "100"
        prod_name.style.opacity = "100"
        pages_container.style.opacity = "100"
        // settings_icon.style.opacity = "100"
    }, 2000)
}, 500)

function updateGesturesFromArray(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].gestureDevice == 2) {
            //LEFT
            if (array[i].gestureType == 2) {
                if (array[i].gestureAction == 8) {
                    left_double_pinch_current = double_pinch[0];
                } else if (array[i].gestureAction == 9) {
                    left_double_pinch_current = double_pinch[1];
                } else if (array[i].gestureAction == 11) {
                    left_double_pinch_current = double_pinch[2];
                }
            } else if (array[i].gestureType == 3) {
                //triple tap
                if (array[i].gestureAction == 8) {
                    left_triple_pinch_current = triple_pinch[0];
                } else if (array[i].gestureAction == 9) {
                    left_triple_pinch_current = triple_pinch[1];
                } else if (array[i].gestureAction == 11) {
                    left_triple_pinch_current = triple_pinch[2];
                }
            } else if (array[i].gestureType == 7) {
                //tap and hold
                if (array[i].gestureAction == 18) {
                    left_pinch_and_hold_current = pinch_and_hold[0];
                } else if (array[i].gestureAction == 19) {
                    left_pinch_and_hold_current = pinch_and_hold[1];
                } else if (array[i].gestureAction == 11) {
                    left_pinch_and_hold_current = pinch_and_hold[2];
                }
            } else if (array[i].gestureType == 9) {
                if (array[i].gestureAction == 1) {
                    left_double_pinch_and_hold_current = double_pinch_and_hold[0];
                } else if (array[i].gestureAction == 18) {
                    left_double_pinch_and_hold_current = double_pinch_and_hold[1];
                } else if (array[i].gestureAction == 19) {
                    left_double_pinch_and_hold_current = double_pinch_and_hold[2];
                } else if (array[i].gestureAction == 11) {
                    left_double_pinch_and_hold_current = double_pinch_and_hold[3];
                }
            }
        } else if (array[i].gestureDevice == 3) {
            //RIGHT
            if (array[i].gestureType == 2) {
                if (array[i].gestureAction == 8) {
                    right_double_pinch_current = double_pinch[0];
                } else if (array[i].gestureAction == 9) {
                    right_double_pinch_current = double_pinch[1];
                } else if (array[i].gestureAction == 11) {
                    right_double_pinch_current = double_pinch[2];
                }
            } else if (array[i].gestureType == 3) {
                //triple tap
                if (array[i].gestureAction == 8) {
                    right_triple_pinch_current = triple_pinch[0];
                } else if (array[i].gestureAction == 9) {
                    right_triple_pinch_current = triple_pinch[1];
                } else if (array[i].gestureAction == 11) {
                    right_triple_pinch_current = triple_pinch[2];
                }
            } else if (array[i].gestureType == 7) {
                //tap and hold
                if (array[i].gestureAction == 18) {
                    right_pinch_and_hold_current = pinch_and_hold[0];
                } else if (array[i].gestureAction == 19) {
                    right_pinch_and_hold_current = pinch_and_hold[1];
                } else if (array[i].gestureAction == 11) {
                    right_pinch_and_hold_current = pinch_and_hold[2];
                }
            } else if (array[i].gestureType == 9) {

                if (array[i].gestureAction == 1) {
                    right_double_pinch_and_hold_current = double_pinch_and_hold[0];
                } else if (array[i].gestureAction == 18) {
                    right_double_pinch_and_hold_current = double_pinch_and_hold[1];
                } else if (array[i].gestureAction == 19) {
                    right_double_pinch_and_hold_current = double_pinch_and_hold[2];
                } else if (array[i].gestureAction == 11) {
                    right_double_pinch_and_hold_current = double_pinch_and_hold[3];
                }
            }

        }
    }
}

function loadCurrentGestures(side) {
    eel.sendGetGesture()
    current_side = side
    //LOAD ALL VALUES BASED ON CURRENT SIDE
    if (side == "l") {
        document.getElementById("settings_subtitle_triple").innerHTML = left_triple_pinch_current;
        document.getElementById("settings_subtitle_pinch_and_hold").innerHTML = left_pinch_and_hold_current;
        document.getElementById("settings_subtitle_double_pinch_and_hold").innerHTML = left_double_pinch_and_hold_current;
        document.getElementById("settings_subtitle_double").innerHTML = left_double_pinch_current + "<br />Decline incoming calls</div>";
    } else if (side == "r") {
        document.getElementById("settings_subtitle_triple").innerHTML = right_triple_pinch_current;
        document.getElementById("settings_subtitle_pinch_and_hold").innerHTML = right_pinch_and_hold_current;
        document.getElementById("settings_subtitle_double_pinch_and_hold").innerHTML = right_double_pinch_and_hold_current;
        document.getElementById("settings_subtitle_double").innerHTML = right_double_pinch_current + "<br />Decline incoming calls</div>";
    }

}

function changeGesture(type) {
    if (type == "double") {
        var current_gesture = document.getElementById("settings_subtitle_double").innerHTML;
               
        var show_popup = "";
        for(var i = 0; i < double_pinch.length; i++) {
           show_popup += `
            <option id="${double_pinch[i]}" ${current_site == "l" ? left_double_pinch_current == double_pinch[i] ? "selected" : "" : right_double_pinch_current == double_pinch[i] ? "selected" : ""}>
                ${double_pinch[i]}
            </option>
           `
        }
        displayPopUp(show_popup)

        document.getElementById("list_container").addEventListener("change", function(e) {
            document.getElementById("settings_subtitle_double").innerHTML = document.getElementById("list_container").value +"<br />Decline incoming call"
            if (current_site == "l") {
                left_double_pinch_current = document.getElementById("list_container").value;
                var index = double_pinch.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                eel.sendGestures(2, 2, operation)
            }
            if (current_site == "r") {
                right_double_pinch_current = document.getElementById("list_container").value;
                var index = double_pinch.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                eel.sendGestures(3, 2, operation)
            }
            document.getElementById("list_container").removeEventListener("change", () => {})
            closePopUp()
        })
    } else if (type == "triple") {   
        var current_gesture = document.getElementById("settings_subtitle_triple").innerHTML;
               
        var show_popup = "";
        for(var i = 0; i < double_pinch.length; i++) {
           show_popup += `
            <option id="${triple_pinch[i]}" ${current_site == "l" ? left_triple_pinch_current == triple_pinch[i] ? "selected" : "" : right_triple_pinch_current == triple_pinch[i] ? "selected" : ""}>
                ${triple_pinch[i]}
            </option>
           `
        }
        displayPopUp(show_popup)

        document.getElementById("list_container").addEventListener("change", function(e) {
            document.getElementById("settings_subtitle_triple").innerHTML = document.getElementById("list_container").value
            if (current_site == "l") {
                left_triple_pinch_current = document.getElementById("list_container").value;
                var index = triple_pinch.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                eel.sendGestures(2, 3, operation)
            }
            if (current_site == "r") {
                right_triple_pinch_current = document.getElementById("list_container").value;
                var index = triple_pinch.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                eel.sendGestures(3, 3, operation)
            }
            document.getElementById("list_container").removeEventListener("change", () => { })
            closePopUp()
        })
    } else if (type == "double_pinch_and_hold") {
        var current_gesture = document.getElementById("settings_subtitle_double_pinch_and_hold").innerHTML;
               
        var show_popup = "";
        for(var i = 0; i < double_pinch_and_hold.length; i++) {
           show_popup += `
            <option id="${double_pinch_and_hold[i]}" ${current_site == "l" ? left_double_pinch_and_hold_current == double_pinch_and_hold[i] ? "selected" : "" : right_double_pinch_and_hold_current == double_pinch_and_hold[i] ? "selected" : ""}>
                ${double_pinch_and_hold[i]}
            </option>
           `
        }
        displayPopUp(show_popup)

        document.getElementById("list_container").addEventListener("change", function(e) {
            document.getElementById("settings_subtitle_double_pinch_and_hold").innerHTML = document.getElementById("list_container").value
            if (current_site == "l") {
                left_double_pinch_and_hold_current = document.getElementById("list_container").value;
                var index = double_pinch_and_hold.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 1;
                else if (index == 1) operation = 18;
                else if (index == 2) operation = 19;
                else if (index == 3) operation = 11;
                eel.sendGestures(2, 9, operation)
            }
            if (current_site == "r") {
                right_double_pinch_and_hold_current = document.getElementById("list_container").value;
                var index = double_pinch_and_hold.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 1;
                else if (index == 1) operation = 18;
                else if (index == 2) operation = 19;
                else if (index == 3) operation = 11;
                eel.sendGestures(3, 9, operation)
            }
            document.getElementById("list_container").removeEventListener("change", () => { })
            closePopUp()
        })
    }else if(type == "pinch_and_hold"){
        var current_gesture = document.getElementById("settings_subtitle_pinch_and_hold").innerHTML;
               
        var show_popup = "";
        for(var i = 0; i < pinch_and_hold.length; i++) {
           show_popup += `
            <option id="${pinch_and_hold[i]}" ${current_site == "l" ? left_pinch_and_hold_current == pinch_and_hold[i] ? "selected" : "" : right_pinch_and_hold_current == pinch_and_hold[i] ? "selected" : ""}>
                ${pinch_and_hold[i]}
            </option>
           `
        }
        displayPopUp(show_popup)

        document.getElementById("list_container").addEventListener("change", function(e) {
            document.getElementById("settings_subtitle_pinch_and_hold").innerHTML = document.getElementById("list_container").value
            if (current_site == "l") {
                left_pinch_and_hold_current = document.getElementById("list_container").value;
                var index = pinch_and_hold.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 18;
                else if (index == 1) operation = 19;
                else if (index == 2) operation = 11;
                eel.sendGestures(2, 7, operation)
            }
            if (current_site == "r") {
                right_pinch_and_hold_current = document.getElementById("list_container").value;
                var index = pinch_and_hold.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 18;
                else if (index == 1) operation = 19;
                else if (index == 2) operation = 11;
                eel.sendGestures(3, 7, operation)
            }
            document.getElementById("list_container").removeEventListener("change", () => { })
            closePopUp()
        })
    }
}

function setBattery(side, percentage) {
    if (side == "l") {
        document.getElementById("left_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("left_ear").style.zIndex = percentage == "DISCONNECTED" ? "-1" : "1";
        document.getElementById("battery-l").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_l").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("ring_button_l").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery-l").innerHTML = percentage + "% L";
        document.getElementById("battery_bar_fill_l").style.width = percentage +"%";
    } else if (side == "r") {
        document.getElementById("right_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("right_ear").style.zIndex = percentage == "DISCONNECTED" ? "-1" : "1";
        document.getElementById("battery-r").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_r").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";3
        document.getElementById("ring_button_r").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery-r").innerHTML = percentage + "% R";
        document.getElementById("battery_bar_fill_r").style.width = percentage +"%";
    }else if(side == "c"){
        document.getElementById("battery-c").innerHTML = percentage == "DISCONNECTED" ? percentage : percentage + "% CASE";
        document.getElementById("case_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("battery_bar_fill_c").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_fill_c").style.width = percentage +"%";
    }
}