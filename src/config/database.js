const mongoose = require('mongoose');

const connectDatabase = () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aula_bke';
    
    mongoose.connect(MONGO_URI)
        .then(() => console.log("✅ Conectado ao MongoDB (via Docker)"))
        .catch(err => console.error("❌ Falha na conexão com o banco:", err));
};

module.exports = connectDatabase;