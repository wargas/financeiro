import connect from '../../../utils/database';

export default async (req, res) => {

    const {nome, limite = 0, vencimento = 1} = req.body

    const {db} = await connect();

    const result = await db.collection('cartoes')
        .insertOne({nome, limite, vencimento})


    res.send(result.ops[0])
}