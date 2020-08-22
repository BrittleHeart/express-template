import jsonwebtoken from 'jsonwebtoken'
import {logger} from '../../server'

export const verifyJWTToken = (req, res, next) => {
    const accessTokenHeader = req.header('Authorization')

    console.log(accessTokenHeader)

    if(!accessTokenHeader)
        return res.status(401).json({status: 401, message: 'No authorization token provided'})
    
    jsonwebtoken.verify(accessTokenHeader, process.env.JSONWEBTOKEN_PRIVATE, error => {
        if(error) {
            logger.log('error', 'Tokens are not the same!')
            return res.status(403).json({status: 403, message: 'Tokens are not the same'})
        }

        next()
    })
}
