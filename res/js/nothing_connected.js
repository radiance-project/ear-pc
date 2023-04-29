async function loadDevicePage(device) {
    console.log("Loading device page for " + device);
    connectDeviceFromList(device);   
}

function scanNewDevices(){
    document.getElementById("device_container").innerHTML = '<img src="../assets/loading.svg" alt="loading_animation" class="h-[80px] w-[80px] m-auto" id="loading_animation" />';
    document.getElementById("scan_button").style.display = "none";
    setTimeout(() => {
        eel.getDevices();
    }, 500)
    setTimeout(function(){
        window.location.reload();
    }, 3000);
}