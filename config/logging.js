import winston, {format} from 'winston'
const {combine, timestamp, label, printf} = format

const myFormat = printf(({ level, message, label, timestamp }) => 
    `${timestamp} - [${label}] ${level}: ${message}`
)

export const config = {
    level: 'info',
    defaultMeta: 'user-service',
    format: combine(
        label({ label: 'Right now!' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({filename: 'error.log', dirname: 'storage/logs', level: 'error'}),
        new winston.transports.File({filename: 'info.log', dirname: 'storage/logs', level: 'info'})
    ]
}