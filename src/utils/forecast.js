const request = require('request');

const forecast = (latitude, longitude, callback) => {
    url = `https://api.darksky.net/forecast/beb67dba14951497b8baa016b307c4f7/${latitude},${longitude}?units=si&lang=ru`;

    request({
        url,
        json: true
    }, (error, response) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (response.body.error) {
            callback('Unable to find location', undefined);
        } else {
            const temperature = response.body.currently.temperature
            const chanceOfRain = response.body.currently.precipProbability

            callback(undefined, `${response.body.daily.data[0].summary} Сейчас ${temperature} °С. Вероятность дождя ${chanceOfRain * 100}%.`);
        } 
    })
}

module.exports = forecast;