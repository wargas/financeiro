import { useState } from "react";
import { Modal } from "react-bootstrap"

const useDialog = (Element, onClose = () => {}) => {

    const [show, setShow] = useState(false);
    const [data, setData] = useState(null);

    const openDialog = (_data) => {
        setShow(true);
        setData(_data)
    }

    const Dialog = (_options) => {

        const options = {
            title: "Title",
            size: "lg",
            ..._options
        }


        const handlerClose = (result) => {
            setShow(false);

            onClose(result)
        }


        return (
            <Modal show={show} size={options.size} onHide={() => handlerClose(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>{options.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {show && (
                        <Element onClose={handlerClose} data={data} />
                    )}
                </Modal.Body>
            </Modal>
        )
    }

    return [Dialog, openDialog];
}

export default useDialog;