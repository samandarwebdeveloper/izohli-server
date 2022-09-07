import Head from 'next/head'
import styles from '../styles/Login.module.css'
import Spinner from '../components/Spinner'
import { useState } from 'react'

export default function Login() {
  // if(true) return <Spinner />
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleForm = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/login?username=${username}&password=${password}`)
      
      const resJson = await res.json()
      if(resJson.message && resJson.message === 'unauthorized') {
        setError('Invalid Username or password')
      }
  }
  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login izohli bot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.formWrap}>
          <h3>Enter username and password</h3>
            <form onSubmit={handleForm}>
                <label>Username
                  <input type='text' name='username' placeholder='Enter username' required onChange={e => setUsername(e.target.value)} />
                </label>
                <label>Password
                  <input type='password' name='password' placeholder='Enter password' required onChange={e => setPassword(e.target.value)} />
                </label>
                { error && <p className={styles.error}>{error}</p>}
                <button type='submit'>Login</button>
            </form>
        </div>
      </div>
    </div>
  )
}