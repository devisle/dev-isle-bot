import { Message, PartialMessage } from "discord.js";
import { checkMessageIsACommand } from "./";

/**
 * Checks if the message is a command, if it is, performs given command
 * @param msg a message sent by a user
 */
export function performCommand(msg: Message | PartialMessage): void {
    if (checkMessageIsACommand(msg)) {
        console.log("command written");
    }
}
