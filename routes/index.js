var express = require("express");

const path = require("path");
const dbPath = path.resolve(__dirname, "../db/my.db");
const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to the mydb database");
    }
});

// const dropQuery = `
//   DROP TABLE IF EXISTS member
// `;

// const insertQuery = `
//   CREATE TABLE IF NOT EXISTS member(
//     member_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     member_name VARCHAR(20),
//     member_serial_number INTEGER
//   )
// `;

// const dummyDataQuery = `
//     INSERT INTO member(member_name, member_serial_number) values ('장정인', 7)
// `;

// db.serialize(() => {
//     db.each(dropQuery);
//     db.each(insertQuery);
//     db.each(dummyDataQuery);
// });

var router = express.Router();

// 멤머 모든 목록 다 보내주는 api
router.get("/", (req, res) => {
    const query = `SELECT * FROM member`;
    db.serialize(
        db.all("SELECT * from member", (err, row) => {
            console.log(`${row[1].member_name}`);
            res.status(200).send(row);
        })
    );
});

// 원하는 기수의 멤버를 추가해주는 api
router.post("/", (req, res) => {
    const { member_name, member_serial_number } = req.body;
    const query = `INSERT INTO MEMBER(member_name, member_serial_number) values('${member_name}', ${member_serial_number})`;
    db.serialize();
    db.run(query, (err) => {
        if (err) {
            res.status(403).send({
                status: false,
                err: err,
            });
        } else {
            res.status(200).send({
                status: true,
            });
        }
    });
});

// 특정 기수의 동아리원들만 반환해주는 api
router.get("/member/:serial", (req, res) => {
    const serial = req.params.serial;
    console.log(serial);
    const query = `SELECT * FROM member where member_serial_number = ${serial}`;
    db.serialize();
    db.all(query, (err, rows) => {
        if (err) {
            res.status(403).send({
                status: false,
                err: err,
            });
        } else {
            res.status(200).send({
                status: true,
                result: rows,
            });
        }
    });
});

router.post("/member", (req, res) => {
    const { member_name, member_serial_number } = req.body;
});

// db.close((err) => {
//     if (err) {
//         console.error(err.message);
//     } else {
//         console.log("Closed the database connection");
//     }
// });

module.exports = router;
