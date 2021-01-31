import { useFormik } from "formik";
import { useEffect, useState } from "react";

import { DateTime } from 'luxon';
import VMasker, { toMoney } from 'vanilla-masker';
import { Input, Loading } from "../../components";
import axios from "axios";

const FormLancamento = ({ data, onClose }) => {

    const [loading, setLoading] = useState(false);
    const [parcelas, setParcelas] = useState([]);
    const [cartoes, setCartoes] = useState([]);

    useEffect(() => {
        loadCartoes()

        if(data?.competencia) {
            formik.setFieldValue('primeira_parcela', data?.competencia.toFormat("MM/yyyy"))
        }

    }, [data])

    const formik = useFormik({
        initialValues: {
            tipo: 'despesa',
            descricao: '',
            valor: '0,00',
            parcelas: '1',
            parcela: '0,00',
            cartao: '',
            primeira_parcela: DateTime.local().plus({ months: 1 }).toFormat("MM/yyyy")
        },
        onSubmit: async (values) => {
            setLoading(true)
            const dados = ({
                ...values,
                valor: parseFloat(values.valor.replace(/\D/g, "")) / 100,
                parcela: parseFloat(values.parcela.replace(/\D/g, "")) / 100,
                parcelas: parseInt(values.parcelas) || 0,
                primeira_parcela: values.primeira_parcela.length === 7
                    ? values.primeira_parcela
                    : DateTime.local().toFormat("MM/yyyy")
            })

            const { data: result } = await axios.post("/api/lancamentos/create", dados);

            setLoading(false)
            
            onClose(result)
        }
    })

    useEffect(() => {
        const { values } = formik;

        if (formik.values.primeira_parcela.length !== 7) {
            return;
        }

        const valor = parseFloat(values.valor.replace(/\D/g, "")) / 100;
        const _parcelas = parseInt(values.parcelas) || 0;
        const _parcela = parseFloat(values.parcela.replace(/\D/g, "")) / 100;
        const year = parseInt(values.primeira_parcela.replace(/^(\d{2})\/(\d{4})$/, "$2")) || 0;
        const month = parseInt(values.primeira_parcela.replace(/^(\d{2})\/(\d{4})$/, "$1")) || 0;

        if (document.activeElement?.name === 'parcela') {
            formik.setFieldValue('valor', VMasker.toMoney((_parcelas * _parcela).toFixed(2)))
        } else {
            formik.setFieldValue('parcela', VMasker.toMoney((valor / _parcelas).toFixed(2)))
        }

        setParcelas(Array(_parcelas).fill().map((item, mes) => {
            return {
                competencia: DateTime.fromObject({ year, month: month }).plus({ month: mes }),
                valor: valor / _parcelas
            }
        }));


    }, [
        formik.values.valor,
        formik.values.parcelas,
        formik.values.parcela,
        formik.values.primeira_parcela])


    const loadCartoes = async () => {
        setLoading(true)
        try {
            const { data: items } = await axios.get("/api/cartoes");

            console.log(items)

            setCartoes(items)
        } catch (error) {

        }
        setLoading(false)
    }


    return (
        <div>
            <Loading show={loading} />
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-3">
                        <label className="mb-0">Tipo</label>
                        <select
                            value={formik.values.tipo}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="tipo"
                            className="form-control">
                            <option value="despesa">DESPESA</option>
                            <option value="receita">RECEITA</option>
                        </select>
                    </div>
                    <div className="col-3">
                        <label className="mb-0">Cartão</label>
                        <select
                            value={formik.values.cartao}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="cartao"
                            className="form-control">
                            <option value="">...</option>
                            {cartoes.map(cartao => (
                                <option key={cartao._id} value={cartao._id}>{cartao.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label className="mb-0">Descrição</label>
                        <Input
                            value={formik.values.descricao}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="descricao"
                            type="text" className="form-control" />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <label className="mb-0">Valor</label>
                        <Input
                            money
                            value={formik.values.valor}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="valor"
                            type="text" className="form-control" />
                    </div>
                    <div className="col">
                        <label className="mb-0">Parcelas</label>
                        <Input
                            value={formik.values.parcelas}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="parcelas"
                            type="text" className="form-control" />
                    </div>
                    <div className="col">
                        <label className="mb-0">Parcela</label>
                        <Input
                            value={formik.values.parcela}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="parcela"
                            money={true}
                            type="text" className="form-control" />
                    </div>
                    <div className="col">
                        <label className="mb-0">Primeira Parcela</label>
                        <Input
                            value={formik.values.primeira_parcela}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="primeira_parcela"
                            mask="99/9999"
                            type="text" className="form-control" />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <div className="border p-3">
                            {parcelas.map(parcela => (
                                <span key={parcela.competencia.toMillis()} className="badge badge-secondary mr-2">
                                    {parcela.competencia.toFormat("MM/yyyy")} - {toMoney(parcela.valor.toFixed(2))}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row  mt-3">
                    <div className="col d-flex">
                        <button className="btn btn-info">SALVAR</button>
                        <button type="button" onClick={() => onClose()} className="btn btn-secondary ml-auto">CANCELAR</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FormLancamento;