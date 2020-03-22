import { Client, Message, PartialMessage, TextChannel, User, MessageReaction, ReactionEmoji, Emoji } from "discord.js";
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
    /**
     * A tracker of the current active question message ID
     */
    private _currentActiveQuestionMsgID: string;

    /**
     * The selected correct answer user's ID -- this is reset upon storing points in DB
     */
    private _activeQuestionAnswerUserID: string;

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


    // sets the currently active question within asker id and msg id
    private setActiveCodeHelpQuestion(msg: Message | PartialMessage): void {
        if (this.checkMessageIsACodeHelpQuestion(msg)) {
            console.log(msg.author.username + " asked question:", "\n", msg.content);
            this._currentActiveQuestionUserID = msg.member.id;
            this._currentActiveQuestionMsgID = msg.id;
        }
    }

    // check if the message is prefixed with [QUESTION] and it is in "code-help"
    private checkMessageIsACodeHelpQuestion(msg: Message | PartialMessage): boolean {
        const prefix = msg.content.substring(0, 11);
        if (prefix === "[QUESTION] " && getChannelName(msg) === "test") {
            return true;
        }
    }

    /**
     * Sets up the messageReactionAddEvents
     */
    private setupMessageReactionAddEvents(): void {
        this._client.on("messageReactionAdd", (messageReaction: MessageReaction) => {
            this.watchForCodeHelpAnswerReaction(messageReaction);
        });
    }

    // watches for a reaction of '✅' by the owner of the question,
    // disallows any none question askers to use '✅' whilst a question
    // is active
    // eEDIT: convert the reactions to look for ID's instead of icons, just to future proof this
    private watchForCodeHelpAnswerReaction(msgReaction: MessageReaction): void {
        // completely prevent the use of ☑️, it will be a bot only reaction
        if (msgReaction.emoji.name === "☑️" && !msgReaction.me) {
            msgReaction.remove();
        }

        if ((msgReaction.message.channel as TextChannel).name === "test") {
            // prevent calling an answer on the question itself by anyone
            if (msgReaction.message.id === this._currentActiveQuestionMsgID &&
                msgReaction.emoji.name === "✅") {
                msgReaction.remove();
            }
            // prevent anyone but the active question user using the greentick
            if (msgReaction.emoji.name === "✅" && !msgReaction.users.cache.get(this._currentActiveQuestionUserID)) {
                msgReaction.remove();
            }
            // accept clause
            if (msgReaction.emoji.name === "✅"
                && msgReaction.users.cache.get(this._currentActiveQuestionUserID)
                && msgReaction.message.id !== this._currentActiveQuestionMsgID) {
                msgReaction.remove();
                msgReaction.message.react("☑️");
                console.log("Question answered");
                this._currentActiveQuestionUserID = "";
                msgReaction.message.channel.send(
                    "Answered accepted ☑️, 5 points given to: " +
                    msgReaction.message.author.toString());

            }

        }

    }


}
