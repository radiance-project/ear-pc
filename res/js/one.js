var triple_tap = ["Skip back", "Skip forward", "Voice Assistant", "No action"];
var tap_and_hold = ["Change ANC type", "No action"];

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
var left_triple_tap_current = triple_tap[0];
var left_tap_and_hold_current = tap_and_hold[0];
var right_triple_tap_current = triple_tap[0];
var right_tap_and_hold_current = tap_and_hold[0];

// 0 = On, 1 = transparent, 2 = Off
var ANC_type = 1;
// 0 = Strong, 1 = low
var ANC_strength = 0;

var colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];


async function ringBuds(){
   //TOOGLE RINGING
   var e = document.getElementById("ring_button-c").classList
   if(e.contains("ringing")){
       e.remove("ringing")
       document.getElementById("ring_button-c").style = ""
       document.getElementById("ring_button-c").innerText = "Ring"
       eel.ringBuds(0)
   }else{
       e.add("ringing")
       document.getElementById("ring_button-c").style = "background-color: #7f1d1d; color: #ffffff;"
       document.getElementById("ring_button-c").innerText = "STOP"
       eel.ringBuds(1)
   }
}
//---------------------------------------------------------------------------------//



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
            if (array[i].gestureType == 3) {
                //triple tap
                if (array[i].gestureAction == 8) {
                    left_triple_tap_current = triple_tap[0];
                } else if (array[i].gestureAction == 9) {
                    left_triple_tap_current = triple_tap[1];
                } else if (array[i].gestureAction == 11) {
                    left_triple_tap_current = triple_tap[2];
                } else if (array[i].gestureAction == 1) {
                    left_triple_tap_current = triple_tap[3];
                }
            } else if (array[i].gestureType == 7) {
                //tap and hold
                if (array[i].gestureAction == 10) {
                    left_tap_and_hold_current = tap_and_hold[0];
                } else if (array[i].gestureAction == 1) {
                    left_tap_and_hold_current = tap_and_hold[1];
                }
            }
        } else if (array[i].gestureDevice == 3) {
            //RIGHT
            if (array[i].gestureType == 3) {
                //triple tap
                if (array[i].gestureAction == 8) {
                    right_triple_tap_current = triple_tap[0];
                } else if (array[i].gestureAction == 9) {
                    right_triple_tap_current = triple_tap[1];
                } else if (array[i].gestureAction == 11) {
                    right_triple_tap_current = triple_tap[2];
                } else if (array[i].gestureAction == 1) {
                    right_triple_tap_current = triple_tap[3];
                }
            } else if (array[i].gestureType == 7) {
                //tap and hold
                if (array[i].gestureAction == 10) {
                    right_tap_and_hold_current = tap_and_hold[0];
                } else if (array[i].gestureAction == 1) {
                    right_tap_and_hold_current = tap_and_hold[1];
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
            document.getElementById("settings_subtitle_triple").innerHTML = left_triple_tap_current;
            document.getElementById("settings_subtitle_hold").innerHTML = left_tap_and_hold_current + "<br />Decline incoming call";
        } else if (side == "r") {
            document.getElementById("settings_subtitle_hold").innerHTML = right_tap_and_hold_current + "<br />Decline incoming call";
            document.getElementById("settings_subtitle_triple").innerHTML = right_triple_tap_current;
        }
}

function changeGesture(type) {
    if (type == "triple") {
        //GET ARRAY POSITION OF CONTENT OF settings_subtitle_triple and replace it with next element in array
        var current_gesture = document.getElementById("settings_subtitle_triple").innerHTML;
       
        //GENERTE A LIST WITH ALL POSSIBLE GESTURES FROM triple_TAB IN HTML AND MAKE THEM SELECTABLE
        var show_popup = "";
        for(var i = 0; i < triple_tap.length; i++) {
           show_popup += `
            <option id="${triple_tap[i]}" ${current_site == "l" ? left_triple_tap_current == triple_tap[i] ? "selected" : "" : right_triple_tap_current == triple_tap[i] ? "selected" : ""}>
                ${triple_tap[i]}
            </option>
           `
        }
        displayPopUp(show_popup)

        document.getElementById("list_container").addEventListener("change", function(e) {
            document.getElementById("settings_subtitle_triple").innerHTML = document.getElementById("list_container").value
            if (current_site == "l") {
                left_triple_tap_current = document.getElementById("list_container").value;
                //get index of current gesture
                var index = triple_tap.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                else if (index == 3) operation = 1;
                eel.sendGestures(2, 3, operation)
            }
            if (current_site == "r") {
                right_triple_tap_current = document.getElementById("list_container").value;
                var index = triple_tap.indexOf(document.getElementById("list_container").value);
                var operation = 0;
                if (index == 0) operation = 8;
                else if (index == 1) operation = 9;
                else if (index == 2) operation = 11;
                else if (index == 3) operation = 1;
                eel.sendGestures(3, 3, operation)  
            }
            document.getElementById("list_container").removeEventListener("change")
            closePopUp()
        })
    } else if (type == "hold") {
                //GET ARRAY POSITION OF CONTENT OF settings_subtitle_triple and replace it with next element in array
                var current_gesture = document.getElementById("settings_subtitle_triple").innerHTML;
               
                //GENERTE A LIST WITH ALL POSSIBLE GESTURES FROM triple_TAB IN HTML AND MAKE THEM SELECTABLE
                var show_popup = "";
                for(var i = 0; i < tap_and_hold.length; i++) {
                   show_popup += `
                    <option id="${tap_and_hold[i]}" ${current_site == "l" ? left_tap_and_hold_current == tap_and_hold[i] ? "selected" : "" : right_tap_and_hold_current == tap_and_hold[i] ? "selected" : ""}>
                        ${tap_and_hold[i]}
                    </option>
                   `
                }
                displayPopUp(show_popup)
        
                document.getElementById("list_container").addEventListener("change", function(e) {
                    document.getElementById("settings_subtitle_hold").innerHTML = document.getElementById("list_container").value +"<br />Decline incoming call"
                    if (current_site == "l") {
                        left_tap_and_hold_current = document.getElementById("list_container").value;
                        //get index of current gesture
                        var index = tap_and_hold.indexOf(document.getElementById("list_container").value);
                        var operation = 0;
                        if (index == 0) operation = 10;
                        else if (index == 1) operation = 1;
                        eel.sendGestures(2, 7, operation)
                    }
                    if (current_site == "r") {
                        right_tap_and_hold_current = document.getElementById("list_container").value;
                        var index = tap_and_hold.indexOf(document.getElementById("list_container").value);
                        var operation = 0;
                        if (index == 0) operation = 10;
                        else if (index == 1) operation = 1;
                        eel.sendGestures(3, 7, operation)
                    }
                    document.getElementById("list_container").removeEventListener("change")
                    closePopUp()
                })
    }
}

function setANC(typeANC) {
    switch (typeANC) {
        case 0:
            setAncToNC();
            break;
        case 1:
            setAncToTransparent();
            break;
        case 2:
            setAncToOff();
            break;
        case 3:
            setAncStrengthLow();
            break;
        case 4:
            setAncStrengthHigh();
            break;
        default:
            break;
    }

    let type = 0;
    if (ANC_type === 1) type = 2;
    else if (ANC_type === 2) type = 1;
    else if (ANC_type === 0) {
        type = ANC_strength === 1 ? 3 : 4;
    }

    eel.setANCDisplay(type);
    eel.setANC(type);
}


function setAncToNC() {
    document.getElementById("selector").style.marginLeft = "16px"
    document.getElementById("ANC_on").style.fill = "black"
    document.getElementById("trans_on").style.fill = "white"
    document.getElementById("anc_off").style.fill = "white"
    document.getElementById("anc_strength_selector").style.opacity = "100"

    ANC_type = 0;
}

function setAncToTransparent() {
    document.getElementById("selector").style.marginLeft = "112px"
    document.getElementById("trans_on").style.fill = "black"
    document.getElementById("ANC_on").style.fill = "white"
    document.getElementById("anc_off").style.fill = "white"
    document.getElementById("anc_strength_selector").style.opacity = "0"

    ANC_type = 1;
}

function setAncToOff() {
    document.getElementById("selector").style.marginLeft = "209px"
    document.getElementById("anc_off").style.fill = "black"
    document.getElementById("ANC_on").style.fill = "white"
    document.getElementById("trans_on").style.fill = "white"
    document.getElementById("anc_strength_selector").style.opacity = "0"

    ANC_type = 2;
}



function setAncStrengthLow() {
    if (!document.getElementById("stage_one_button")) return;
    document.getElementById("stage_one_button").style = "height: 0.75rem !important; width: 0.75rem !important; margin-left: -0.25rem !important; margin-top: -0.25rem !important;"
    document.getElementById("stage_two_button").style = "height: 0.25rem; width: 0.25rem; margin-left: 0px; margin-top: 0px;"
     
    ANC_strength = 1;
}

function setAncStrengthHigh() {
    if (!document.getElementById("stage_one_button")) return;
    document.getElementById("stage_one_button").style = "height: 0.25rem !important; width: 0.25rem !important; margin-left: 0px !important; margin-top: 0px !important;"
    document.getElementById("stage_two_button").style = "height: 0.75rem !important; width: 0.75rem !important; margin-right: -0.25rem !important; margin-top: -0.25rem !important;"

    ANC_strength = 0;
}

        
        

function setBattery(side, percentage) {
    if (side == "l") {
        document.getElementById("left_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("left_ear").style.zIndex = percentage == "DISCONNECTED" ? "-1" : "1";
        document.getElementById("battery-l").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_l").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery-l").innerHTML = percentage + "% L";
        document.getElementById("battery_bar_fill_l").style.width = percentage +"%";
    } else if (side == "r") {
        document.getElementById("right_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("right_ear").style.zIndex = percentage == "DISCONNECTED" ? "-1" : "1";
        document.getElementById("battery-r").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_r").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery-r").innerHTML = percentage + "% R";
        document.getElementById("battery_bar_fill_r").style.width = percentage +"%";
    }else if(side == "c"){
        document.getElementById("battery-c").innerHTML = percentage == "DISCONNECTED" ? percentage : percentage + "% CASE";
        document.getElementById("case_ear").style.opacity = percentage == "DISCONNECTED" ? "0.5" : "1";
        document.getElementById("battery_bar_fill_c").style.opacity = percentage == "DISCONNECTED" ? "0" : "1";
        document.getElementById("battery_bar_fill_c").style.width = percentage +"%";
    }
}


function loadBatteryColor(){
    var list = document.getElementById("list_container");
    //get current option id
    var option = list.options[list.selectedIndex].id;
    document.getElementById("case_color").value = colors[option];
    document.getElementById("case_led").style.backgroundColor = colors[option];
}

function getCaseColor(array) {
    colors = array;
    loadBatteryColor();
}

function selectCaseColorPopup() {
    eel.getLEDCaseColor()
    document.getElementById("popup_container").style.opacity = "100"
    document.getElementById("popup_container").style.zIndex = "1000"
    document.getElementById("popup_content").style.zIndex = "1001"

    document.getElementById("popup_content").innerHTML = ` <div class="w-fit flex m-auto text-md mb-5 mt-2">
    Change case color
        </div>
        <div id="case_container_color_picker">
            <img src="../assets/ear_one_white_case.png" class='mr-2 h-42 -mt-5 m-auto -mb-8' "/>
            <div id="case_led" class="rounded-full m-auto" style="background-color: red; height: 8px; width: 8px; margin-top: -102px; margin-bottom: 76px; z-index: 1; margin-left: 260px; position: relative;"></div>
        </div>
            <input type="color" id="case_color" style=" margin:auto; display: block; height: 30px; width: 350px; border: 0px; background: transparent;" onInput="saveColor();document.getElementById('case_led').style.backgroundColor = this.value" name="case_color" value="#000000">
            <div id="description" class="text-center m-auto w-fit -mb-2 mt-2 duration-300 pb-5 text-sm text-gray-500"> Click the bar above to select a color</div>
            <select id="list_container" class="flex m-auto rounded-md" style="width: 300px; padding: 12px; border: #333333 1px solid; background-color: #1B1D1F; outline: none;" onchange="loadBatteryColor()">
                <option id="0">Battery - High Level</option>
                <option id="1">Battery - Mid Level</option>
                <option id="2">Battery - Low Level</option>
                <option id="3">Charging - Charging</option>
                <option id="4">Charging - Fully charged</option>
            </select>
            <div id="scan_button" class="text-center m-auto w-fit -mb-5 mt-3 duration-300  pb-5" onclick="saveCaseColor()">
                        <div id="scan_button-c" class="p-1 pl-7 pr-7 border-black border-[2px] text-white cursor-pointer rounded-full mr-3 text-sm ease-in-out hover:scale-[105%] duration-150">Save</div>
        </div>
        `
}

function saveColor() {
    var list = document.getElementById("list_container");
    //get current option id
    var option = list.options[list.selectedIndex].id;
    var color = document.getElementById("case_color").value;
    colors[option] = color;
}

function saveCaseColor() {
    var colors_converted = [];
    for (var i = 0; i < colors.length; i++) {
        var color = colors[i];
        var r = parseInt(color.substring(1, 3), 16);
        var g = parseInt(color.substring(3, 5), 16);
        var b = parseInt(color.substring(5, 7), 16);
        colors_converted.push([r, g, b]);
    }
    colors_converted = [colors_converted[2], colors_converted[1], colors_converted[0], colors_converted[3], colors_converted[4]];
    eel.sendLEDCaseColor(colors_converted);
    closePopUp()
}