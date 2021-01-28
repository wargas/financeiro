import { ObjectId } from 'mongodb';
import connect from '../../../../utils/database';

export default async (req, res) => {

    const { nome, limite, vencimento } = req.body;
    const { id } = req.query;

    const { db } = await connect();

    const filter = {
        _id: ObjectId(id)
    }

    const data = { $set: {nome, limite, vencimento}}

    
    const {result} = await db.collection('cartoes')
        .updateOne(filter, data)


    res.send({ok: result.ok})
}