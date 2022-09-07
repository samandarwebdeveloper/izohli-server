import Head from 'next/head'
import { useRouter } from 'next/router'
function Home({ ctx }) {
  
  return (
    <div>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Izohli bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h2>Dashboard</h2>
      </div>
    </div>
  )
}


Home.getInitialProps = ctx => {
  // We check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
  }
  return { };
}


export default Home