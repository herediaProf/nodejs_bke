const request = require('supertest');
const app = require('../../index'); // Importa o nosso servidor express
const jwt = require('jsonwebtoken');
const Tarefa = require('../models/Tarefa'); // Importa o modelo para simular o banco

// Simula o comportamento do Mongoose para não poluir o banco real do Docker durante o teste
jest.mock('../models/Tarefa');

describe('🧪 Testes de Integração - TaskController', () => {
    let tokenFake;
    const SECRET_KEY = process.env.JWT_SECRET || 'chave_mestra_123';

    beforeAll(() => {
        // Cria um token JWT falso simulando o usuário 'aluno' logado
        tokenFake = jwt.sign({ id: '60d000000000000000000001', username: 'aluno', role: 'user' }, SECRET_KEY);
    });

    afterEach(() => {
        jest.clearAllMocks(); // Limpa os históricos de simulação entre um teste e outro
    });

    it('Deve carregar a dashboard com a lista de tarefas do usuário logado', async () => {
        // Simula que o MongoDB retornou um array com uma tarefa fixa
        Tarefa.find.mockResolvedValue([{ _id: '123', descricao: 'Estudar TDD', usuarioId: '60d000000000000000000001' }]);

        const response = await request(app)
            .get('/dashboard')
            .set('Cookie', [`token=${tokenFake}`]); // Injeta o cookie de autenticação

        expect(response.status).toBe(200);
        expect(response.text).toContain('Estudar TDD'); // Garante que a tarefa foi renderizada no HTML
    });

    it('Deve barrar o acesso à dashboard se o usuário não enviar o token', async () => {
        const response = await request(app)
            .get('/dashboard'); // Requisição sem cookies ou headers

        // Como nossa aplicação redireciona para o login quando falha, o status esperado é 302 (Redirect)
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });

    it('Deve criar uma nova tarefa com sucesso e redirecionar para a dashboard', async () => {
        // Simula que a criação no banco ocorreu com sucesso
        Tarefa.create.mockResolvedValue({ descricao: 'Nova Tarefa via TDD', usuarioId: '60d000000000000000000001' });

        const response = await request(app)
            .post('/add')
            .set('Cookie', [`token=${tokenFake}`])
            .send({ tarefa: 'Nova Tarefa via TDD' }); // Envia o dado do formulário

        expect(response.status).toBe(302); // Redirecionamento após o cadastro
        expect(Tarefa.create).toHaveBeenCalled(); // Valida se a função do banco foi chamada
    });
});