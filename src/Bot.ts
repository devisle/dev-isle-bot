import { Client, Message, PartialMessage, TextChannel, Channel, DMChannel, User, MessageReaction } from "discord.js";
import dotenv from "dotenv";

class Bot {
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
        this.setupReadyEvents();
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
        this._client.login(process.env.BOT_TOKEN);
    }

    /**
     * Sets up the ready events
     */
    private setupReadyEvents(): void {
        this._client.on("ready", () => {
            console.log(`Logged in as: ${this._client.user?.tag}`);
            // code-help
            this.createHourlyTextChannelMessageLoop(this._client.channels.cache.get("581854334401118292"),
                "Remember to *ask* questions, there's no need to ask to ask! :smile:");
        });
    }

    /**
     * Sets up the message events
     */
    private setupMessageEvents(): void {
        this._client.on("message", ((msg: Message | PartialMessage) => {
            this.performCommand(msg);

            this.setActiveCodeHelpQuestion(msg);
        }));
    }

    /**
     * Sets up the messageReactionAddEvents
     */
    private setupMessageReactionAddEvents(): void {
        this._client.on("messageReactionAdd", (messageReaction: MessageReaction) => {
            this.watchForCodeHelpAnswerReaction(messageReaction);
        });
    }

    private watchForCodeHelpAnswerReaction(msgReaction: MessageReaction): void {
        const currentQuestionAsker: User = this._client.users.cache.get(this._currentActiveQuestionUserID);
        console.log("reaction happened");
        if ((msgReaction.message.channel as TextChannel).name === "vip-chat") {
            console.log("reaction in vip chat");
        }
    }

    /**
     * Sets the currently active question within #code-help
     * --- this is just a POC, will adjust to apply to ALL channels if works out ---
     * @param msg a message sent by a user
     */
    private setActiveCodeHelpQuestion(msg: Message | PartialMessage): void {
        if (this.checkMessageIsACodeHelpQuestion(msg)) {
            this.assignActiveQuestionUserID(msg);
        }
    }

    /**
     * Checks if the message is a command, if it is, performs given command
     * @param msg a message sent by a user
     */
    private performCommand(msg: Message | PartialMessage): void {
        if (this.checkMessageIsACommand(msg)) {
            console.log("command written");
        }
    }

    /**
     * Assigns the ID of a user to this._currentActiveQuestionUserID
     * @param msg a message sent by a user
     */
    private assignActiveQuestionUserID(msg: Message | PartialMessage): void {
        this._currentActiveQuestionUserID = msg.member.id;
        console.log("New active question asker user:");
        console.log(this._client.users.cache.get(this._currentActiveQuestionUserID));
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

new Bot();


