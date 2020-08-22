import {app} from '../server'
import UserController from '../app/controllers/UserController'

const user = new UserController()

app.get('/api/v1/users', async (req, res) => await user.index(req, res))