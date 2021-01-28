import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connect = async () => {
    if(!client.isConnected()) await client.connect();

    const db = await client.db('financeiro');

    return {db, client};
}

export default connect;