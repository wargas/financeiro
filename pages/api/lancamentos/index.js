import connect from '../../../utils/database';

export default async (req, res) => {

    const { db, client } = await connect();

    const result = await db.collection('lancamentos').aggregate([{
        $lookup: {
            from: 'cartoes',
            localField: 'cartao',
            foreignField: '_id',
            as: 'cartoes'
        }
    }]).map(item => {

        const [cartao = null] = item.cartoes;

        item.cartao = cartao;

        item.cartoes = undefined;

        return item;
    }).toArray();

    res.send(result);
}