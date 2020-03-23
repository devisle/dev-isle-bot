import { Client, Message, PartialMessage, MessageReaction } from "discord.js";

export default class WelcomeHandler {
    /**
     * The original client obj
     */
    private _client: Client;

    constructor(client: Client) {
        this._client = client;
        this.setupEvents();
    }

    /**
     * Sets up all events included
     */
    private setupEvents(): void {
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
    }

    /**
     * Sets up the message events
     */
    private setupMessageEvents(): void {
        this._client.on("message", ((msg: Message | PartialMessage) => {

        }));
    }

    /**
     * Sets up the messageReactionAddEvents
     */
    private setupMessageReactionAddEvents(): void {
        this._client.on("messageReactionAdd", (messageReaction: MessageReaction) => {
        });
    }


}
