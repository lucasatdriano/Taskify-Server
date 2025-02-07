import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.js';

const UserLists = sequelize.define(
    'tbUserLists',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: uuidv4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'tbUsers',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        listId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'tbLists',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        fixed: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    },
);

UserLists.associate = (models) => {
    UserLists.belongsTo(models.User, { foreignKey: 'userId' });
    UserLists.belongsTo(models.List, { foreignKey: 'listId' });
};

export default UserLists;
