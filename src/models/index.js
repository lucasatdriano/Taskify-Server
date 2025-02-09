import sequelize from '../config/db.js';
import initUser from './user.js';
import initUserLists from './usersLists.js';
import initList from './list.js';
import initTask from './task.js';

const models = {
    User: initUser(sequelize),
    UserLists: initUserLists(sequelize),
    List: initList(sequelize),
    Task: initTask(sequelize),
};

models.List.associate = (models) => {
    models.List.belongsTo(models.User, { foreignKey: 'userId' });
    models.List.hasMany(models.UserLists, {
        foreignKey: 'listId',
        as: 'UserLists',
    });
};

models.Task.associate = (models) => {
    models.Task.belongsTo(models.List, { foreignKey: 'listId' });
};

models.User.associate = (models) => {
    models.User.hasMany(models.List, { foreignKey: 'userId', as: 'lists' });
    models.User.belongsToMany(models.List, {
        through: models.UserLists,
        foreignKey: 'userId',
        otherKey: 'listId',
        as: 'collaborations',
    });
};

models.UserLists.associate = (models) => {
    models.UserLists.belongsTo(models.User, { foreignKey: 'userId' });
    models.UserLists.belongsTo(models.List, { foreignKey: 'listId' });
};

Object.values(models).forEach((model) => {
    if (model.associate) {
        console.log(`Definindo associações para o modelo ${model.name}`);
        model.associate(models);
    }
});

export { sequelize, models };
