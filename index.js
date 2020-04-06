var Discord = require('discord.io');
var bot = new Discord.Client({
    autorun: true,
    token: "Njk2NzI1OTEyNjMyMjk1NDM2.Xoth7g.V3C-nER76_YXQqeOvVyM0Z2ZBE"
});

bot.on('ready', function(event) {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
});