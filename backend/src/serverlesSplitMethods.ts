import serverless from 'serverless-http';
import express, { json } from 'express';
import cors from 'cors';
import InformationController from './controllers/PatientsController';

const informationController = new InformationController();

module.exports.index = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.index);
	return app;
});

module.exports.create = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.create);
	return app;
});

module.exports.delete = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.delete);
	return app;
});

module.exports.deleteInformation = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.deleteInformation);
	return app;
});

module.exports.storeInformation = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.storeInformation);
	return app;
});

module.exports.update = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.update);
	return app;
});

module.exports.url = serverless(() => {
	const app = express();
	app.use(json());
	app.use(cors());
	app.get('/', informationController.url);
	return app;
});
