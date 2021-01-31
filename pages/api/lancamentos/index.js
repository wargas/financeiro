import connect from '../../../utils/database';

export default async (req, res) => {

    const { db } = await connect();

    const result = await db.collection('lancamentos').find().toArray();

    res.send(result) 
}