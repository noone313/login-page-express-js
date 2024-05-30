const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('', '', '', {
    host: 'localhost',
    dialect: 'postgres',
});

const User = sequelize.define('User', {
    uid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uemail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    upass: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    utype: {
        type: DataTypes.ENUM('admin', 'teacher', 'student'),
        allowNull: false,
    },
    ustate: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch(err => console.log('Error:', err));

module.exports = {
    sequelize,
    User,
};
