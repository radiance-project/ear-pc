var current_page = 0;

function transToLeftGest(side) {
    current_site = side;
    if (current_site == "l") {

        rightEarPeace.classList.remove("duration-[2s]")
        rightEarPeace.classList.add("duration-300")

        leftEarBattery.style.opacity = "0"
        rightEarBattery.style.opacity = "0"
        prod_name.style.opacity = "0"

        pages_container.style.opacity = "0"
        pages_container_two.style.opacity = "0"
        ringButton.style.opacity = "0"
        rightEarPeace.style.opacity = "0"

        rightEarPeace.style.zIndex = "-10"

        clearTimeout(intro_timeout);
        clearTimeout(intro_timeout2);
        leftEarPeace.classList.remove("h-44")
        leftEarPeace.classList.remove("w-34")

        leftEarPeace.style.marginTop = "120px"
        leftEarPeace.style.marginLeft = "301px"

        document.getElementById("ring_button").style.zIndex = "-10"
        document.getElementById("eq_container_t").style.zIndex = "-10"

        setTimeout(() => {
            document.getElementById("test").style.opacity = "100"
            document.getElementById("test").style.zIndex = "100"
            document.getElementById("back").style.opacity = "100"
        }, 500)

    } else {

        rightEarPeace.classList.remove("duration-[2s]")
        rightEarPeace.classList.add("duration-300")

        leftEarBattery.style.opacity = "0"
        rightEarBattery.style.opacity = "0"
        prod_name.style.opacity = "0"

        pages_container.style.opacity = "0"
        pages_container_two.style.opacity = "0"
        ringButton.style.opacity = "0"
        leftEarPeace.style.opacity = "0"

        leftEarPeace.style.zIndex = "-10"

        clearTimeout(intro_timeout);
        clearTimeout(intro_timeout2);
        rightEarPeace.classList.remove("h-44")
        rightEarPeace.classList.remove("w-34")

        rightEarPeace.style.marginTop = "120px"
        rightEarPeace.style.marginLeft = "101px"

        document.getElementById("ring_button").style.zIndex = "-10"
        document.getElementById("eq_container_t").style.zIndex = "-10"

        setTimeout(() => {
            document.getElementById("test").style.opacity = "100"
            document.getElementById("test").style.zIndex = "100"
            document.getElementById("back").style.opacity = "100"
        }, 500)
    }
}

function transBackToLeft(e) {
    document.getElementById("test").style.opacity = "0"
    rightEarPeace.classList.remove("duration-[2s]")
    rightEarPeace.classList.add("duration-300")

    leftEarBattery.style.opacity = "100"
    rightEarBattery.style.opacity = "100"
    prod_name.style.opacity = "100"
    pages_container.style.opacity = "100"
    if (pages_container_two !== null) pages_container_two.style.opacity = "1"
    ringButton.style.opacity = "100"
    rightEarPeace.style.opacity = "100"
    document.getElementById("back").style.opacity = "0"

    leftEarPeace.style.zIndex = "300"
    rightEarPeace.style.zIndex = "300"

    leftEarPeace.classList.remove("h-52")
    leftEarPeace.classList.add("h-44")

    document.getElementById("ring_button").style.zIndex = "10"
    document.getElementById("eq_container_t").style.zIndex = "10"

    leftEarPeace.style.marginTop = "0px"
    if (e == "MainControl") leftEarPeace.style.marginLeft = "40px"
    else leftEarPeace.style.marginLeft = "0px"
    document.getElementById("test").style.zIndex = "-10"

    //SAME FOR RIGHT EARPEACE
    rightEarPeace.classList.remove("h-52")
    rightEarPeace.classList.add("h-44")

    rightEarPeace.style.marginTop = "0px"
    if (e == "MainControl") rightEarPeace.style.marginLeft = "auto"
    else rightEarPeace.style.marginLeft = "0px"
    document.getElementById("test").style.zIndex = "-10"
    leftEarPeace.style.opacity = "100"

}

var current_timeout;
var current_timeout_fade;

function switchPage(page) {
    var page_1 = document.getElementById("page_1_container");
    var page_2 = document.getElementById("page_2_container");

    current_timeout ? clearTimeout(current_timeout) : ""
    current_timeout_fade ? clearTimeout(current_timeout_fade) : ""

    //IF PAGE IS THE LAST, GO BACK TO THE FIRST PAGE
    if (current_page == 1 && page == 1) {
        page = 0
    }else if(current_page == 0 && page == 0) {
        page = 1
    }

current_page = page;
    switch (page) {
        case 0:
            document.getElementById("stage_two_selector_button").style.backgroundColor = "white"
            document.getElementById("stage_one_selector_button").style.backgroundColor = "#1B1D1F"

            page_1.style.opacity = "0"
            current_timeout = setTimeout(() => {
                page_1.style.zIndex = "-1"
                page_2.style.zIndex = "1"
                current_timeout_fade = setTimeout(() => {
                page_2.style.opacity = "100"
                }, 100)
            }, 100)
            break
        case 1:
            document.getElementById("stage_one_selector_button").style.backgroundColor = "white"
            document.getElementById("stage_two_selector_button").style.backgroundColor = "#1B1D1F"

            page_2.style.opacity = "0"
            current_timeout = setTimeout(() => {
                page_2.style.zIndex = "-1"
                page_1.style.zIndex = "1"
                current_timeout_fade = setTimeout(() => {
                page_1.style.opacity = "100"
                }, 100)
            }, 100)
    }
}


function displayPopUp(e) {
    document.getElementById("popup_container").style.opacity = "100"
    document.getElementById("popup_container").style.zIndex = "1000"
    document.getElementById("popup_content").style.zIndex = "1001"

    document.getElementById("popup_content").innerHTML = ` <div class="w-fit flex m-auto text-md mb-5 mt-2">
    Change gesture
        </div>
        <select id="list_container" class="flex flex-col w-fit m-auto bg-[#1B1D1F] w-[300px] outline-none p-3 border-[#333333] border-[1px] rounded-md" style="width: 300px; padding: 12px; border: #333333 1px solid; background-color: #1B1D1F; outline: none;">
        ${e}</select>`
}

function closePopUp() {
    document.getElementById("popup_container").style.opacity = "0"
    document.getElementById("popup_container").style.zIndex = "-10"
    document.getElementById("popup_content").style.zIndex = "-10"
}