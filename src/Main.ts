import { Client, Message, PartialMessage, TextChannel, Channel }  from "discord.js";
import dotenv from "dotenv";

class Main {
    private readonly _client = new Client();

    constructor() {
        dotenv.config();
        this._client.on("ready", () => {
            console.log(`Logged in as: ${this._client.user?.tag}`);

            /**
             * Message timers
             */
            // code-help
            this.createHourlyTextChannelMessageLoop(this._client.channels.cache.get("624309965934428180"),
            "Remember to *ask* questions, there's no need to ask to ask! :smile:");


        });

        this._client.on("message", (msg => {
        }));

        this._client.login(process.env.BOT_TOKEN);
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
     * Creates a message loop to be run every hour at XX:00:00 but watched for repeats,
     * if a repeat is found. No message is sent until the next hour.
     * @param channel the channel to send the message in - please only pass TextChannels
     * @param msg the message text to send
     */
    private createHourlyTextChannelMessageLoop(channel: Channel, msg: String): void {
        let d: Date;
        const tChannel: TextChannel = channel as TextChannel;

        setInterval(() => {
            d = new Date();
            this.getPreviousMessageForChannel(tChannel.id).then((prevMsg: Message | void) => {
                if ((prevMsg as Message).content !== msg && d.getMinutes() === 0o4) {
                    tChannel.send(msg);
                }
            });
        }, 60000);
    }
}

new Main();


