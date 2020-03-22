import { Client, Message, PartialMessage,
         TextChannel,
         User, MessageReaction, GuildMember,
         PartialGuildMember } from "discord.js";
import dotenv from "dotenv";
import CodeHelpHandler from "./channels/code-help/CodeHelpHandler";

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
        /**
         * Welcome message
         */
        this._client.on("guildMemberAdd", (member: GuildMember | PartialGuildMember) => {
            console.log(`Welcome to Dev Isle ${member.displayName}!`);
        });
        /**
         * Setup channel handlers
         */
        new CodeHelpHandler(this._client);
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
        this._client.login(process.env.BOT_TOKEN);
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
            console.log("reacted");
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





}

new Bot();

