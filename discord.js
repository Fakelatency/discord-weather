const request = require('request-promise');
const DiscordRPC = require('discord-rpc');

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

var variables = {
    temperature: 0,
    wind_speed: 0, 
    wind_dir: "",
    weather: 0,
    weatherName: "",
    app_temp: 0,
    pres: 0 
}

var request_api = {
    method: "GET",
    uri: "https://api.weatherbit.io/v2.0/current",

    qs: {
        city: "Toruń",
        country: "PL",
        key: "12b38c55a0d249d39c95d99255f1ac8a",
    } 
}
var currentMode = 0;

function changeMode(){
    currentMode++;
    if (currentMode >= 6){
        currentMode = 0;
    }
}

function info(){
    
    request(request_api).then((response) => {
        
        response = JSON.parse(response);
        console.log(response);
        variables.temperature = response.data[0].temp;
        variables.wind_speed = response.data[0].wind_spd;
        variables.wind_dir = response.data[0].wind_cdir;
        variables.weather = response.data[0].weather.code;
        variables.app_temp = response.data[0].app_temp;
        variables.pres = response.data[0].pres;
        variables.weatherName = response.data[0].weather.description;

        

    }).catch((e) => {
        console.error(e);
    })
    setTimeout(info,60000)
    console.log("Weather has been updated :]");
}



function display(){
    var picName;
    if (variables.weather >= 200 && variables.weather <= 623) {
        picName = "rainy";
    }
    else if (variables.weather >= 700 && variables.weather <=803) {
        picName = "sunny";
    }
    else if (variables.weather == 804) {
        picName = "cloudly";
    }
    else {
        picName = "aimware";
    }

    if(currentMode == 0){
        rpc.setActivity({
            details: `${variables.temperature.toFixed(1)}°C <= Temperaturka`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    else if(currentMode == 1) {
        rpc.setActivity({
            details: `${variables.wind_speed.toFixed(1)}m/s <= V wiatru`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    else if(currentMode == 2) {
        rpc.setActivity({
            details: `${variables.wind_dir} <= Kierunek wiatru`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    else if(currentMode == 3) {
      rpc.setActivity({
            details: `${variables.weatherName} <= Pogoda`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    else if(currentMode == 4) {
        rpc.setActivity({
            details: `${variables.app_temp}°C <= Odczuwalna`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    else if(currentMode == 5) {
        rpc.setActivity({
            details: `${variables.pres}hPa <= Ciśnienie`,
            state: `💖Weather APP💖`,
            largeImageKey: picName,
            instance: false
        })
    }
    changeMode();
    setTimeout(display, 10000);
}

rpc.on('ready', () => {
    display();
    info();
})

rpc.login({ clientId : "834610672414359562" }).catch(console.error);
