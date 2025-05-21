const jwt = require('jsonwebtoken');
const { registerUserInDatabase, loginUser } = require('../services/authService');


async function register(req, res) {
  const {fullname ,  email, password } = req.body;
  const success = await registerUserInDatabase(fullname , email, password);
  if (!success) {
    return res.status(400).json({ message: 'Email đã tồn tại' });
  }
  return res.json({ message: 'Tạo tài khoản thành công' });
}

async function login(req, res) {
  const { email, password } = req.body;
  const token = await loginUser(email, password);
  if (!token) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  res.json({ token });
}

module.exports = { register, login };
