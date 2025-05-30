const express = require('express');
const router = express.Router();
const db = require('../database/db_connect');

// 1. 입차 API
router.post('/entry', async (req, res) => {
  const { member_id } = req.body;
  const entry_time = new Date();
  try {
    const sql = `
      INSERT INTO parking_history (member_id, entry_time, exit_time)
      VALUES (?, ?, ?)`;
    await db.query(sql, [member_id, entry_time, entry_time]); // 임시로 exit_time은 entry_time으로 설정
    res.status(200).json({ message: '입차 완료', entry_time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '입차 처리 실패' });
  }
});

// 2. 출차 및 요금 처리 API
router.post('/exit', async (req, res) => {
  const { member_id } = req.body;
  const exit_time = new Date();
  try {
    // 1. 가장 최근의 미출차 이력 조회
    const [rows] = await db.query(
      `SELECT * FROM parking_history WHERE member_id = ? AND entry_time = exit_time ORDER BY entry_time DESC LIMIT 1`,
      [member_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '입차 기록이 없습니다.' });
    }

    const history = rows[0];
    const entry_time = new Date(history.entry_time);

    // 2. 요금 계산: 기본요금 + 초과 시간당 요금
    const [[feeConfig]] = await db.query(`SELECT * FROM fee LIMIT 1`);
    const { base_time, base_fee, unit_time, unit_fee } = feeConfig;

    const durationMin = Math.ceil((exit_time - entry_time) / 60000);
    let total_fee = base_fee;

    if (durationMin > base_time) {
      const extra = durationMin - base_time;
      const units = Math.ceil(extra / unit_time);
      total_fee += units * unit_fee;
    }

    // 3. 출차 처리
    await db.query(
      `UPDATE parking_history SET exit_time = ?, fee = ? WHERE id = ?`,
      [exit_time, total_fee, history.id]
    );

    // 4. 캐시 차감
    await db.query(
      `UPDATE cash SET balance = balance - ? WHERE member_id = ?`,
      [total_fee, member_id]
    );

    res.status(200).json({ message: '출차 완료', fee: total_fee, durationMin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '출차 처리 실패' });
  }
});

// 3. 캐시 충전 API
router.post('/cash', async (req, res) => {
  const { member_id, amount } = req.body;
  try {
    const [exist] = await db.query(
      `SELECT * FROM cash WHERE member_id = ?`,
      [member_id]
    );

    if (exist.length === 0) {
      await db.query(
        `INSERT INTO cash (member_id, balance) VALUES (?, ?)`,
        [member_id, amount]
      );
    } else {
      await db.query(
        `UPDATE cash SET balance = balance + ? WHERE member_id = ?`,
        [amount, member_id]
      );
    }

    res.status(200).json({ message: '캐시 충전 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '캐시 충전 실패' });
  }
});

module.exports = router;
