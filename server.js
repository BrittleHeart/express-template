import express, { Router } from 'express'
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
const router = Router()
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

connection.authenticate()
    .then(() => console.log('Everything is okey'))
    .catch(error => logger.log('error', `Invalid credencials ${error}`))

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

/**
 * ========================================================
 * 
 *                      LOADING ROUTES
 * 
 * ========================================================
 */

 fs.readdir(path.resolve('./routes'), (error, files) => {
     if(error) {
         logger.log('error', `This directory does not exist ${error.stack}`)
         throw new Error(`This directory does not exist ${error.stack}`)
     }

     if(!files) {
        logger.log('warn', 'Directory is empty')
        throw new Error('Directory is empty')
     }

     files.forEach(file => require(`./routes/${file}`))
 })

if(process.env.PROJECT_MODE === 'production') 
    app.listen(PORT)
else if(process.env.PROJECT_MODE === 'development')
    app.listen(PORT, () => console.log(`Server has been exposed here -> http://localhost:${PORT}`))

export {upload, router, logger, mailer}