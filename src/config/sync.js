import sequelize from './db.js';

const syncDatabase = async () => {
    try {
        await sequelize
            .sync({ force: false })
            .then(() => {
                console.log('Modelos sincronizados com sucesso.');
            })
            .catch((err) => {
                console.error('Erro ao sincronizar os modelos:', err);
            });
        console.log('Banco de dados sincronizado!');
    } catch (err) {
        console.error('Erro ao sincronizar o banco de dados:', err);
    }
};

export default syncDatabase;
