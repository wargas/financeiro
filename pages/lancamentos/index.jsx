import axios from "axios";
import { DateTime, Settings } from "luxon";
import { useEffect, useState } from "react"
import { toMoney } from "vanilla-masker";
import { Loading, useDialog } from "../../components"
import Toolbar from "../../components/Toolbar";

import FormLancamento from './_formLancamento';



export default () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [competencia, setCompetencia] = useState(DateTime.local())

    useEffect(() => {
        loadLancamentos()
    }, [])

    useEffect(() => {
        setSaldo(items.filter(filterByCompetencia).reduce((acc, item) => {
            if (item.lancamento.tipo === 'receita') {
                return acc + item.valor
            }
            if (item.lancamento.tipo === 'despesa') {
                return acc - item.valor
            }

            return acc;
        }, 0))
    }, [items, competencia])

    const [Dialog, openDialog] = useDialog(FormLancamento, (result) => {
        loadLancamentos();
    })

    const loadLancamentos = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get("/api/lancamentos");

            setItems(data.reduce((acc, item) => {

                const _parcelas = item.parcelas.map((parcela) => {

                    parcela.lancamento = { ...item, parcelas: undefined }

                    return parcela;
                })

                return [...acc, ..._parcelas]
            }, []))
        } catch (error) {

        }
        setLoading(false)
    }


    const filterByCompetencia = (parcela) => {
        return DateTime.fromISO(parcela.competencia).hasSame(competencia, "month")
    }

    return (
        <div>
            {Dialog({
                title: "Informar Lançamento",
                size: "lg"
            })}
            <Loading show={loading} />
            <Toolbar>
                <Toolbar.Title>Lançamentos</Toolbar.Title>
                <Toolbar.SubTitle>Receitas/Despesas</Toolbar.SubTitle>
            </Toolbar>
            <div className="container">
                <div className="d-flex pb-3">
                    <h3>{competencia.toFormat("MMMM/yyyy", { locale: "pt-BR" })}</h3>
                    <div className="btn-group ml-auto">
                        <button onClick={() => setCompetencia(old => old.minus({ month: 1 }))} className="btn btn-outline-info">
                            {competencia.minus({ month: 1 }).toFormat('MM/yyyy')}
                        </button>
                        <button onClick={() => setCompetencia(old => old.plus({ month: 1 }))} className="btn btn-outline-info">
                            {competencia.plus({ month: 1 }).toFormat('MM/yyyy')}
                        </button>
                    </div>
                    <button
                        onClick={() => openDialog({competencia})}
                        className="btn btn-info ml-3">
                        NOVO
                    </button>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Descrição</th>
                                    <th>Competência</th>
                                    <th className="text-right" colSpan="2">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items
                                    .filter(filterByCompetencia)
                                    .map((parcela, index) => (
                                        <tr key={index}>
                                            <td>
                                                {parcela.lancamento.tipo === 'despesa' ? 'D' : 'R'}
                                            </td>
                                            <td>
                                                <span> {parcela.descricao}</span>
                                            </td>
                                            <td>{DateTime.fromISO(parcela.competencia).toFormat("MM/yyyy")}</td>
                                            <td className="text-right">R$ {toMoney(parcela.valor.toFixed(2))}</td>
                                        </tr>
                                    ))}
                                <tr>
                                    <td colSpan="3"></td>
                                    <td className="text-right" colSpan="2">
                                        <span className={saldo < 0 ? 'text-danger' : ''} style={{ fontWeight: 'bold' }}> R$ {saldo < 0 ? '-' : ''} {toMoney(saldo.toFixed(2))}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}