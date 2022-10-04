var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE pics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url text, 
            texts text 
            )`,(err) => {
        if (err) {
            // Table already created
        }else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO pics (url, texts) VALUES (?,?)'
            db.run(insert, ["sample/url","sample texts"])
        }
    })  
    }
})


module.exports = db
