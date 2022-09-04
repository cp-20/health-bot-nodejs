require('dotenv').config();

import { Client } from 'discord.js';
import { messageCreate } from './events/messageCreate';

const client = new Client({
  intents: ['GuildMessages', 'MessageContent', 'Guilds'],
});

client.on('ready', () => {
  console.log('Successfully logged in');
});

client.on('messageCreate', messageCreate);

client.login(process.env.TOKEN);
