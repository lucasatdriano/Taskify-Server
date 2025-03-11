import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
    const Task = sequelize.define(
        'tbTasks',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: uuidv4,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            priority: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
                validate: {
                    isIn: [['baixa', 'media', 'alta', null]],
                },
            },
            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW'),
            },
            dueDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            notification: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            important: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            file: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
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
            timestamps: false,
        },
    );

    return Task;
};
