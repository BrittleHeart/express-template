import express from 'express'
import bodyParser from 'body-parser'
import connection from './database/config'
import nodemailer from 'nodemailer'
import morgan from 'morgan'
import helmet from 'helmet'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
import winston from 'winston'
import * as fs from 'fs'
import * as path from 'path'
import {config as loggingConfig} from './config/logging'
import {config as mailConfig} from './config/mail'

dotenv.config()

const app = express()
const upload = multer({storage: './storage/images'})
const mailer = nodemailer.createTransport(mailConfig)
const logger = winston.createLogger(loggingConfig)

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

 
 const PORT = process.env.PORT || process.env.SERVER_PORT

if(process.env.PROJECT_MODE === 'production') 
    app.listen(PORT)
else if(process.env.PROJECT_MODE === 'development')
    app.listen(PORT, () => console.log(`Server has been exposed here -> http://localhost:${PORT} - ${process.memoryUsage().heapUsed / Math.pow(1024, 2)} MB memory usage`))

export {app, upload, logger, mailer}