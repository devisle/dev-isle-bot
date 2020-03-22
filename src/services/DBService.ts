import { MongoClient, Collection } from "mongodb";


export default class DBService {
    /**
     * Connects to a mongo db and specific collection, returns the prepared Collection<T>
     * @param dbName the db you wish to connect to
     * @param collectionName the collection you wish to access
     * TODO: Type the schema
     */
    public static async connect(dbName: string, collectionName: string): Promise<Collection> {
        // export function connect(uri: string, options?: MongoClientOptions): Promise<MongoClient>;
        return (await MongoClient.connect(
            process.env.MONGO_URL,
            { useUnifiedTopology: true })
        ).db(dbName).collection(collectionName);
    }

}
