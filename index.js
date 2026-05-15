const express = require('express');
const mongoose = require('mongoose'); // 1. Importações primeiro
const app = express();

// --- 2. CONEXÃO COM O BANCO DE DADOS ---
// Deve vir cedo para garantir que o banco esteja pronto antes das requisições
mongoose.connect('mongodb://127.0.0.1:27017/meuAppDemo')
  .then(() => console.log("✅ Conectado ao MongoDB!"))
  .catch(err => console.error("❌ Erro ao conectar:", err));

// --- 3. DEFINIÇÃO DO MODELO (SCHEMA) ---
// O modelo define a estrutura dos dados que o banco vai aceitar
const tarefaSchema = new mongoose.Schema({
    descricao: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now }
});
const Tarefa = mongoose.model('Tarefa', tarefaSchema);

// --- 4. CONFIGURAÇÕES E MIDDLEWARES ---
// Preparam o Express para entender dados e arquivos
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 

// --- 5. ROTAS ---
// Onde a lógica do app acontece. Note o uso de 'async/await' para o banco.

// Rota Principal: Busca no banco e renderiza
app.get('/', async (req, res) => {
    try {
        const tarefasDoBanco = await Tarefa.find().sort({ criadoEm: -1 }); // Busca todos
        res.render('index', { lista: tarefasDoBanco });
    } catch (err) {
        res.status(500).send("Erro ao buscar tarefas");
    }
});

// Rota de Adição: Salva no banco e redireciona
app.post('/add', async (req, res) => {
    try {
        const novaTarefa = new Tarefa({ 
            descricao: req.body.tarefa 
        });
        await novaTarefa.save(); // Salva efetivamente no MongoDB
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Erro ao salvar tarefa");
    }
});

// Rota para Deletar tarefa
app.post('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Tarefa.findByIdAndDelete(id);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Erro ao deletar tarefa");
    }
});

// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
// Sempre a última coisa: abre a porta para o mundo
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Demo rodando em http://localhost:${PORT}`);
});