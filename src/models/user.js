import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
    'tbUsers',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.fn('NOW'),
        },
    },
    {
        timestamps: true,
        updatedAt: false,
    },
);

export default User;
