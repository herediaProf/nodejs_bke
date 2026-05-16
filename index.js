require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDatabase = require('./src/config/database');

// Importação dos Controllers e Middlewares
const authController = require('./src/controllers/AuthController');
const taskController = require('./src/controllers/TaskController');
const verificarAcesso = require('./src/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURAÇÕES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');

// Inicializa conexão isolada do Banco
connectDatabase();

// --- ROTAS DE AUTENTICAÇÃO ---
app.get('/login', authController.renderLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);
app.get('/seed', authController.seed);

// --- ROTAS DE TAREFAS (PROTEGIDAS) ---
app.get('/dashboard', verificarAcesso, taskController.listarTarefas);
app.post('/add', verificarAcesso, taskController.adicionarTarefa);
app.post('/delete/:id', verificarAcesso, taskController.deletarTarefa);

// Só levanta a porta do servidor se NÃO estivermos em ambiente de testes
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 Servidor rodando lindamente em http://localhost:${PORT}`));
}

module.exports = app;