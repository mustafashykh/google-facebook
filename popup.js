$(document).ready(async function () {

    $("#extract-maps").click(function () {

        $('#load').css("display", "block")

        let type = $("#type").val().trim()
        let query = $("#query").val().trim()
        if (type && query) {

            $('#errorMessage').css("display", "none")

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { type, query, searchMap: true })
            })


        }
    })

    $("#extract-google").click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { searchGoogle: true })
        })

    })

    $("#extract-facebook").click(function () {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { searchFacebook: true })
        })

    })
})