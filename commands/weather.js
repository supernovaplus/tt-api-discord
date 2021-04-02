const cache = require("memory-cache");
const { enc, serversList } = require("../utils");

module.exports = {
	command: 'weather',
	info: 'show weather',
	async run({message, args, ttApi, prefix}) {
        let selectedServer = parseInt(args[0]);

        if(!selectedServer || selectedServer > serversList.length || selectedServer < 1) {
            message.reply(`Invalid server id, use ***${prefix}weather 1*** or use ***${prefix}servers*** for server id`)
            return;
        }
        
        // since server[0] is SERVER #1 we shift the index so server[1] would show up as SERVER #1 instead of SERVER #2
        selectedServer -= 1;

        //attempt to get the data from cache
        let weather = cache.get("weather" + selectedServer)
        if(!weather){
            weather = await ttApi.getCurrentWeather(selectedServer).catch(err=>console.log(err));
    
            if(!weather || !weather.current_weather) return;
    
            //cache result
            cache.put("weather" + selectedServer, {...weather, isCached: true}, 10000); //10000 = 10 seconds
            //the longer the cache time is the more mismatched the time remaining will be
        }

        message.channel.send(enc(`
[${serversList[selectedServer][1]}]
Current Time: ${(weather.hour < 10 ? "0" : "") + weather.hour}:${(weather.minute < 10 ? "0" : "") + weather.minute}
Current Weather: ${weather.current_weather}
Weather Ends In: ${Number(weather.time_remaining / 60).toFixed(1)} minutes`));
	}
};