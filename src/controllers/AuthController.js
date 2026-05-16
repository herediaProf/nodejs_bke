const User = require('../models/User');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'chave_mestra_123';

exports.renderLogin = (req, res) => {
    res.render('login', { erro: null });
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (user) {
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

        return res.format({
            html: () => res.redirect('/dashboard'),
            json: () => res.json({ token })
        });
    }

    res.render('login', { erro: 'Usuário ou senha inválidos!' });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};

exports.seed = async (req, res) => {
    await User.deleteMany({});
    await User.create([
        { username: 'admin', password: '123', role: 'admin' },
        { username: 'aluno', password: '123', role: 'user' }
    ]);
    res.send("✅ Banco resetado! Admin e Aluno criados.");
};