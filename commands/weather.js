const cache = require("memory-cache");
const { enc, serversList } = require("../utils");

const weatherEmojis = {
    'extrasunny': "☀️",
    'clear': "☀️",
    'neutral': "☁️",
    'smog': "🌁",
    'foggy': "🌁",
    'overcast': "☁️",
    'clouds': "☁️",
    'clearing': "☁️",
    'rain': "🌧️",
    'thunder': "⛈️",
    'snow': "🌨️",
    'blizzard': "🌨️",
    'snowlight': "🌨️",
    'xmas': "🌨️",
    'halloween' : "🎃"
}

module.exports = {
    command: 'weather',
    info: 'show weather and time',
    async run({message, args, ttApi, prefix}) {
        let selectedServer = parseInt(args[0]);

        if(!selectedServer || selectedServer > serversList.length || selectedServer < 1) {
            message.reply(`Invalid server id, use ***${prefix}weather 1*** or use ***${prefix}servers*** for server list`)
            return;
        }
        
        // since server[0] is SERVER #1 we shift the index so server[1] would show up as SERVER #1 instead of SERVER #2
        selectedServer -= 1;

        //attempt to get the data from cache
        let weather = cache.get("weather" + selectedServer)
        if(!weather){
            weather = await ttApi.getCurrentWeather(selectedServer).catch(err=>console.log(err));

            if(!weather || !weather.current_weather) {
                message.reply("Failed to load the weather, try again later.");
                return;
            }

            //cache result
            cache.put("weather" + selectedServer, {...weather, timestamp: Date.now()}, 20000); //10000 = 10 seconds
        }

        let timeRemaining = (Number(
            weather.time_remaining - ("timestamp" in weather ? (Date.now() - weather.timestamp) / 1000 : 0)
        ) / 60).toFixed(1); //if cached subtract time different

        message.channel.send(enc(
            `[Weather and Time | ${serversList[selectedServer][1]}]\n` + 
            `Current Time: ${(weather.hour < 10 ? "0" : "") + weather.hour}:${(weather.minute < 10 ? "0" : "") + weather.minute}\n` +
            `Current Weather: ${weather.current_weather}${weatherEmojis[weather.current_weather] || "🌤"}\n` +
            // `Weather Ends In: ${Number(weather.time_remaining / 60).toFixed(1)} minutes`
            `Weather Changes In: ${timeRemaining >= 1 ? timeRemaining + " minutes" : timeRemaining * 60 + " seconds"} \n` 
        ));
    }
};