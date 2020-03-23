import { Client } from "discord.js";

export default interface IChannel {
    CLIENT: Client;
    setupEvents: () => void;
}
