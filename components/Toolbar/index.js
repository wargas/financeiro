const Toolbar = ({ children }) => {
    return (
        <div className="toolbar border-bottom mb-3 px-3 py-2 ">
            <div className="container">

                {children}
            </div>
        </div>
    )
}

Toolbar.Title = ({ children }) => {
    return (
        <h3>{children}</h3>
    )
}

Toolbar.SubTitle = ({ children }) => {
    return (
        <p className="text-muted mb-0">{children}</p>
    )
}

export default Toolbar;