import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/index.js';
import uploadFile from './s3/s3.js'
import multer from 'multer'

dotenv.config();

const startApolloServer = async () => {
    const app = express()

    const upload = multer({ dest: 'uploads/' })

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => ({req})
    })

    const whitelist = [
        "http://localhost:3000",
        "http://localhost:4000/graphql",        
        "https://studio.apollographql.com",
    ]

    app.use(cors({ /* credentials: true, */ origin: "*" })); 
    app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
    
    app.get('/', (req, res) => {
		res.send('Welcome to SQL');
	});

    app.post('/images', upload.single('image'), async (req, res) => {
        const file = req.file
        const result = await uploadFile(file)
        res.send(200)
    })

    await server.start()
    await server.applyMiddleware({ app, path: '/graphql', cors: false });
    await app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}... GraphQL/Apollo at studio.apollographql.com/dev`));
}

startApolloServer()
