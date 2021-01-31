import Head from 'next/head'
import { Navbar } from '../components/navbar'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="">
      <Head>
        <title>Dashboard</title>
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
