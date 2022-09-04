require('dotenv').config();

import { Client } from 'discord.js';
import { messageCreate } from './events/messageCreate';
import { init } from './server';
import { observe } from './streakUpdate';

const client = new Client({
  intents: ['GuildMessages', 'MessageContent', 'Guilds'],
});

client.on('ready', () => {
  console.log('Successfully logged in');
});

client.on('messageCreate', messageCreate);

init();

observe(client);

client.login(process.env.TOKEN);
