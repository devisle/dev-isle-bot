import MongoClient from "mongodb";

export default class DBService {
    constructor() {
        MongoClient.connect(
            process.env.MONGO_URL,
            {
                useUnifiedTopology: true
            },
            (err, client) => {
            console.log(client ? "connected successfully" : "failed");
            if (err) {
                console.log(err);
                throw err;
            }
            client.close();
        });
    }
}
