import jsonwebtoken from 'jsonwebtoken'
import UtilController from './UtilController'
import User from '../User'
import bcrypt from 'bcrypt'
import {logger} from '../../server'

const utils = new UtilController()

class AuthenticationController {
    async authenticate(req, res) {
        const {email, password} = req.body

        const escapedMail = escape(email)
        const escapedPassword = escape(password)

        if(!escapedMail || !escapedPassword)
            return res.status(400).json({status: 400, message: 'All values must be set'})
        
        if(!utils.checkMail(escapedMail))
            return res.status(400).json({status: 400, message: 'Please enter valid email address'})

        const user = await User.findOne({where: {email: escapedMail}})

        if(!user)
            return res.status(200).json({status: 200, message: `Could not find user with email = ${escapedMail}`})

        bcrypt.compare(escapedPassword, user.password, async (error, match) => {
            if(error) {
                logger.log('error', 'Could not compare password')
                return await res.status(500).json({status: 500, message: 'Could not compare passwords'})
            }

            if(match && escapedMail === user.email) {
                const token = jsonwebtoken.sign({name: user.name}, process.env.JSONWEBTOKEN_PRIVATE, {expiresIn: '2 days'})

                logger.log('info', 'Token has been granted')
                return await res.status(200).json({status: 200, access_token: token})
            } else {
                logger.log('error', 'Passwords are not the same')
                return await res.status(200).json({status: 200, message: 'Passwords are not the same'})
            }
        })
    }
}

export default AuthenticationController