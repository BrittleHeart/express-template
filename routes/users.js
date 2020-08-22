import {app} from '../server'
import UserController from '../app/controllers/UserController'

const user = new UserController()

app.get('/api/v1/users', async (req, res) => await user.index(req, res))
app.get('/api/v1/users/:id', async (req, res) => await user.show(req, res))
app.post('/api/v1/users/', async (req, res) => await user.store(req, res))
app.put('/api/v1/users/:id', async (req, res) => await user.update(req, res))