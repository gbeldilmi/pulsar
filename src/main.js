const discord = require('discord.js');
const http = require('node:http');
const config = require('../res/config.json');

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

const handler = (req) => {
  // send a message to the channel
  const channel = client.channels.cache.get(config.channel);
  let message = "";
  if (req.method === "POST") {
    message += "POST " + req.body;
  } else {
    message += "GET " + req.url;
  }
  message += " from **" + req.socket.remoteAddress + "**";
  message += "\n```json\n" + JSON.stringify(req.headers) + "\n```";
  channel.send(message);
};

const server = http.createServer((req, res) => {
  handler(req);
  res.statusCode = 200;
  res.end();
});

server.listen(config.port, () => {
  console.log(`Server running at http://127.0.0.1:${config.port}/`);
});

client.login(config.token);
