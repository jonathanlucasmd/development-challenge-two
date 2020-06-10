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

interface IExam {
	id: string;
	date: string;
	doctor: string;
	description: number;
	annex: string | null;
}

export default class ExamController {
	public async storeExam(
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

			const exams = [
				...user.exams,
				{ id: uuid(), date, doctor, description, annex: filename || null },
			];

			const params = {
				Key: {
					id,
				},
				TableName: databaseConfig.tableName,
				ConditionExpression: 'attribute_exists(id)',
				UpdateExpression: 'SET exams = :exams',
				ExpressionAttributeValues: {
					':exams': exams,
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

	public async deleteExam(
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
				throw new Error('Patient not found');
			}

			const index = patient.exams.findIndex(
				(info: IExam) => info.id === examId
			);

			storageProvider.deleteFile(patient.exams[index].annex);

			patient.exams.splice(index, 1);

			const params = {
				Key: {
					id: patientId,
				},
				TableName: databaseConfig.tableName,
				ConditionExpression: 'attribute_exists(id)',
				UpdateExpression: 'SET exams = :exams',
				ExpressionAttributeValues: {
					':exams': patient.exams,
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
