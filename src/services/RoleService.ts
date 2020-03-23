import { Message, PartialMessage } from "discord.js";
/**
 * Novice Contributor
 * 691342664062337094
 *
 * 691422001146888232
 * Beginner Contributor
 *
 * Competent Contributor
 * 691421991256719482
 *
 * Proficient Contributor
 * 691425432368709682
 *
 * Expert Contributor
 * 691425440421642310
 *
 * ------------------------
 *
 * Front-End
 * 606176637544824853
 *
 * Back-End
 * 606176851706249217
 *
 * DevOps
 * 606176895071027200
 *
 * UI/UX
 * 606176959105597440
 */
export default class RoleService {

    public static setCorrectContributorRole(
        dbUser: { _id: string, userID: string, rolePoints: number },
        message: Message | PartialMessage): void {
        switch (true) {
            case (dbUser.rolePoints <= 10):
                message.member.roles.add("691342664062337094");
                break;
            case (dbUser.rolePoints <= 30):
                message.member.roles.remove("691342664062337094");
                message.member.roles.add("691422001146888232");
                break;
            case (dbUser.rolePoints <= 60):
                message.member.roles.remove("691422001146888232");
                message.member.roles.add("691421991256719482");
                break;
            case (dbUser.rolePoints <= 100):
                message.member.roles.remove("691421991256719482");
                message.member.roles.add("691425432368709682");
                break;
            case (dbUser.rolePoints <= 150):
                message.member.roles.remove("691425432368709682");
                message.member.roles.add("691342664062337094");
                break;
            case (dbUser.rolePoints <= 210):
                message.member.roles.remove("691342664062337094");
                message.member.roles.add("691425440421642310");
                break;

        }
    }


}
