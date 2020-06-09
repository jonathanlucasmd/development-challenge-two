import serverless from 'serverless-http';
import express, { json } from 'express';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(json());

app.use(cors());

app.use(routes);

module.exports.handler = serverless(app);
