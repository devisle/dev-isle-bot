import { Message, PartialMessage, TextChannel } from "discord.js";
/**
 * Gets the channel name of a users typed message
 * @param msg Any message typed by a user in any channel
 */
export default function getChannelName(msg: Message | PartialMessage): String {
    return (msg.channel as TextChannel).name;
}
