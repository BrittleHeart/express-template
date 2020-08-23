import {app} from '../server'
import UserController from '../app/controllers/UserController'
import AuthenticateController from '../app/controllers/AuthenticationController'
import { verifyJWTToken } from '../app/middlewares/verifyJWTToken'

const user = new UserController()
const auth = new AuthenticateController()

app.get('/api/v1/users', verifyJWTToken, async (req, res) => await user.index(req, res))
app.get('/api/v1/users/:id', verifyJWTToken, async (req, res) => await user.show(req, res))
app.post('/api/v1/users/', async (req, res) => await user.store(req, res))
app.put('/api/v1/users/:id', verifyJWTToken, async (req, res) => await user.update(req, res))
app.delete('/api/v1/users/:id', verifyJWTToken, async(req, res) => await user.destroy(req, res))

app.post('/api/v1/authenticate', async (req, res) => await auth.authenticate(req, res))