import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db.js';

export default (sequelize) => {
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
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            timestamps: false,
        },
    );

    return UserLists;
};
