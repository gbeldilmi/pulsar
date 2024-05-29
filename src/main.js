const http = require('node:http');
const fs = require('node:fs');

const discord = require('discord.js');

const config = require('../res/config.json');



/* ********************************************************************************************** *
 * Discord bot                                                                                    *
 * ********************************************************************************************** */
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildModeration,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildIntegrations,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.AutoModerationConfiguration,
    discord.GatewayIntentBits.AutoModerationExecution
  ] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  if (msg.channelId === config.discord.channel) {
    if (msg.content === 'cls' && msg.author.id === config.discord.master) {
      try {
        msg.channel.messages.fetch().then(messages => {
          msg.channel.bulkDelete(messages);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
});

// Start the discord bot
client.login(config.discord.token);

const sendDiscordMessage = (message) => { // Send a message to the discord channel
  const channelId = config.discord.channel;
  const channel = client.channels.cache.get(channelId);
  if (!channel) {
    console.error(`Channel with ID ${channelId} not found.`);
    return;
  }
  channel.send(message).catch(console.error);
}



/* ********************************************************************************************** *
 * File stream                                                                                    *
 * ********************************************************************************************** */
var stream = null;
const createReader = () => {
  stream = fs.createReadStream(config.file.path, { encoding: 'utf8' }); // Create a read stream
  stream.on('data', (data) => {
    sendDiscordMessage('```\n' + data.toString() + '\n```');
  });
  stream.on('error', (err) => {
    sendDiscordMessage('```\n' + err + '\n```');
  });
  stream.on('close', () => {
    createReader();
  });
}

createReader();



/* ********************************************************************************************** *
 * HTTP server                                                                                    *
 * ********************************************************************************************** */
const handler = (req) => {
  sendDiscordMessage("`" + req.method + " " + req.url + " from " + req.socket.remoteAddress + "`"
      + "\n```json\n" + JSON.stringify(req.headers) + "\n```");
};

const server = http.createServer((req, res) => {
  handler(req);
  res.statusCode = 200;
  res.end();
});

// Start the HTTP server
server.listen(config.http.port, () => {
  console.log(`Server running at http://127.0.0.1:${config.http.port}/`);
});
