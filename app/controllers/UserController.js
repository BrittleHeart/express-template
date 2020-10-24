import User from '../User'
import bcrypt from 'bcrypt'
import {logger} from '../../server'
const yup = require('yup')


class UserController {
    /**
     * Selects all the data in database
     * 
     * @param {Object} req 
     * @param {Object} res 
     */

    async index(req, res) {
        const users = await User.findAll()

        if(!users)
            return res.status(200).json({status: 200, message: 'Could not find any user'})
        
        return res.status(200).json({status: 200, collection: users})
    }

    /**
     * Shows the user's data where :id = user id
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    async show(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})
    
        const user = await User.findOne({where: {userId: id}})

        if(!user)
            return res.status(200).json({status: 200, message: `Could not find user with id = ${id}`})

        return res.status(200).json({status: 200, collection: user})
    }


    /**
     * Creates new user
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    async store(req, res) {
        let {name, email, password} = req.body


        /**
         * With yup module, you can validate request body schema
         * 
         * It also allows you to change the schema anytime you want to
         */
        const user_schema = yup.object().shape({
            name: yup.string().min(4).max(10).trim().required(),
            email: yup.string().min(5).max(255).email().trim().required(),
            password: yup.string().min(3).max(255).trim().required()
        })

        const escapedName = escape(name)
        const escapedEmail = escape(email)


        /**
         * Here u can see validation process
         * 
         * Yup module validates request body structure, and if failure is detected, shows the error message
         */
        try {await user_schema.validate({name, email, password})}
        catch (error) {return res.status(400).json({message: error.message})}


        /**
         * Checking for the existence of potential user email addresses
         * 
         * That makes me sure that the email, that was passed by user - is unique
         */
        const existing = await User.findOne({select: {email}, where: {email}})
        if(existing) {
            logger.log('error', `User with email = ${existing.email} arleady exists`)
            return res.status(500).json({status: 500, message: `User with email = ${existing.email} arleady exists`})
        }
        
        const salt = await bcrypt.genSalt(10)
        if(!salt.length) {
            logger.log('error', 'Could not generate salt')
            return res.status(500).json({status: 500, message: 'Could not generate salt, plesae Again'})
        }

        const hash = await bcrypt.hash(password, salt)
        if(!hash.length) {
            logger.log('error', 'Could not generate hash')
            return res.status(500).json({status: 500, message: 'Could not generate hash, plesae Again'})
        }

        const new_user = await User.create(
            {
                name: escapedName,
                email: escapedEmail,
                password: hash
            }
        )

        if(!new_user) {
            logger.log('info', 'Could not create user, try again')

            return await res.status(201).json({status: 201, message: 'Could not create user'})
        }

        logger.log('info', `User with email = ${escapedEmail} has been created`)

        return await res.status(201).json({status: 201, message: 'User has been created'})
    }


    /**
     * Updated the user credencials
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    async update(req, res) {
        let {name, password} = req.body
        const {id} = req.params

        /**
         * I don't want to allow users to change their emails by themselves
         * 
         * Because email is unique value, this could cause the error
         */
        const user_schema = yup.object().shape({
            name: yup.string().min(4).max(10).trim().required(),
            password: yup.string().min(3).max(255).trim().required()
        })

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        try {await user_schema.validate({name, password})}
        catch (error) {return res.status(400).json({message: error.message})}

        const user = await User.findOne({
            where: {
                userId: id
            }
        })

        if(name === user.name) {
            await User.update({name: name}, {where: {userId: id}})

            return res.status(200).json({status: 200, message: 'Name has been updated'})
        }
        
        bcrypt.compare(password, user.password, async (error, match) => {
            if(error) throw res.status(500).json({status: 500, message: 'Something went wrong during passwords compering'})

            if(match) {
                await User.update({password: password}, {where: {userId: id}})

                return res.status(200).json({status: 200, message: 'Password has been updated'})
            }
        })

        bcrypt.genSalt(10, (error, salt) => {
            if(error) throw res.status(500).json({status: 500, message: 'Something went wrong during generating salt'})

            bcrypt.hash(password, salt, async (error, hash) => {
                if(error) throw res.status(500).json({status: 500, message: 'Invalid hash or entered data'})

                password = hash

                await User.update({name: name, password: password},{where: {userId: id}})

                return res.status(200).json({status: 200, message: 'All user data have updated'})
            })
        })
    }


    /**
     * Deletes user with :id = user id
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    async destroy(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})
        
        const user = await User.findOne({where: {userId: id}})

        if(!user)
            return res.status(400).json({status: 400, message: `Wait! User with id = ${id} does not exists`})

        await User.destroy({where: {userId: id}})

        return res.status(200).json({status: 200, message: `User with id = ${id} has been deleted`})
    }
}

export default UserController