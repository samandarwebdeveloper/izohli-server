const path = require('path')
const sqlite3 = require('sqlite3').verbose()
const dbpath = path.resolve(__dirname, './words.db')
const usersDBPath = path.resolve(__dirname, './users.db')
const db = new sqlite3.Database(dbpath)
const usersDB = new sqlite3.Database(usersDBPath)

module.exports = {
    getButtons: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM izohlar", (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    },
    getWords: (offset, limit) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM izohlar LIMIT ${limit} OFFSET ${offset}`, (err, words) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(words)
                }
            })
        })
    },
    getWord: function (id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM izohlar WHERE id = "${id}"`, (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    },
    searchWord: function (word) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM izohlar WHERE word LIKE "${word}%"`, (err, words) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(words)
                }
            })
        })
    },
    addWord: function (word, definition, fulldefinition) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM izohlar WHERE word = "${word}"`, (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    if (row) {
                        reject("Word already exists")
                    } else {
                        db.run(`INSERT INTO izohlar (word, definition, fulldefinition) VALUES ("${word}", "${definition}", "${fulldefinition}")`, function(err, row) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(this.lastID)
                            }
                        })
                    }
                }
            })
        })
    },
    deleteWord: (id) => {
        db.run(`DELETE FROM izohlar WHERE id = "${id}"`, (err) => {
            if (err) {
                console.log(err)
            }
        })
    },
    updateWord: (id, word, definition, fulldefinition) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM izohlar WHERE id = "${id}"`, (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    if (row) {
                        db.run(`UPDATE izohlar SET word = "${word}", definition = "${definition}", fulldefinition = "${fulldefinition}" WHERE id = ${id}`, function(err) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(this.changes)
                            }
                        })
                    } else {
                        reject("Word not found")
                    }
                }
            })
        })
    },
    getUsers: () => {
        return new Promise((resolve, reject) => {
            usersDB.all(`SELECT * FROM users`, (err, users) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(users)
                }
            })
        })
    }
}