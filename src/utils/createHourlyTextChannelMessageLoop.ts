import { Client, Channel, TextChannel, Message } from "discord.js";
import { getPreviousMessageForChannel } from "./";

/**
 * Creates a message loop to be run every hour at XX:00:00 but watched for repeats in the sense that,
 * if the previous message author was a bot(any bot at all). Then we don't need to send another message.
 * @param channel the channel to send the message in - please only pass TextChannels
 * @param msg the message text to send
 */
export function createHourlyTextChannelMessageLoop(client: Client, channel: Channel, msg: String): void {
    let d: Date;
    const tChannel: TextChannel = channel as TextChannel;

    setInterval(() => {
        d = new Date();
        getPreviousMessageForChannel(tChannel.id, client).then((prevMsg: Message | void) => {
            if (!(prevMsg as Message).author.bot && d.getMinutes() === 0o0) {
                tChannel.send(msg);
            }
        });
    }, 60000);
}
