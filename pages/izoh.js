import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Izoh.module.css'
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import AddModal from '../components/AddModal'
import EditModal from '../components/EditModal'
import AddWord from '../components/AddWord'
import Notification from '../components/Notification'
import EditWord from '../components/EditWord'

export default function Izoh() {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [limit, setLimit] = useState(50)
  const [page, setPage] = useState(1)
  const [words, setWords] = useState([])
  const [pageNumber, setPageNumber] = useState([1, 2, 3, 4, 5])
  const [buttons, setButtons] = useState([])
  const [wordId, setWordId] = useState('')
  const [word, setWord] = useState('')
  const [definition, setDefinition] = useState('')
  const [fulldefinition, setFullDefinition] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(false)
  const [notificationMsg, setNotificationMsg] = useState('')
  const [notificationType, setNotificationType] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/izoh?page=${(page - 1) * limit}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setWords(data)
        setLoading(false)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        setLoading(false)
      })
  } , [page, limit])

  useEffect(() => {
    fetch(`/api/buttons?limit=${limit}`)
    .then(res => res.json())
    .then(data => {
      setPageNumber(data)
    })
  }, [limit])

  useEffect(() => {
    setTimeout(() => {
      setNotification(false)
    }, 3000)
  } , [notification])

  const ShowPaginationNumbers = () => {
    let paginationNumbers = [];
        let showMax = 5;
        let endPage;
        let startPage;
    if (pageNumber.length > 0) {
        if (pageNumber <= showMax) {
            startPage = 1;
            endPage = pageNumber.length;
        }
        else {
            startPage = page > showMax ? page - showMax : 1;
            if (pageNumber.length - page < showMax) {
                endPage = pageNumber.length;
            } else {
                endPage = page + showMax;
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            paginationNumbers.push(i);
        }
        return setButtons(paginationNumbers)
      } 
  }

  useEffect(() => {
    ShowPaginationNumbers()
  }, [page])

  const searchWord = async (word) => {
    if(!word) {
      return fetch(`/api/izoh?page=${(page - 1) * limit}&limit=${limit}`)
        .then(res => res.json())
        .then(data => {
          setWords(data)
        }).catch(err => {
          console.log(err)
        })
    }
    const words = await fetch(`/api/izoh/search/${word}`)
    const wordsJson = await words.json()
    if(wordsJson.message === 'Not found') {
      setWords([])
      setNotification(true)
      setNotificationMsg('Word not found')
      setNotificationType('error')
    } else {
      setWords(wordsJson)
    }
  }

  const addWord = async (word, definition, fulldefinition) => {
    const res = await fetch('/api/addword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word,
        definition,
        fulldefinition
      })
    })
    const resJson = await res.json()
   if (resJson.id) {
      setAddModalOpen(false)
      setNotification(true)
      setNotificationMsg('Word added')
      setNotificationType('success')
      setWords([...words, { id: resJson.id, word, definition, fulldefinition}])
    } else {
      setNotification(true)
      setNotificationMsg(resJson.message)
      setNotificationType('error')
    }
  }

  const deleteWord = async (id) => {
    const res = await fetch(`/api/izoh/${id}`, {
      method: 'DELETE'
    })
    const resJson = await res.json()
    if(resJson.message === 'Deleted') {
      setWords(words.filter(word => word.id !== id))
      setNotification(true)
      setNotificationMsg('Word deleted')
      setNotificationType('success')
    }
  }
  const updateWord = async () => {
    const res = await fetch(`/api/izoh/${wordId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        word,
        definition,
        fulldefinition
      })
    })
    const resJson = await res.json()
    if(resJson.message === 'Row updated') {
      const updatedWord = {
        id: wordId,
        word: word,
        definition: definition,
        fulldefinition: fulldefinition
      }
      setWords(words.map(word => word.id === wordId ? updatedWord : word))
      setEditModalOpen(false)
      setNotification(true)
      setNotificationMsg('Word updated')
      setNotificationType('success')
    } else {
      setNotification(true)
      setNotificationMsg(resJson.message)
      setNotificationType('error')
    }
  }

  const handleAddOpen = () => {
    setAddModalOpen(true)
  }

  const handleEditOpen = (id, word, definition, fulldefinition) => {
    setWordId(id)
    setWord(word)
    setDefinition(definition)
    setFullDefinition(fulldefinition)
    setEditModalOpen(true)
  }

  if(loading) return <Spinner />
  return (
    <div>
      <Head>
        <title>Izohlar</title>
        <meta name="description" content="Izohlar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { notification && <Notification type={notificationType} message={notificationMsg} setNotification={setNotification} />}
      { addModalOpen && <AddModal setAddModalOpen={setAddModalOpen}> 
          <AddWord addWord={addWord} /> 
        </AddModal>
      }
      { editModalOpen && <EditModal setEditModalOpen={setEditModalOpen}> 
          <EditWord word={word} setWord={setWord} definition={definition} setDefinition={setDefinition} fulldefinition={fulldefinition} setFullDefinition={setFullDefinition} updateWord={updateWord} /> 
        </EditModal>
      }
      <main className={styles.main}>
        <div className={styles.search}>
          <input className={styles.input} type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value.trim())}
            onKeyDown={(e) => {
              if(e.key === 'Enter') {
                searchWord(search)
              }
            }
            }
          />
            <button
              className={styles.searchButton}
              onClick={() => searchWord(search)}
            >Search</button>
          <div className={styles.buttonWrap}>
            <select className={styles.select} onChange={(e) => setLimit(e.target.value)} defaultValue={limit}>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
                <option value="300">300</option>
                <option value="500">500</option>
            </select>
            <button className={styles.addBtn} onClick={handleAddOpen}>Add</button>
          </div>
        </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Word</th>
                <th>Definition</th>
                <th>Full definition</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {words.length > 0 ? words.map(word => (
                <tr key={word.id}>
                  <td>{word.id}</td>
                  <td>{word.word}</td>
                  <td>{word.definition}</td>
                  <td>{word.fulldefinition}</td>
                  <td>
                    <button className={styles.btn} onClick={() => handleEditOpen(word.id, word.word, word.definition, word.fulldefinition)}>
                      <Image src="/pencil-edit.svg" alt="Edit" width="20" height="20" />
                    </button>
                    <button className={styles.btn} onClick={() => deleteWord(word.id)}>
                      <Image src="/trash.svg" alt="Delete" width="20" height="20" color='green'  />
                    </button>
                  </td>
                </tr>
              )) : 
              <tr>
                <td className={styles.notFound} colSpan="5">No words found</td>
              </tr>
              }
            </tbody>
          </table>
      </main>
          { !search && limit && words.length <= limit ? 
            <div>
              <div className={styles.pages}>
              <p>{pageNumber.length} pages</p>
              </div>
              <div className={styles.pagination}>
                { page !== 1 && <button className={styles.btn}
                  onClick={() => {
                  setPage(1)
                  window.scrollTo(0, 0)
                  }}>First page</button>
                }
                <button className={styles.btn} onClick={() => setPage(page - 1)} disabled={page === 1}>
                  <Image src="/arrow-left.svg" alt="Previous" width="20" height="20" />
                </button>
                { buttons && buttons.map((button, i) => (
                  <button key={i} className={page == button ? styles.active : styles.btn}
                  onClick={() => {
                    setPage(button)
                    window.scrollTo(0, 0)
                  }
                  }>{button}</button>
                ))}
                <button className={styles.btn} onClick={() => setPage(page + 1)} disabled={page === buttons[buttons.length - 1]}>
                  <Image src="/arrow-right.svg" alt="Next" width="24" height="24" />
                </button>
                { page !== pageNumber.length &&
                  <button className={styles.btn}
                  onClick={() => {
                    setPage(pageNumber.length)
                    window.scrollTo(0, 0)
                    }}>Last page</button>
                }
              </div>
            </div>
          : null }
    </div>
  )
}
