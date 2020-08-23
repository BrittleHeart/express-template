# Hello everyone

## Introduction
It's so amazing that I can introduce you my express template.

Everything what has been build here, used to be your manager. For what?
thats simple, when you are using thins template, you can build your 
next great idea so much faster!

## How to start
First of all please make sure, that u've installed all of dependencies. To do that just type

```bash
npm install
```

After this action, please build your nodejs server file with webpack

You can do it as follow

```bash
npm run build
```

This command will build your project for production purpose. If u need to build your file for development environment
just use

```bash
npm run watch
```

ENJOY! You can now run application with

```bash
npm run dev
```

To use nodemon, or

```bash
npm start
```

## Database connection

To connect to your database you need to change the **database/config.example.js** -> **database/config.js**, and select preferred by yourself dialect.

You can choose from ***sqlite***, ***mysql***, ***postgressql***, or ***mariadb***

## Core Dependecies
- [Express](https://expressjs.com/)
- [Cors](https://www.npmjs.com/package/cors)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Sequelize](https://sequelize.org/)
- [MySQL](https://www.npmjs.com/package/mysql2)

## Why it's so simple?

Because of express framework, which allows you, to create whole 
server and so on. Here is my config:

````javascript
import express from 'express'
import bodyParser from 'body-parser'
import connection from './database/config'
import nodemailer from 'nodemailer'
import morgan from 'morgan'
import winston from 'winston'
import helmet from 'helmet'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config()
const app = express()
const upload = multer({storage: './storage/images'})
const logger = winston.createLogger(
    {
        level: 'info',
        defaultMeta: 'user-service',
        format: winston.format.json(),
        transports: [
            new winston.transports.File({filename: 'error.log', dirname: 'storage/logs', level: 'error'}),
            new winston.transports.File({filename: 'info.log', dirname: 'storage/logs'})
        ]
    }
)

const PORT = process.env.PORT || process.env.SERVER_PORT
const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, 
      pass: process.env.SMTP_PASSWORD
    },
})

/**
 * ========================================================
 * 
 *                      MIDDLEWARES
 * 
 * ========================================================
 */
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(helmet(
    {
        frameguard: true, 
        noSniff: true, 
        xssFilter: true, 
        hidePoweredBy: true,
        permittedCrossDomainPolicies: true
    }
))
app.use(cors())
app.use(morgan('dev'))

connection.authenticate()
    .catch(error => logger.log('error', `Invalid credencials ${error}`))

/**
 * ========================================================
 * 
 *                      LOADING ROUTES
 * 
 * ========================================================
 */

 fs.readdir(path.resolve('./routes'), (error, files) => {
     if(error)
         logger.log('error', `This directory does not exist ${error.stack}`)

     if(files.length < 1)
        logger.log('warn', 'Directory is empty')

     files.forEach(file => require(`./routes/${file}`))
 })

if(process.env.PROJECT_MODE === 'production') 
    app.listen(PORT)
else if(process.env.PROJECT_MODE === 'development')
    app.listen(PORT, () => console.log(`Server has been exposed here -> http://localhost:${PORT}`))

export {app, upload, logger, mailer}
````
The module called cors can be using for example axios, when you are
fatching data here's an example:

````javascript

axios.get("http://someDomain.xyz/abc")
    .then(result => {
        array = result.data
    })
    .catch(error => {
       errorArray = error
    });

````

## How to handle routes?
It is preety straight forward! The only thing which you have to do, to add really new route
is to write something like that

```javascript

app.[http action]('name', (req, res) => /* Do some stuff */)

// Where [http action] -> [get, post, delete, update]

```

## Visit me
You can text me if you want to contribute this project

[Facebook](https://www.facebook.com/bartosz.pazdur.1)

[Twitter](https://www.twitter.com/BartoszPazdur)

[Github](https://www.github.com/BrittleHeart)

[Gitlab](https://www.gitlab.com/BrittleHeart)

# Thank you! 😎
