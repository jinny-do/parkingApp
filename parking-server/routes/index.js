var express = require('express');
var router = express.Router();

const db = require('../database/db_connect').promise(); // mysql2 promise 인터페이스 사용

const parkingRoutes = require('./routes/parking');
app.use('/parking', parkingRoutes);


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/parking/test', async function (req, res, next) {
    try {
        const [rows] = await db.query('select * from user');
        console.log('/test / rows = ' + JSON.stringify(rows));
        res.json([{ code: 0, data: rows }]);
    } catch (err) {
        console.log('test / err =' + err);
        res.json([{ code: 1, data: err }]);
    }
});

// 로그인
router.post('/parking/login', async (req, res) => {
    const { email, passwd } = req.body;

    try {
        const [rows] = await db.query(`SELECT * FROM user WHERE email = ? AND passwd = ?`, [email, passwd]);
        if (rows.length === 0) {
            return res.json({ code: 1, message: '아이디 또는 비밀번호가 잘못 입력되었습니다' });
        }
        res.json({ code: 0, message: '로그인 성공', user: rows[0] });
    } catch (err) {
        console.error('login / err =', err);
        return res.status(500).json({ code: 1, message: '서버 에러' });
    }
});

// 회원가입
router.post('/parking/register', async function (req, res) {
    console.log('register / req.body =', req.body);

    const userName = req.body.name;
    const userCarNum = req.body.car_num;
    const userEmail = req.body.email;
    const userPw = req.body.passwd;

    console.log(`register / userEmail = ${userEmail}, userPw = ${userPw}`);

    if (!(userEmail && userPw && userCarNum && userName)) {
        return res.json([{ code: 1, message: '빠진 곳 없이 작성해 주세요' }]);
    }

    const queryStr = `
      INSERT INTO user (name, email, passwd, car_num)
      VALUES (?, ?, ?, ?)
  `;
    const values = [userName, userEmail, userPw, userCarNum];

    try {
        const [rows] = await db.query(queryStr, values);
        console.log('register / rows =', rows);
        res.json([{ code: 0, message: '회원가입이 완료되었습니다' }]);
    } catch (err) {
        console.error('register / error =', err);
        if (err.code === 'ER_DUP_ENTRY') {
            res.json([{ code: 2, message: '이미 등록된 이메일입니다.' }]);
        } else {
            res.json([{ code: 3, message: '알 수 없는 오류가 발생하였습니다.', data: err }]);
        }
    }
});

// 이메일 중복 확인 
router.post('/parking/register/duplex', async (req, res) => {
    const { email } = req.body;
    const sql = 'SELECT id FROM user WHERE email = ?';

    try {
        const [result] = await db.query(sql, [email]);
        if (result.length === 0) {
            res.json({ result: 'ok', message: `${email}은 사용 가능합니다.` });
        } else {
            res.json({ result: 'fail', message: `${email}은 이미 사용 중입니다.` });
        }
    } catch (err) {
        console.error('중복 체크 쿼리 에러:', err);
        res.status(500).json({ result: 'error', message: 'DB 오류 발생' });
    }
});

/**
 * 입차 시간 기록
 */
router.post('/parking/entry', async (req, res) => {
    const { car_num } = req.body;
    if (!car_num) {
        return res.status(400).json({ code: 1, message: '차량 번호가 필요합니다.' });
    }

    try {
        // 회원 조회
        const [userRows] = await db.query('SELECT id FROM user WHERE car_num = ?', [car_num]);
        if (userRows.length === 0) {
            return res.status(404).json({ code: 1, message: '등록된 차량 번호가 아닙니다.' });
        }
        const memberId = userRows[0].id;

        // 입차 기록 추가
        const [result] = await db.query(
            `INSERT INTO parking_history (member_id, entry_time, exit_time, fee) VALUES (?, NOW(), NULL, 0)`,
            [memberId]
        );

        res.json({ code: 0, message: '입차가 기록되었습니다.', parking_history_id: result.insertId });
    } catch (err) {
        console.error('입차 처리 에러:', err);
        res.status(500).json({ code: 1, message: '서버 오류' });
    }
});

/**
 * 출차 시간 기록, 요금 계산, 캐시 차감 (트랜잭션 적용)
 */
router.post('/parking/exit', async (req, res) => {
    const { car_num } = req.body;
    if (!car_num) {
        return res.status(400).json({ code: 1, message: '차량 번호가 필요합니다.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1) 회원 조회
        const [userRows] = await connection.query('SELECT id FROM user WHERE car_num = ?', [car_num]);
        if (userRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ code: 1, message: '등록된 차량 번호가 아닙니다.' });
        }
        const memberId = userRows[0].id;

        // 2) 출차 안된 가장 최근 입차 내역 조회
        const [historyRows] = await connection.query(
            `SELECT * FROM parking_history WHERE member_id = ? AND exit_time IS NULL ORDER BY entry_time DESC LIMIT 1`,
            [memberId]
        );
        if (historyRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ code: 1, message: '출차할 입차 기록이 없습니다.' });
        }
        const parkingHistory = historyRows[0];

        // 3) 요금 정책 조회
        const [feeRows] = await connection.query('SELECT * FROM fee WHERE id = 1 LIMIT 1');
        if (feeRows.length === 0) {
            await connection.rollback();
            return res.status(500).json({ code: 1, message: '요금 정책 조회 실패' });
        }
        const feePolicy = feeRows[0];

        // 4) 시간 계산
        const entryTime = parkingHistory.entry_time;
        const exitTime = new Date();
        const diffMs = exitTime - entryTime;
        const diffMin = Math.ceil(diffMs / (1000 * 60));

        // 5) 요금 계산
        let fee = 0;
        if (diffMin <= feePolicy.base_time) {
            fee = feePolicy.base_fee;
        } else {
            const extraTime = diffMin - feePolicy.base_time;
            const units = Math.ceil(extraTime / feePolicy.unit_time);
            fee = feePolicy.base_fee + units * feePolicy.unit_fee;
        }

        // 6) 캐시 잔액 확인
        const [cashRows] = await connection.query('SELECT balance FROM cash WHERE member_id = ?', [memberId]);
        if (cashRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ code: 1, message: '캐시 계정이 없습니다.' });
        }
        const balance = cashRows[0].balance;
        if (balance < fee) {
            await connection.rollback();
            return res.status(400).json({ code: 1, message: `캐시 잔액이 부족합니다. 요금: ${fee}원, 잔액: ${balance}원` });
        }

        // 7) 출차 내역 업데이트 및 캐시 차감
        const exitTimeStr = exitTime.toISOString().slice(0, 19).replace('T', ' ');
        await connection.query(
            'UPDATE parking_history SET exit_time = ?, fee = ? WHERE id = ?',
            [exitTimeStr, fee, parkingHistory.id]
        );
        await connection.query(
            'UPDATE cash SET balance = balance - ? WHERE member_id = ?',
            [fee, memberId]
        );

        await connection.commit();

        res.json({ code: 0, message: '출차가 완료되었습니다.', fee });
    } catch (err) {
        await connection.rollback();
        console.error('출차 처리 에러:', err);
        res.status(500).json({ code: 1, message: '서버 오류' });
    } finally {
        connection.release();
    }
});

module.exports = router;
