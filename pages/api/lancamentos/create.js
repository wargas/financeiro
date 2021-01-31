import connect from '../../../utils/database';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';

export default async (req, res) => {

    const { body: dados } = req;
    const { db } = await connect();

    dados.parcelas = Array(dados.parcelas).fill().map((parcela, index) => {
        return {
            descricao: `${dados.descricao} ${index + 1}/${dados.parcelas}`,
            posicao: index + 1,
            total: dados.parcelas,
            competencia: DateTime.fromFormat(dados.primeira_parcela, "MM/yyyy").plus({month: index}).toJSDate(),
            valor: dados.parcela
        }
    });
    dados.cartao = (dados.cartao === '') ? '' : ObjectId(dados.cartao) 

    const data = await db.collection('lancamentos').insertOne(dados)

    res.send(data.ops[0])
}