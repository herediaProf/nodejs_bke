const Tarefa = require('../models/Tarefa');

exports.listarTarefas = async (req, res) => {
    try {
        const tarefasDoBanco = await Tarefa.find({ usuarioId: req.user.id });
        res.render('dashboard', { usuario: req.user, lista: tarefasDoBanco });
    } catch (err) {
        res.status(500).send("Erro ao carregar tarefas: " + err.message);
    }
};

exports.adicionarTarefa = async (req, res) => {
    try {
        const { tarefa } = req.body;
        await Tarefa.create({
            descricao: tarefa,
            usuarioId: req.user.id
        });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).send("Erro ao adicionar tarefa: " + err.message);
    }
};

exports.deletarTarefa = async (req, res) => {
    try {
        await Tarefa.deleteOne({ _id: req.params.id, usuarioId: req.user.id });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).send("Erro ao deletar tarefa: " + err.message);
    }
};