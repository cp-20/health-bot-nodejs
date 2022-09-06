import { CacheType, Interaction } from 'discord.js';
import { getMemberData } from '../firebase/memberData';

export const interactionCreate = async (
  interaction: Interaction<CacheType>
) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'score') {
    const guild = interaction.guild;

    if (guild === null) {
      const memberData = await getMemberData(interaction.user.id);
      await interaction.reply({
        content: `あなたの健康ポイントは **${memberData.point}p** なのだ`,
        ephemeral: true,
      });
      return;
    }

    const memberDatas = await Promise.all(
      guild.members.cache.map((_, id) => getMemberData(id))
    );

    guild.members.cache.forEach(async (_, id) => {
      console.log(id, await getMemberData(id));
    });

    memberDatas.sort((data1, data2) => data2.point - data1.point);

    const content = (() => {
      let content = '';
      let rank = 1;
      let previousPoint = null;
      for (let i = 0; i < memberDatas.length; i++) {
        const memberData = memberDatas[i];
        if (memberData.point === 0) break;

        if (previousPoint === null || memberData.point < previousPoint) {
          rank = i + 1;
          previousPoint = memberData.point;
        }

        content += `**#${rank}** <@${memberData.id}> - ${memberData.point}p\n`;
      }

      return content;
    })();

    await interaction.reply({
      content: '',
      embeds: [
        {
          title: '健康ポイント',
          description: content,
        },
      ],
    });
  }
};
