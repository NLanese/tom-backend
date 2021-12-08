import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers/index.js';

dotenv.config();

const startApolloServer = async () => {
    const app = express()
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}) => ({req})
    })

    const whitelist = [
        "http://localhost:4000/graphql"
    ]

    app.use(cors({ origin: "*" }))
    app.use(express.json)
    app.use(express.urlencoded({ extended: true }));
    
    app.get('/', (req, res) => {
		res.send('Welcome to SQL');
	});

    await server.start()
    await server.applyMiddleware({ app, path: '/graphql', cors: false });
    await app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}... GraphQL/Apollo at studio.apollographql.com/dev`));
}

startApolloServer()
