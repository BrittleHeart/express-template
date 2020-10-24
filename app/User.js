import Sequelize from 'sequelize'
import connection from '../database/config'

const Users = connection.define('users', {
    userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false,
        min: 4,
        max: 10,
        defaultValue: 'Anonim'
    },

    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        min: 5,
        max: 255
    },

    password: {
        type: Sequelize.STRING,
        min: 3,
        max: 255,
        allowNull: false
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },

    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    },

    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
})

export default Users
