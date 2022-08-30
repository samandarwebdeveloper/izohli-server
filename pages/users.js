import Head from 'next/head'
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

export default function Users() {
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    

useEffect(() => {
    fetch('/api/users')
        .then(res => res.json())
        .then(data => {
            setUsers(data)
            setLoading(false)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
  }, [])

  if(loading) return <Spinner />
  return (
    <div>
      <Head>
        <title>Users</title>
        <meta name="description" content="Izohli bot users" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="wrapper">
        <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ChatID</th>
                <th>Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map(user => 
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.chatId}</td>
                  <td>{user.name}</td>
                  <td><a className="link" href={`https://t.me/${user.userName}`} target="_blank">{user.userName}</a></td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
      <style jsx>{`
        .wrapper {
          width: 100%;
          text-align: center;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
        }


        .table thead {
          background-color: #f5f5f5;
          box-shadow: 1px 1px 1px #e7e7e7;
        }

        .table th,
        .table td {
          padding: 0.5rem;
          border-collapse: collapse;
          border-spacing: 0;
          border-bottom: 1px solid #e7e7e7;
          border-right: 1px solid #e7e7e7;
        }

        .table tbody tr:nth-child(even) {
          background-color: #f5f5f5;
        }

        .table tbody tr:hover {
          background-color: #e2e2e2;
        }
        .link {
          color: #0070f3;
          text-decoration: none;
          font-weight: bold;
        }

        @media (prefers-color-scheme: dark) {
          .table thead {
            background-color: #1d1e29;
            box-shadow: 1px 1px 1px #444;
          }
          .table th,
          .table td {
            border-bottom: 1px solid #222;
            border-right: 1px solid #2b2b2b;
          }
          .table tbody tr:nth-child(even) {
            background-color: #1c222e;
          }
          
          .table tbody tr:hover {
            background-color: #0e1a30;
          }
        }
      `}</style>
    </div>
  );
}

