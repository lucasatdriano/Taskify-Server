import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const List = sequelize.define(
    'TbLists',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
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
            type: DataTypes.INTEGER,
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
