# Hello everyone

### Introduce 
<p> It's so amazing that I can introduce you my express template.

Everything what has been build here, used to be your manager. For what?
thats simple, when you are using thins template, you can build your 
next great idea so much faster! </p>

### Core Dependecies
- React
- Express
- Cors
- Axios
- Bcrypt

### Why it's so simple?

Because of express framework, which allows you, to create whole 
server and so on. Here is my config:

````javascript

import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';

export const app = express();

require('dotenv').config({ path: path.resolve('.env') });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('./node_modules/'));
app.use(express.static('./dist/'));
app.use(express.static('./resources/'));

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // One hour;
app.set('trust proxy', 1);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secret: true,
            expires: expiryDate,
            httpOnly: true,
        },
    })
);
app.use(helmet());
app.use(cors());

app.disable('x-powered-by');

if(process.env.NODE_ENV === 'production')
    app.listen(process.env.PORT);

app.listen(process.env.SERVER_PORT, () => {
    mongoose.set('useAndFindModify', false);
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
});

const database = mongoose.connection;

database.on('error', (error) => console.log(`Something went wrong during connection ${error}`));

database.once('open', () => {
    fs.readdir(path.resolve('routes/'), (err, files) => {
        if(err) throw err;

        // By this simple action, we don't have to reapet ourselfs, which can be very usefull,
        // This function works like bootstrap for routes, and loads it, if file exists
        files.forEach(element => require(`./routes/${element.replace('.js', '')}`));
        
    });

    if (process.env.NODE_ENV !== 'production')
        console.log(`Server has been created and listen on http://localhost:${process.env.SERVER_PORT}`);
});

````
The module called cors can be using for example axios, when you are
fatching data here's an example:

````javascript

axios.get("http://someDomain.xyz/abc")
    .then(result => {
        array = result.data
    })
    .catch(error => {
       errorArray = error
    });

````

### How to handle routes?
It is preey straight forward! The only thing which you have to do, to add really new route
is to write something like that

```javascript

app.[http action]('name', (req, res) => /* Do some stuff */)

// Where [http action] -> get, post, delete, update

```
### How is frontend structured

I was wondering how to create a modern frontend solution. 
I've wanted to create that with handlebars usage, but it was unfortunate.

Now, this project is built VIA react

## Where can I find logic of server? 
Logic of the application is located in app/ directory.

### Visit me
You can text me if you want to contribute this project

[Facebook] (https://www.facebook.com/bartosz.pazdur.1)

[Twitter] (https://www.twitter.com/BartoszPazdur)

[Github] (https://www.github.com/BrittleHeart)

[Gitlab] (https://www.gitlab.com/BrittleHeart)

# Thank you!
