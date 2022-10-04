var express = require("express")
var app = express()
var db = require("./database.js")


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 80

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/allPics", (req, res, next) => {
    var sql = "select * from pics"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(rows)
      });
});


app.get("/api/pics/:id", (req, res, next) => {
    var sql = "select * from pics where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json(row)
      });
});


app.post("/api/pics/", (req, res, next) => {
    var errors=[]
    if (!req.body.texts){
        errors.push("No texts specified");
    }
    if (!req.body.url){
        errors.push("No url specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        url: req.body.url,
        texts: req.body.texts
    }
    var sql ='INSERT INTO pics (url, texts) VALUES (?,?)'
    var params =[data.url, data.texts]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "data": data,
            "id" : this.lastID
        })
    });
})



app.patch("/api/pics/:id", (req, res, next) => {
    var data = {
        url: req.body.url,
        texts: req.body.texts
    }
    db.run(
        `UPDATE pics set 
           url = coalesce(?,url), 
           texts = COALESCE(?,texts)
           WHERE id = ?`,
        [data.url, data.texts, req.params.id],
        (err, result) => {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                data: data,
                changes: this.changes
            })
    });
})


app.delete("/api/pics/:id", (req, res, next) => {
    db.run(
        'DELETE FROM pics WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({rows: this.changes})
    });
})


// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
