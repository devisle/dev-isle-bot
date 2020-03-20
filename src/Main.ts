import { Client, Message, PartialMessage, TextChannel, Channel, DMChannel }  from "discord.js";
import dotenv from "dotenv";

class Main {
    /**
     * The base Discord.js client
     */
    private readonly _client = new Client();
    /**
     * A tracker of the currently active question user's ID allowed
     * to be answered in #code-help
     */
    private _currentActiveQuestionUserID: string;

    constructor() {
        dotenv.config();
        this._client.on("ready", () => {
            console.log(`Logged in as: ${this._client.user?.tag}`);
            /**
             * Message timers
             */
            // code-help
            this.createHourlyTextChannelMessageLoop(this._client.channels.cache.get("581854334401118292"),
            "Remember to *ask* questions, there's no need to ask to ask! :smile:");
        });

        this._client.on("message", ((msg: Message | PartialMessage) => {
            /**
             * Command register
             */
            // check for traditional "!" command
            if (this.checkMessageIsACommand(msg)) {

            }

            this.assignQuestionUserID(msg);

        }));

        this._client.login(process.env.BOT_TOKEN);
    }

    /**
     *
     * @param msg
     */
    private assignQuestionUserID(msg: Message | PartialMessage): void {
        if (this.checkMessageIsACodeHelpQuestion(msg)) {
            this._currentActiveQuestionUserID = msg.member.id;
            console.log(this._client.users.cache.get(this._currentActiveQuestionUserID));
        }
    }

    /**
     * Check if the message is prefixed with [QUESTION] and it is in "code-help"
     * @param msg a message sent by a user
     */
    private checkMessageIsACodeHelpQuestion(msg: Message | PartialMessage): boolean {
        const prefix = msg.content.substring(0, 11);

        if (prefix === "[QUESTION] " && this.getChannelName(msg) === "vip-chat") {
            return true;
        }
    }
    /**
     * Checks if the msg begins with "!"
     * @param msg Any message typed by a user in any channel
     */
    private checkMessageIsACommand(msg: Message | PartialMessage): Boolean {
        if (msg.content[0] === "!") {
            return true;
        }
        return false;
    }
    /**
     * Gets the channel name of a users typed message
     * @param msg Any message typed by a user in any channel
     */
    private getChannelName(msg: Message | PartialMessage): String {
        return (msg.channel as TextChannel).name;
    }

    /**
     * Returns a promise for the last sent message within a given channel
     * @param channelID a string representing a channel's ID
     */
    private getPreviousMessageForChannel(channelID: string): Promise<Message | void> {
        const x = this._client.channels.cache.get(channelID) as TextChannel;
        return x.messages.fetch(x.lastMessageID);
    }

    /**
     * Creates a message loop to be run every hour at XX:00:00 but watched for repeats in the sense that,
     * if the previous message author was a bot(any bot at all). Then we don't need to send another message.
     * @param channel the channel to send the message in - please only pass TextChannels
     * @param msg the message text to send
     */
    private createHourlyTextChannelMessageLoop(channel: Channel, msg: String): void {
        let d: Date;
        const tChannel: TextChannel = channel as TextChannel;

        setInterval(() => {
            d = new Date();
            this.getPreviousMessageForChannel(tChannel.id).then((prevMsg: Message | void) => {
                if (!(prevMsg as Message).author.bot && d.getMinutes() === 17) {
                    tChannel.send(msg);
                }
            });
        }, 60000);
    }

}

new Main();


