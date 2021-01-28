import axios from "axios";
import { useEffect, useState } from "react";

import VMasker from 'vanilla-masker';
import { DateTime } from 'luxon';
import { useDialog, Loading } from "../../components";
import EditCartao from "../../components/cartoes/editCartao";

const Cartoes = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const [DialogEdit, openEdit] = useDialog(EditCartao, (result) => {
        if(result) {
            loadCards()
        }
    })

    useEffect(() => {
        loadCards()
    }, [])

    const loadCards = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get("/api/cartoes");

            setItems(data)
        } catch (error) {

        }

        setLoading(false)
    }

    return (
        <div>
            <Loading show={loading} />
            <h1>Cartões</h1>
            <div className="row">
                {items.map(cartao => (
                    <div key={cartao._id} className="col-3 mb-3">
                        <div
                            onClick={e => openEdit(cartao)}
                            style={{ cursor: "pointer", width: "100%" }}
                            className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{cartao.nome}</h5>
                                <h6 className="text-muted card-subtitle ">
                                    R$ {VMasker.toMoney(cartao.limite * 100)}</h6>
                                <p className="card-text">Vence dia {
                                    DateTime.fromObject({ day: cartao.vencimento }).plus({ month: 1 }).toFormat("D")
                                }</p>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-3 mb-3 d-flex">
                    <div style={{ cursor: "pointer", width: "100%" }}
                        onClick={e => openEdit(null)}
                        className="card">
                        <div className="card-body d-flex align-items-center justify-content-center">
                            <i className="fas fa-plus"></i>
                        </div>
                    </div>
                </div>
            </div>
            {DialogEdit({
                title: "Editar Cartão",
                size: "md"
            })}
        </div>
    )
}

export default Cartoes;