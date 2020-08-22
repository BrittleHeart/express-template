import User from '../User'
import bcrypt from 'bcrypt'
import {logger} from '../../server'
import UtilController from './UtilController'

const utils = new UtilController()

class UserController {
    async index(req, res) {
        const users = await User.findAll()

        if(!users)
            return res.status(200).json({status: 200, message: 'Could not find any user'})
        
        return res.status(200).json({status: 200, collection: users})
    }

    async show(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})
    
        const user = await User.findOne({where: {userId: id}})

        if(!user)
            return res.status(200).json({status: 200, message: `Could not find user with id = ${id}`})

        return res.status(200).json({status: 200, collection: user})
    }

    async store(req, res) {
        const {name, email} = req.body
        let {password} = req.body

        const escapedName = escape(name)
        const escapedEmail = escape(email)

        if(!escapedName || !escapedEmail || !password)
            return res.status(400).json({status: 400, message: 'All values must be set!'})
        
        if(!utils.checkMail(escapedEmail))
            return res.status(400).json({status: 400, message: 'Please enter valid email address'})
        
        bcrypt.genSalt(10, (error, salt) => {
            if(error) {
                logger.log('error', `Could not generate salt ${error}`)
                return res.status(500).json({status: 500, message: 'Could not generate salt, plesae Again'})
            }

            bcrypt.hash(password, salt, async (error, hash) => {
                if(error) {
                    logger.log('error', `Could not generate hash ${error}`)
                    return res.status(500).json({status: 500, message: 'Could not generate hash, plesae Again'})
                }

                await User.create(
                    {
                        name: escapedName,
                        email: escapedEmail,
                        password: hash
                    }
                )

                logger.log('info', `User with email = ${escapedEmail} has been created`)

                return await res.status(201).json({status: 201, message: 'User has been created'})
            })
        })
    }

    async update(req, res) {
        let {name, password} = req.body
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})

        if(!name || !password)
            return await res.status(400).send('All values name and password, must be set')

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

    async destroy(req, res) {
        const {id} = req.params

        if(!id || isNaN(id))
            return res.status(400).json({status: 400, message: 'Id param must exists and must be integer'})
        
        await User.destroy({where: {userId: id}})

        return res.status(200).json({status: 200, message: `User with id = ${id} has been deleted`})
    }
}

export default UserController