import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default (sequelize) => {
    const List = sequelize.define(
        'TbLists',
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
            timestamps: false,
        },
    );

    return List;
};
