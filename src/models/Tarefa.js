const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
    descricao: { type: String, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Tarefa', tarefaSchema);