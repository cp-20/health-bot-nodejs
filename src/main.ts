require('dotenv').config();

import { ActivityType, Client, Options } from 'discord.js';
import { interactionCreate } from './events/interactionCreate';
import { messageCreate } from './events/messageCreate';
import { ready } from './events/ready';
// import { presenceUpdate } from './events/presenceUpdate';
import { init } from './server';
import { observe } from './streakUpdate';

const client = new Client({
  intents: ['GuildMessages', 'MessageContent', 'Guilds', 'GuildPresences'],
  presence: {
    activities: [
      {
        name: 'はやくねるのだ',
        type: ActivityType.Playing,
      },
    ],
  },
  makeCache: Options.cacheEverything(),
});

client.on('ready', ready);

// メッセージ送信
client.on('messageCreate', messageCreate);

// コマンド送信
client.on('interactionCreate', interactionCreate);

// ステータス更新
// client.on('presenceUpdate', presenceUpdate);

init();

observe(client);

client.login(process.env.TOKEN);
