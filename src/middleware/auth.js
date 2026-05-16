const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'chave_mestra_123';

const verificarAcesso = (req, res, next) => {
    const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

    if (!token) {
        return res.format({
            html: () => res.redirect('/login'),
            json: () => res.status(401).json({ msg: "Acesso negado: Sem token!" })
        });
    }

    try {
        const decodificado = jwt.verify(token, SECRET_KEY);
        req.user = decodificado; // Disponibiliza os dados do usuário para o Controller
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = verificarAcesso;