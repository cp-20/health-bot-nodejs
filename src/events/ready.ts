import { ApplicationCommandDataResolvable, Client } from 'discord.js';

export const ready = async (client: Client<true>) => {
  const data: ApplicationCommandDataResolvable[] = [
    {
      name: 'score',
      description: '健康ポイントを表示',
    },
  ];
  client.guilds.cache.forEach((guild) => {
    client.application.commands.set(data, guild.id);
  });

  console.log('Successfully set up');
};
