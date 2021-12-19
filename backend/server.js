import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/index.js';
import { uploadFile, getFileStream } from './s3/s3.js'
import multer from 'multer'
import fs from 'fs'
import util from 'util'
import sendForgotPasswordEmail from './utils/twoFactorAuth/forgotPasswordEmail.js'

dotenv.config();

const startApolloServer = async () => {
    const app = express()
    const upload = multer({
        dest: 'uploads/'
    })
    const unlinkFile = util.promisify(fs.unlink)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({ req })
    })

    const whitelist = [
        "http://localhost:3000",
        "http://localhost:5001/graphql",
        "https://studio.apollographql.com",
        "http://localhost:8000",
        "http://localhost:8080"
    ]

    app.use(cors({
        /* credentials: true, */
        origin: "*"
    }));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.get('/', (req, res) => {
        res.send('Welcome to SQL');
    });

    app.get('/password/reset/:userId', async (req, res) => {
        sendForgotPasswordEmail(req.params.userId)
        res.send(200)
    })

    app.get('/images/:key', async (req, res) => {
        const key = req.params.key
        const readStream = await getFileStream(key)
        readStream.pipe(res)
    })

    app.post('/images', upload.single('image'), async (req, res) => {
        const file = req.file
        const result = await uploadFile(file)
        await unlinkFile(file.path)
        res.send({
            imagePath: `/images/${result.Key}`
        })
    })

    await server.start()
    await server.applyMiddleware({
        app,
        path: '/graphql',
        cors: false
    });
    await app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}... GraphQL/Apollo at studio.apollographql.com/dev`));
}

startApolloServer()
