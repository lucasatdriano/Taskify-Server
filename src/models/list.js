import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.js';

const List = sequelize.define(
    'TbLists',
    {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuidv4 },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
        daily: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        collaboratorsEmails: {
            type: DataTypes.TEXT,
            allowNull: true,
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
    },
    {
        timestamps: true,
        updatedAt: false,
    },
);

List.associate = (models) => {
    List.belongsTo(models.User, { foreignKey: 'userId' });
};

export default List;
