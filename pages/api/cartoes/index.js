import connect from '../../../utils/database';

export default async (req, res) => {

    const {db} = await connect();

    const data = await db.collection('cartoes').find().toArray()

    res.send(data)
}