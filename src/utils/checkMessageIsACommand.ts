import { Message, PartialMessage } from "discord.js";

/**
 * Checks if the msg begins with "!"
 * @param msg Any message typed by a user in any channel
 */
export function checkMessageIsACommand(msg: Message | PartialMessage): Boolean {
    if (msg.content[0] === "!") {
        return true;
    }
    return false;
}
