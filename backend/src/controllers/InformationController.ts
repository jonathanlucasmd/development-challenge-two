import { Request, Response } from 'express';
import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import databaseConfig from '../config/database';
import S3StoragedProvider from '../providers/StorageProvider/implementations/S3StoragedProvider';

const db = new AWS.DynamoDB.DocumentClient({
	region: 'us-east-1',
	apiVersion: '2012-08-10',
});

const storageProvider = new S3StoragedProvider();

interface IInformations {
	date: string;
	doctor: string;
	description: number;
	annex: string | null;
}

export default class InformationController {
	public async create(request: Request, response: Response): Promise<Response> {
		try {
			const { name, cpf, age } = request.body;
			if (!(name && cpf && age)) {
				throw Error('All fields should be filled');
			}

			const params = {
				TableName: databaseConfig.tableName,
				ExpressionAttributeNames: {
					'#cpf': 'cpf',
				},
				ExpressionAttributeValues: {
					':cpf': cpf,
				},
				FilterExpression: '#cpf = :cpf ',
			};

			const hasInformation = await db.scan(params).promise();

			if (hasInformation.Count) {
				throw new Error('User information already exist');
			}

			const information = {
				id: uuid(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				cpf,
				name,
				age,
				informations: [],
			};

			const databaseResponse = await db
				.put({
					TableName: databaseConfig.tableName,
					Item: information,
				})
				.promise();

			return response.json({ databaseResponse, information });
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}

	public async storeInformation(
		request: Request,
		response: Response
	): Promise<Response> {
		const { date, doctor, description } = JSON.parse(request.body.form);
		const { id } = request.params;
		const { file } = request;

		try {
			if (!(date && id && doctor && description)) {
				throw Error('All fields should be filled');
			}

			const { Item: user } = await db
				.get({
					TableName: databaseConfig.tableName,
					Key: { id },
				})
				.promise();

			if (!user) {
				console.log(user);
				throw Error('Patient not found');
			}

			let filename;
			if (file) {
				filename = await storageProvider.saveFile(file);
			}

			const informations = [
				...user.informations,
				{ date, doctor, description, annex: filename || null },
			];

			const params = {
				Key: {
					id,
				},
				TableName: databaseConfig.tableName,
				ConditionExpression: 'attribute_exists(id)',
				UpdateExpression: 'SET informations = :informations',
				ExpressionAttributeValues: {
					':informations': informations,
				},
				ReturnValues: 'ALL_NEW',
			};

			const updatedUser = await db.update(params).promise();

			return response.json(updatedUser);
		} catch (err) {
			console.log(err);
			return response.json({ err });
		}
	}

	public async index(request: Request, response: Response): Promise<Response> {
		try {
			const patients = await db
				.scan({ TableName: databaseConfig.tableName })
				.promise();

			return response.json(patients.Items);
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}

	public async url(request: Request, response: Response): Promise<Response> {
		const { filename } = request.params;
		return response.json({
			url: await storageProvider.getSignedUrl(`compressed/${filename}`),
		});
	}

	public async update(request: Request, response: Response): Promise<Response> {
		try {
			const { name, age } = request.body;
			const { id } = request.params;

			if (!(name && id && id)) {
				throw new Error('All fields should be filled');
			}

			const { Item: user } = await db
				.get({ TableName: databaseConfig.tableName, Key: { id } })
				.promise();

			if (!user) {
				throw new Error('User not found ');
			}

			const params = {
				Key: {
					id,
				},
				TableName: databaseConfig.tableName,
				ExpressionAttributeNames: {
					'#age': 'age',
					'#name': 'name',
				},
				ConditionExpression: 'attribute_exists(id)',
				ExpressionAttributeValues: {
					':patientName': name,
					':age': age,
				},
				UpdateExpression: 'SET #name = :patientName, #age = :age',
				ReturnValues: 'ALL_NEW',
			};

			const updatedUser = await db.update(params).promise();

			return response.json(updatedUser);
		} catch (err) {
			console.log(err);
			return response.status(400).json({ error: err.message });
		}
	}

	public async delete(request: Request, response: Response): Promise<Response> {
		try {
			const { id } = request.params;
			console.log(id);

			const { Item: user } = await db
				.get({
					TableName: databaseConfig.tableName,
					Key: { id },
				})
				.promise();

			if (!user) {
				throw new Error('User not found');
			}

			db.delete({
				TableName: databaseConfig.tableName,
				Key: { id },
			}).promise();

			return response.status(204).send();
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}
}
