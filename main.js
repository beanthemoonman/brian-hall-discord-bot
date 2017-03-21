console.log("my name is brian i am the bot");

Settings = require("./settings.json")

Responses = require("./Responses.json")

VoiceResponses = require("./VoiceResponses.json")

Discord = require('discord.js');

twitter = require("./twitter.js")

client = new Discord.Client();

client.login(Settings.token);

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/ global chat channel
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var channel;
var voiceChannel;
var voiceChannelConnection;
var isJazzing = false;



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
/ When client inits. set game and global channel
/ Sends few mesages to tell everboy brain
/ halls in the house.
/ 
/ Also send the channel object to twitter.js .
/ so it can send message when it recieves tweets
//*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
client.on("ready", function(){
    client.user.setGame("Harvest Moon");
    channel = client.channels.find("name", "general");
    channel.sendMessage("Rebooting",{"tts": true  }); //tts": true for robot voice
    channel.sendCode("C", "return 'DOCTOR B.HALL'");
	voiceChannel = client.channels.get('164382040215650304');

    twitter.handlerForOnSteamTweet(channel);
})
AttachmentFunctions = {
    "grade" : attachment => {

        attachment.message.reply("F");
    }
}

client.on('message', message => {

    if (message.attachments.size === 0 && client.user.id === message.mentions.users.firstKey()){
        var messageSplit = message.content.match(/("[^"]*")|[^ ]+/g);

        if(messageSplit[0] === '<@' + client.user.id + '>' && messageSplit.length >= 2){
            
            var response = Responses[messageSplit[1].toLowerCase()];
			
            if(response === undefined){
                message.reply(Responses._annoying);
            } else if(response!="noresponse"){
                message.reply(response);
            }
			
			var filename = VoiceResponses[messageSplit[1].toLowerCase()];
			if(filename != undefined)
			{
				voiceChannel.join().then(connection => {
					voiceChannelConnection = connection;
					const dispatcher = connection.playFile("sfx/" + filename);
					isJazzing = true;
				});
			}
			else if(messageSplit[1].toLowerCase() == "stoptalking")
			{
				voiceChannel.leave();
			}
        }else{
            message.reply(Responses._annoying);
        }
    }else if (client.user.id === message.mentions.users.firstKey()){
        var messageSplit = message.content.match(/("[^"]*")|[^ ]+/g);

        var attachment = Array.from(message.attachments.values())[0];

        if(messageSplit[0] === '<@' + client.user.id + '>' && attachment.width !== undefined && messageSplit.length >= 2){
            
            var response = AttachmentFunctions[messageSplit[1].toLowerCase()];

            if(response === undefined){
                message.reply(Responses._annoyingimage);
            } else{
                response(attachment);
            }
        }else if (messageSplit.length >= 2){
            message.reply(Responses._annoyingimage);
        }else {
            message.reply(Responses._imagesonly);
        }
    }
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    / if nobody's sent a message in the last minite
    / or so send a message.  If your receiving
    / lots of messages then restart the timer.
    //*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    clearTimeout()
    setTimeout(timedMessage,60000)
});


var timedMessage = function(){
    var channel = client.channels.find("name", "general");
    
}
function intervalCheck()
{	
	if(isJazzing)
	{
		if(!voiceChannelConnection.speaking)
		{
			voiceChannel.leave();
		}
	}
}

setInterval(intervalCheck, 1000);
