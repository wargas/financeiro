import { Spinner } from "react-bootstrap"

const Loading = ({ show, backgroundColor = '#FFFFFF11' }) => {

    if(!show) {
        return null;
    }

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: backgroundColor,
                zIndex: 1
            }}>
            <Spinner animation="border" variant="info" />
        </div>
    )
}

export default Loading;