import {Sequelize} from 'sequelize'

/** 
 * FOR SQLITE
 */
const connection = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
})

/** 
 * FOR MYSQL
 */
const connection = new Sequelize('database', 'user', 'password', {
    host: 'host',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
})

export default connection