import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

import VMasker from 'vanilla-masker';
import Input from "../Input";
import Loading from "../loading";

const EditCartao = ({ data, onClose }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
            formik.setValues({
                nome: data.nome,
                limite: VMasker.toMoney(data.limite * 100),
                vencimento: data.vencimento
            })
        }
    }, [data])

    const formik = useFormik({
        initialValues: {
            nome: "",
            limite: VMasker.toMoney(0),
            vencimento: ""
        },
        onSubmit: async (values) => {
            setLoading(true)
            try {
                const dados = {
                    ...values,
                    limite: parseFloat(values.limite.replace(/\./g, "").replace(",", "."))
                }

                const { data: result } = await axios.post("/api/cartoes/create", dados);

                onClose(result)

            } catch (error) {

            }
            setLoading(false)
        }
    })

    return (
        <div>
            <Loading show={loading} backgroundColor={'white'} />
            <form onSubmit={formik.handleSubmit}>
                <div className="row">
                    <div className="col-12">
                        <label>Nome</label>
                        <Input
                            value={formik.values.nome}
                            onChange={formik.handleChange}
                            name="nome"
                            type="text" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label>Limite</label>
                        <Input
                            money
                            value={formik.values.limite}
                            onChange={formik.handleChange}
                            name="limite"
                            type="text" className="form-control" />
                    </div>
                    <div className="col-6">
                        <label>Vencimento</label>
                        <Input
                            value={formik.values.vencimento}
                            onChange={formik.handleChange}
                            name="vencimento"
                            type="text" className="form-control" />
                    </div>
                    <div className="col-12 mt-3 d-flex">
                        <button className="btn btn-info">Salvar Cartão</button>
                        <button type="button" onClick={() => onClose(null)} className="btn btn-secondary ml-auto">Cancelar</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditCartao;