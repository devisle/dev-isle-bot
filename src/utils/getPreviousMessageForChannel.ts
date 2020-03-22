import { Client, TextChannel, Message } from "discord.js";

/**
 * Returns a promise for the last sent message within a given channel
 * @param channelID a string representing a channel's ID
 */
export default function getPreviousMessageForChannel(channelID: string, client: Client): Promise<Message | void> {
    const x = client.channels.cache.get(channelID) as TextChannel;
    return x.messages.fetch(x.lastMessageID);
}
