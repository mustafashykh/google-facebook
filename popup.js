$(document).ready(function () {


    $("#extract").click(function () {
        $('#load').css("display", "block")

        let type = $("#type").val().trim()
        let query = $("#query").val().trim()
        if (type && query) {

            $('#errorMessage').css("display", "none")
            console.log("Test")

            // chrome.runtime.sendMessage({ type, query })

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { type, query })
            })
            // $.ajax({
            //     url: 'http://api.openweathermap.org/data/2.5/weather?q=' + type + '&units=matric&appid=' + query,
            //     type: "GET",
            //     success: function(data) {
            //         console.log(data);

            //         // $("#city").val("");
            //         // $('#weatherData').slideDown();
            //         // $('body').css('height', '300px');
            //         // $('#weatherData').css("display", "block");
            //         // $('#temperatureBtn').css("display", "block");
            //         // $('#load').css("display", "none");

            //         // $("#weatherCity").text(data.name);
            //         // $("#weatherCountry").text(data.sys.country);
            //         // $("#weatherDescription").text(data.weather[0].description.toUpperCase());
            //         // let temp = data.main.temp;
            //         // $("#weatherTemperature").text((temp-273.15).toFixed(2) + ' C');
            //         // $("#celsiusBtn").click(function() {
            //         //     $("#weatherTemperature").text((temp-273.15).toFixed(2) + ' C');
            //         // })
            //         // $("#fahrenheitBtn").click(function() {
            //         //     $("#weatherTemperature").text(((temp-273.15)*9/5 + 32).toFixed(2) + ' F');
            //         // })
            //         // $("#kelvinBtn").click(function() {
            //         //     $("#weatherTemperature").text(temp.toFixed(2)+ ' K');
            //         // })
            //         // $("#city").val("");
            //     },
            //     error: function(error) {
            //         // $('#load').css("display", "none");
            //         // $('#errorMessage').css("display", "block");
            //         // $('#weatherData').css("display", "none");
            //         // $('#temperatureBtn').css("display", "none");
            //         // $('body').css('height', '250px');
            //         // $('#weatherData').slideUp();
            //     }
            // });


        } else {
            // $('#load').css("display", "none");
            // $('#errorMessage').css("display", "block");
            // $('#weatherData').css("display", "none");
            // $('#temperatureBtn').css("display", "none");
            // $('body').css('height', '250px');
            // $('#weatherData').slideUp("slow");
        }
    })
})