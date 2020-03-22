import { Client, Message, PartialMessage, TextChannel, User, MessageReaction } from "discord.js";
import { createHourlyTextChannelMessageLoop, getChannelName } from "../../utils";


export default class CodeHelpHandler {
    /**
     * The original client obj
     */
    private _client: Client;

    /**
     * A tracker of the currently active question user's ID
     */
    private _currentActiveQuestionUserID: string;

    constructor(client: Client) {
        this._client = client;
        this.setupEvents();
    }

    /**
     * Sets up all events included
     */
    private setupEvents(): void {
        this.setupReadyEvents();
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
    }

    /**
     * Sets up the ready events
     */
    private setupReadyEvents(): void {
        this._client.on("ready", () => {
            console.log(`Logged in as: ${this._client.user?.tag}`);
            createHourlyTextChannelMessageLoop(this._client, this._client.channels.cache.get("581854334401118292"),
                "Remember to *ask* questions, there's no need to ask to ask! :smile:");
        });
    }

    /**
     * Sets up the message events
     */
    private setupMessageEvents(): void {
        this._client.on("message", ((msg: Message | PartialMessage) => {
            this.setActiveCodeHelpQuestion(msg);
        }));
    }


    // sets the currently active question within #code-help
    private setActiveCodeHelpQuestion(msg: Message | PartialMessage): void {
        if (this.checkMessageIsACodeHelpQuestion(msg)) {
            this.assignActiveQuestionUserID(msg);
        }
    }

    // check if the message is prefixed with [QUESTION] and it is in "code-help"
    private checkMessageIsACodeHelpQuestion(msg: Message | PartialMessage): boolean {
        const prefix = msg.content.substring(0, 11);

        if (prefix === "[QUESTION] " && getChannelName(msg) === "vip-chat") {
            return true;
        }
    }

    // assigns the ID of a user to this._currentActiveQuestionUserID
    private assignActiveQuestionUserID(msg: Message | PartialMessage): void {
        this._currentActiveQuestionUserID = msg.member.id;
        console.log("New active question asker user:");
        console.log(this._client.users.cache.get(this._currentActiveQuestionUserID));
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

    //
    private watchForCodeHelpAnswerReaction(msgReaction: MessageReaction): void {
        const currentQuestionAsker: User = this._client.users.cache.get(this._currentActiveQuestionUserID);
        console.log("reaction happened");
        if ((msgReaction.message.channel as TextChannel).name === "vip-chat") {
            console.log("reaction in vip chat");
        }
    }


}
