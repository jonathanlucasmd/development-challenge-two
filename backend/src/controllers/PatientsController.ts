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
	id: string;
	date: string;
	doctor: string;
	description: number;
	annex: string | null;
}

export default class InformationController {
	public async create(request: Request, response: Response): Promise<Response> {
		try {
			const { name, cpf, birthdate, phone, address } = request.body;
			if (!(name && cpf && birthdate && phone && address)) {
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

			const hasPatient = await db.scan(params).promise();

			if (hasPatient.Count) {
				throw new Error('Patient already exist');
			}

			const patient = {
				id: uuid(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				cpf,
				name,
				phone,
				address,
				birthdate,
				exams: [],
			};

			const databaseResponse = await db
				.put({
					TableName: databaseConfig.tableName,
					Item: patient,
				})
				.promise();

			return response.json({ databaseResponse, patient });
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}

	public async storeInformation(
		request: Request,
		response: Response
	): Promise<Response> {
		try {
			const { file } = request;
			const { id } = request.params;
			const { date, doctor, description } = JSON.parse(request.body.form);

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
				throw Error('Patient not found');
			}

			let filename;
			if (file) {
				filename = await storageProvider.saveFile(file);
			}

			const informations = [
				...user.informations,
				{ id: uuid(), date, doctor, description, annex: filename || null },
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
		try {
			const { filename } = request.params;
			const url = await storageProvider.getSignedUrl(`compressed/${filename}`);
			return response.json({
				url,
			});
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}

	public async update(request: Request, response: Response): Promise<Response> {
		try {
			const { name, cpf, phone, address, birthdate } = request.body;
			const { id } = request.params;

			if (!(id && name && cpf && phone && address && birthdate)) {
				throw new Error('All fields should be filled');
			}

			const { Item: patient } = await db
				.get({ TableName: databaseConfig.tableName, Key: { id } })
				.promise();

			if (!patient) {
				throw new Error('Patient not found ');
			}

			const params = {
				Key: {
					id,
				},
				TableName: databaseConfig.tableName,
				ExpressionAttributeNames: {
					'#cpf': 'cpf',
					'#phone': 'phone',
					'#address': 'address',
					'#birthdate': 'birthdate',
					'#name': 'name',
				},
				ConditionExpression: 'attribute_exists(id)',
				ExpressionAttributeValues: {
					':patientName': name,
					':cpf': cpf,
					':phone': phone,
					':address': address,
					':birthdate': birthdate,
				},
				UpdateExpression:
					'SET #name = :patientName, #birthdate = :birthdate, #cpf = :cpf, #phone = :phone, #address = :address',
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

			const { Item: patient } = await db
				.get({
					TableName: databaseConfig.tableName,
					Key: { id },
				})
				.promise();

			if (!patient) {
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

	public async deleteInformation(
		request: Request,
		response: Response
	): Promise<Response> {
		try {
			const { patient: patientId, exam: examId } = request.query;
			const { Item: patient } = await db
				.get({
					TableName: databaseConfig.tableName,
					Key: { id: patientId },
				})
				.promise();

			if (!patient) {
				throw new Error('User not found');
			}

			const index = patient.informations.findIndex(
				(info: IInformations) => info.id === examId
			);

			storageProvider.deleteFile(patient.informations[index].annex);

			patient.informations.splice(index, 1);

			const params = {
				Key: {
					id: patientId,
				},
				TableName: databaseConfig.tableName,
				ConditionExpression: 'attribute_exists(id)',
				UpdateExpression: 'SET informations = :informations',
				ExpressionAttributeValues: {
					':informations': patient.informations,
				},
				ReturnValues: 'ALL_NEW',
			};

			db.update(params).promise();

			return response.status(204).send();
		} catch (err) {
			return response.status(400).json({ error: err.message });
		}
	}
}
