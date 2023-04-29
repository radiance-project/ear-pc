
async function getDevicesJS() {
    let n = await eel.getDevices()();
    document.getElementById('list').innerText = n;
}

function updateBattery(leftText, caseText, rightText) {
    const containerLeft = document.getElementById('container-left');
    const containerCase = document.getElementById('container-case');
    const containerRight = document.getElementById('container-right');
    const batteryLeft = document.getElementById('battery-left');
    const batteryCase = document.getElementById('battery-case');
    const batteryRight = document.getElementById('battery-right');

    // hide/show containers based on the text
    containerLeft.style.display = leftText === 'DISCONNECTED' ? 'none' : 'block';
    containerCase.style.display = caseText === 'DISCONNECTED' ? 'none' : 'block';
    containerRight.style.display = rightText === 'DISCONNECTED' ? 'none' : 'block';

    // set the battery text
    batteryLeft.innerText = leftText;
    batteryCase.innerText = caseText;
    batteryRight.innerText = rightText;
}


function getImageForModel(modelID) {
    var modelInfo = getModelInfo(modelID);
    return modelInfo.rightImg;
}

function updateBudsInfo(modelID) {
    var modelInfo = getModelInfo(modelID);
    var leftBudImg = document.querySelector("#left_ear_peace");
    var caseImg = document.querySelector("#case-img");
    var rightBudImg = document.querySelector("#right_ear_peace");
    
    leftBudImg.src = modelInfo.leftImg;
    if (caseImg != null) {
        caseImg.src = modelInfo.caseImg;
    }
    rightBudImg.src = modelInfo.rightImg;
}

function getModelInfo(modelID) {
    var models = {
        "31d53d": {
            name: "Nothing Ear (1)",
            leftImg: "../assets/ear_one_white_left.png",
            caseImg: "../assets/ear_one_white_case.png",
            rightImg: "../assets/ear_one_white_right.png",
            duoImg: "../assets/ear_one_white_duo.png",
            isANC: true
        },
        "624011": {
            name: "Nothing Ear (1)",
            leftImg: "../assets/ear_one_black_left.png",
            caseImg: "../assets/ear_one_black_case.png",
            rightImg: "../assets/ear_one_black_right.png",
            duoImg: "../assets/ear_one_black_duo.png",
            isANC: true
        },
        "1016dd": {
            name: "Nothing Ear (stick)",
            leftImg: "../assets/ear_stick_left.png",
            caseImg: "../assets/ear_stick_case_none.png",
            rightImg: "../assets/ear_stick_right.png",
            duoImg: "../assets/ear_stick_white_duo.png",
            isANC: false
        },
        "dee8c0": {
            name: "Nothing Ear (2)",
            leftImg: "../assets/ear_two_white_left.png",
            caseImg: "../assets/ear_two_white_case.png",
            rightImg: "../assets/ear_two_white_right.png",
            duoImg: "../assets/ear_two_white_duo.png",
            isANC: true
        }
    };
    return models[modelID];
}

function getDevicesForList(devices) {
    var list = document.querySelector("#device_container");
    for (var i = 0; i < devices.length; i++) {
        var container = document.createElement("div");
        container.id = "device_container_child";
        container.className = "inline-grid p-2 pl-5 pr-5 cursor-pointer border-[1px] border-black rounded-xl mt-2 hover:scale-[105%] duration-200 ease-in-out";
        container.style.display = "inline-grid";
        container.style.width = "280px";
        container.style.gridTemplateColumns = "auto auto";
        var image = getImageForModel(devices[i][3]);
        var name = getModelInfo(devices[i][3]).name;
        var mac = devices[i][1];
        container.setAttribute("onclick", `loadDevicePage('${mac}')`);
        container.innerHTML = `
            <img src="${image}" alt="" id="device_image" class="h-12 w-fit">
            <section class="mt-3 ml-5">${name}</section>
        `;
        list.appendChild(container);
    }
}

function setFirmwareText(firmware_text) {
    document.getElementById("settings_subtitle_firmware").innerHTML = firmware_text;
}

function setMacAdressText(mac_adress_text) {
    document.getElementById("settings_subtitle_mac").innerHTML = mac_adress_text;
}

function setInEarCheckbox(status) {
    if (status == 1) {
        document.getElementById("in_ear").checked = true;
    } else {
        document.getElementById("in_ear").checked = false;
    }
}

function setInEar() {
    if (document.getElementById("in_ear").checked) {
        eel.setInEar(1);
    } else {
        eel.setInEar(0);
    }
}

//set latency mode check 
function setLatencyModeCheckbox(status) {
    if (status == 1) {
        document.getElementById("low_latency").checked = true;
    } else if (status == 2) {
        document.getElementById("low_latency").checked = false;
    }
}

//set latency mode
function setLatencyMode() {
    if (document.getElementById("low_latency").checked) {
        eel.setLatency(1);
    } else {
        eel.setLatency(0);
    }
}

function connectDeviceFromList(mac) {
    eel.stopReceivingData();
    eel.connectToDevice(mac);
}

function showErrorPopup(message) {
    // Get the error popup container and message element
    var errorPopupContainer = document.querySelector(".error-popup-container");
    var errorPopupMessage = document.querySelector(".error-popup-message");

    // Set the message text
    errorPopupMessage.textContent = message;

    // Show the error popup container
    errorPopupContainer.style.bottom = "0"; /* Show the error popup */

    // Hide the error popup after 10 seconds
    setTimeout(function () {
        errorPopupContainer.style.bottom = "-70px"; /* Hide the error popup */
    }, 10000);
}



function toggleConnectionOverlay(show, model, isTray) {
    var tray;
    var bigWindow;
    console.log("toggleConnectionOverlay");

  
    width = window.screen.width;
    height = window.screen.height - 40;
    if (show) {
        window.ipcRenderer.send('tray-resize', 2, 650, 300);
        window.ipcRenderer.send('tray-position', 2, width - 650, height - 300);
        window.ipcRenderer.send('load-url', 1, 'http://localhost:17079/MainControl/MainControl_nothing_connected.html');
        window.ipcRenderer.send('load-url', 2, 'http://localhost:17079/tray/nothing_connected.html');
    } else {
        if (model == "31d53d" || model == "624011") {
            window.ipcRenderer.send('tray-resize', 2, 650, 300);
            window.ipcRenderer.send('tray-position', 2, width - 650, height - 300);
            window.ipcRenderer.send('load-url', 1, 'http://localhost:17079/MainControl/MainControl_one.html');
            window.ipcRenderer.send('load-url', 2, 'http://localhost:17079/tray/one.html');
        } else if (model == "1016dd") {
            window.ipcRenderer.send('tray-resize', 2, 300, 300);
            window.ipcRenderer.send('tray-position', 2, width - 300, height - 300);
            window.ipcRenderer.send('load-url', 1, 'http://localhost:17079/MainControl/MainControl_sticks.html');
            window.ipcRenderer.send('load-url', 2, 'http://localhost:17079/tray/sticks.html');
        } else if (model == "dee8c0") {
            window.ipcRenderer.send('tray-resize', 2, 650, 300);
            window.ipcRenderer.send('tray-position', 2, width - 650, height - 300);
            window.ipcRenderer.send('load-url', 1, 'http://localhost:17079/MainControl/MainControl_two.html');
            window.ipcRenderer.send('load-url', 2, 'http://localhost:17079/tray/two.html');
        }
    }
}

function closeElectronInstance() {
    window.ipcRenderer.send('close-app');
}

function getANCStatus() {
    const options = document.querySelectorAll('.anc-option');
    const switchIndicator = document.querySelector('.switch-indicator');
    let level = 0;
    //get selected option id in options, check classList for selected
    let selectedOption;
    options.forEach(option => {
        if (option.classList.contains('selected')) {
            selectedOption = option.id;
        }
    });
    let switchStatus = switchIndicator.classList.contains('high');
    if (selectedOption === "anc-off") {
        level = 1;
    } else if (selectedOption === "anc-transparent") {
        level = 2;
    } else if (selectedOption === "anc-on") {
        if (switchStatus) {
            level = 4;
        } else {
            level = 3;
        }
    }
    return level;
}

function setANCStatus(status) {
    if (status === 1) {
        setAncToOff();
    } else if (status === 2) {
        setAncToTransparent();
    } else if (status === 3) {
        setAncToNC();
        setAncStrengthLow();
    } else if (status === 4) {
        setAncToNC();
        setAncStrengthHigh();
    } else if (status === 5) {
        setAncToNC();
        setAncStrengthMid();
    } else if (status === 6) {
        setAncToNC();
        setAncStrengthAdaptive();
    }
}