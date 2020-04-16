import { Client, Message, PartialMessage, TextChannel, MessageReaction } from "discord.js";
import { getChannelName, checkMessageIsACommand } from "../../utils";
import DBService from "../../services/DBService";
import { Collection } from "mongodb";
import RoleService from "../../services/RoleService";
import IChannel from "../IChannel";

/**
 * CODE-HELP: 581854334401118292
 */

export default class CodeHelpHandler implements IChannel {
    /**
     * The original client obj
     */
    public readonly CLIENT: Client;

    /**
     * A tracker of the currently active question user's ID
     */
    private _currentActiveQuestionUserID: string;

    /**
     * A tracker of the current active question message ID
     */
    private _currentActiveQuestionMsgID: string;

    constructor(client: Client) {
        this.CLIENT = client;
    }

    /**
     * Sets up all events included
     */
    public setupEvents(): void {
        this.setupReadyEvents();
        this.setupMessageEvents();
        this.setupMessageReactionAddEvents();
    }

    /**
     * Sets up the ready events
     */
    private setupReadyEvents(): void {
        this.CLIENT.on("ready", () => {
            console.log(`Logged in as: ${this.CLIENT.user?.tag}`);
            // createHourlyTextChannelMessageLoop(this.CLIENT, this.CLIENT.channels.cache.get("581854334401118292"),
            //    "Please follow our system when asking questions, use command '!question-help' for more info!");
        });
    }

    /**
     * Sets up the message events
     */
    private setupMessageEvents(): void {
        this.CLIENT.on("message", ((msg: Message | PartialMessage) => {
            this.setActiveCodeHelpQuestion(msg);
            this.questionHelpCommand(msg);
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
        const prefix = msg.content.substring(0, 4);
        if (prefix === "[Q] " && msg.channel.id === "581854334401118292") {
            return true;
        }
    }

    private questionHelpCommand(message: Message | PartialMessage): void {
        if (checkMessageIsACommand(message) && message.channel.id === "581854334401118292") {
            if (message.content.substring(1, 14) === "question-help") {
                message.author.send(
                    "In order to ask questions in **#code-help**, you must begin your message with **[Q]**."
                    + "\n" +
                    "React with a ✅ checkmark to select an answer."
                    + "\r" +
                    "When the checkmark turns into ☑️, the points for that users role have been updated"
                    + "\r" +
                    "Happy coding! Love, *Dev Isle team*.");
            }
        }
    }

    /**
     * Sets up the messageReactionAddEvents
     */
    private setupMessageReactionAddEvents(): void {
        this.CLIENT.on("messageReactionAdd", (messageReaction: MessageReaction) => {
            this.watchForCodeHelpAnswerReaction(messageReaction);
        });
    }

    // watches for a reaction of '✅' by the owner of a question
    private async watchForCodeHelpAnswerReaction(msgReaction: MessageReaction): Promise<void> {
        const emojiName = msgReaction.emoji.name;
        const emojiMsgId = msgReaction.message.id;
        const emojiMsgAuthor = msgReaction.message.author;

        // disallow blue tick if user isn't a bot
        // disallow green tick being used on active question
        // disallow use of green tick on answers unless you're active question user
        const tickUsageIsIllegal = (emojiName === "☑️" && !msgReaction.me
        || emojiMsgId === this._currentActiveQuestionMsgID && emojiName === "✅"
        || emojiName === "✅" && !msgReaction.users.cache.get(this._currentActiveQuestionUserID));

        // if the tick is green, the active question user has reacted, the message is not the question id
        // and the author of the msg reacted to is not the active question user, accept the answer
        const tickUsageIsLegal = (emojiName === "✅" && msgReaction.users.cache.get(this._currentActiveQuestionUserID)
        && emojiMsgId !== this._currentActiveQuestionMsgID
        && emojiMsgAuthor !== msgReaction.users.cache.get(this._currentActiveQuestionUserID));

        const userIsAttemptingToAnswerOwnQuestion = (msgReaction.emoji.name === "✅"
        && msgReaction.users.cache.get(this._currentActiveQuestionUserID)
        && msgReaction.message.id !== this._currentActiveQuestionMsgID
        && msgReaction.message.author === msgReaction.users.cache.get(this._currentActiveQuestionUserID));

        // ensure it is the correct channel
        if (msgReaction.message.channel.id === "581854334401118292") {
            if (tickUsageIsIllegal) {
                msgReaction.remove();
            }

            if (tickUsageIsLegal) {
                msgReaction.remove();
                msgReaction.message.react("☑️");
                // reset the active question user for next question
                this._currentActiveQuestionUserID = "";
                this.updateUsersPoints(msgReaction.message.author.id, msgReaction);
            } else if(userIsAttemptingToAnswerOwnQuestion) {
                msgReaction.message.channel.send("You can't answer your own question...");
                msgReaction.remove();
            }
        }

    }

    /**
     * PLEASE NOTE: We're also updating the users role inside of here,
     * this obviously needs removing and doing better!!!
     */
    private async updateUsersPoints(correctAnswerUsersID: string, msgReaction: MessageReaction): Promise<void> {
        await DBService.connect(process.env.MONGO_DB_NAME, "roles").then((collection: Collection) => {
            // check if answerer has answered a question before
            collection.find({ userID: correctAnswerUsersID }).toArray((err, docs) => {
                // if they have, update their rolePoints by 5
                if (docs.length > 0) {
                    const user: { _id: string, userID: string, rolePoints: number } = docs[0];
                    const currentPoints = (user?.rolePoints) + 5;
                    console.log(docs);
                    collection.updateOne({ userID: correctAnswerUsersID },
                        {
                            $set: { rolePoints: user.rolePoints + 5}
                        }
                    );
                msgReaction.message.channel.send("Answer accepted ☑️, 5 points given to: "
                + msgReaction.message.author.toString() + " now has " + (currentPoints) + " points");
                RoleService.setCorrectContributorRole(currentPoints, msgReaction.message);
                } else if(docs.length === 0) {
                    console.log("creating new role entry for user");
                // if not just create a new entry
                    collection.insertMany([
                        {
                            userID: correctAnswerUsersID,
                            rolePoints: 5
                        }
                    ]);
                    msgReaction.message.channel.send("Answer accepted ☑️, 5 points given to: " + msgReaction.message.author.toString() + " now has 5 points");
                }
            });
        });
    }

}
