import jsonwebtoken from 'jsonwebtoken'
import User from '../User'
import bcrypt from 'bcrypt'
import {logger} from '../../server'
const yup = require('yup')

class AuthenticationController {
    async authenticate(req, res) {
        const {email, password} = req.body

        const schema = yup.object().shape({
            email: yup.string().min(7).max(255).email().required(),
            password: yup.string().min(10).max(255).required()
        })

        try {await schema.validate({email, password})}
        catch(error) {return res.status(400).json({message: error.message})}

        const escapedMail = escape(email)

        const user = await User.findOne({where: {email: escapedMail}})

        if(!user)
            return res.status(200).json({status: 200, message: `Could not find user with email = ${escapedMail}`})

        const match = await bcrypt.compare(password, user.password)

        if(!match) {
            logger.log('error', 'Passwords are not the same')
            return res.status(200).json({status: 200, message: 'Passwords are not the same'})
        }

        const token = jsonwebtoken.sign({name: user.name}, process.env.JSONWEBTOKEN_PRIVATE, {expiresIn: '2 days'})

        logger.log('info', 'Token has been granted')
        return res.status(200).json({status: 200, access_token: token})
    }
}

export default AuthenticationController