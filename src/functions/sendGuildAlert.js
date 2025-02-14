const
  {
    EmbedBuilder,
    WebhookClient,
    ChannelType
  } = require("discord.js"),
  error = require("./error"),
  copyRight = require("../storage/embed"),
  config = require("../../config");

/**
 *
 * @param {{ client: import("discord.js").Client, guild: import("discord.js").Guild, guildChannel: import("discord.js").GuildChannel, isWebhook: boolean, description: string }} param0
 * @returns {import("discord.js").Message}
 */
module.exports = async function ({
  client,
  guild,
  guildChannel = null,
  isWebhook = false,
  description = "-# **The total number of servers I'm a member of is \`{guilds}\`**"
}) {
  try {
    let channel;
    let invite;
    let messageData = {};
    const inviteData = {
      reason: "Invite the developers",
      maxAge: 0
    };
    if (isWebhook) {
      channel = new WebhookClient({ url: config.discord.support.webhook.url });
      messageData.avatarURL = config.discord.support.webhook.avatar;
      messageData.username = config.discord.support.webhook.username;
      if (config.discord.support.webhook.threads.status)
        messageData.threadId = config.discord.support.webhook.threads.status;
    }

    else
      channel = guildChannel;

    try {
      invite = await guild.widgetChannel?.createInvite(inviteData) ||
        await guild.rulesChannel?.createInvite(inviteData) ||
        await guild.channels.cache
          .filter(a => a.type === ChannelType.GuildText && a.viewable)
          .random(1)[0]
          .createInvite(inviteData);
    } catch { };
    const owner = await guild?.fetchOwner();
    const embed = new EmbedBuilder()
      .setAuthor(
        {
          name: owner?.user?.tag,
          iconURL: owner?.user?.displayAvatarURL({ dynamic: true })
        }
      )
      .setDescription(description.replace("{guilds}", client.guilds.cache.size.toLocaleString()))
      .addFields(
        [
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].owner}| Owner: `,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **${owner?.user} | \`${owner?.user?.tag}\` | \`${owner?.user?.id}\`**`,
            inline: false
          },
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].server}| Guild: `,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **${invite ? `[${guild.name}](${invite.url})` : `${guild.name}`} | \`${guild.id}\` | \`${guild.memberCount}\` Members**`,
            inline: false
          },
          {
            name: `${copyRight.emotes[isWebhook ? "default" : "theme"].date}| Created at:`,
            value: `${copyRight.emotes[isWebhook ? "default" : "theme"].reply} **<t:${Date.parse(guild.createdAt) / 1000}:D> | <t:${Date.parse(guild.createdAt) / 1000}:R>**`,
            inline: false
          }
        ]
      )
      .setColor(description.includes("revoked") ? copyRight.color.redlight : description.includes("join") ? copyRight.color.greenlight : copyRight.color.theme)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter(
        {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL({ dynamic: true })
        }
      )
      .setTimestamp(Date.now());

    messageData.embeds = [embed];
    return await channel.send(messageData);
  } catch (e) {
    error(e)
  }
}
/**
 * @copyright
 * Coded by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * @copyright
 * Work for Persian Caesar | https://dsc.gg/persian-caesar
 * @copyright
 * Please Mention Us "Persian Caesar", When Have Problem With Using This Code!
 * @copyright
 */
