import Link from 'next/link'

export const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg shadow-sm navbar-dark bg-info">
            <div className="container">
                <Link href="/">
                    <a className="navbar-brand">FINACEIRO</a>
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href="/cartoes">
                            <a className="nav-link">Cartões</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/lancamentos"> 
                            <a className="nav-link">Lançamentos</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}