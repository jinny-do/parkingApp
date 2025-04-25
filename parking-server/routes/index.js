var express = require('express');
var router = express.Router();

const db = require('../database/db_connect');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/parking/test', function (req, res, next) {
    db.query('select * from user', (err, rows, fields) => {
        if (!err) {
            console.log('/test / rows = ' + JSON.stringify(rows));
            res.json([{ code: 0, data: rows }]);
        } else {
            console.log('test / err =' + err);
            res.json([{ code: 1, data: err }]);
        }
    });
});

//로그인
router.post('/parking/login', function (req, res, next) {
    console.log('login / req.body = ' + JSON.stringify(req.body));

    let userEmail = req.body.email;
    let userPw = req.body.passwd;

    let queryStr = `SELECT * FROM user WHERE email = "${userEmail}" AND passwd="${userPw}" `;
    console.log('login / queryStr = ' + queryStr);
    db.query(queryStr, (err, rows, fields) => {
        if (!err) {
            console.log('login / rows = ' + JSON.stringify(rows));

            let len = Object.keys(rows).length;
            console.log('login / length = ', len);

            let code = len == 0 ? 1 : 0;
            let message = len == 0 ? '아이디 또는 비밀번호가 잘못 입력되었습니다 ' : '로그인 성공';

            res.json([{ code: code, message: message }]);
        } else {
            console.log('login /err = ' + err);

            res.json([{ code: 1, message: err }]);
        }
    });
});

//회원가입
router.post('/parking/register', function (req, res) {
    console.log('register / req.body =', req.body);

    const userName = req.body.name;
    const userCarNum = req.body.car_num;
    const userEmail = req.body.email;
    const userPw = req.body.passwd;

    console.log(`register / userEmail = ${userEmail}, userPw = ${userPw}`);

    // 필수 입력값 체크
    if (!(userEmail && userPw && userCarNum && userName)) {
        res.json([{ code: 1, message: '빠진 곳 없이 작성해 주세요' }]);
        return;
    }

    const queryStr = `
      INSERT INTO user (name, email, passwd, car_num)
      VALUES (?, ?, ?, ?)
  `;
    const values = [userName, userEmail, userPw, userCarNum];

    db.query(queryStr, values, function (err, rows, fields) {
        if (!err) {
            console.log('register / rows =', rows);
            res.json([{ code: 0, message: '회원가입이 완료되었습니다' }]);
        } else {
            console.error('register / error =', err);

            if (err.code === 'ER_DUP_ENTRY') {
                res.json([{ code: 2, message: '이미 등록된 이메일입니다.' }]);
            } else {
                res.json([{ code: 3, message: '알 수 없는 오류가 발생하였습니다.', data: err }]);
            }
        }
    });
});

//이메일 중복 확인 
router.post('/parking/register/duplex', (req, res) => {
    const { email } = req.body;
    const sql = 'SELECT id FROM user WHERE email = ?';

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('중복 체크 쿼리 에러:', err);
            res.status(500).json({ result: 'error', message: 'DB 오류 발생' });
        } else if (result.length === 0) {
            res.json({ result: 'ok', message: `${email}은 사용 가능합니다.` });
        } else {
            res.json({ result: 'fail', message: `${email}은 이미 사용 중입니다.` });
        }
    });
});

module.exports = router;
