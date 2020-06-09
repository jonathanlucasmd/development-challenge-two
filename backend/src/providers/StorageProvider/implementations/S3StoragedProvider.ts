import aws, { S3 } from 'aws-sdk';
import { extname } from 'path';
import crypto from 'crypto';
import uploadConfig from '../../../config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
	private client: S3;

	constructor() {
		this.client = new aws.S3({
			region: 'us-east-1',
		});
	}

	public async saveFile(file: Express.Multer.File): Promise<string> {
		const fileHash = crypto.randomBytes(20).toString('hex');
		const fileName = `${fileHash}${extname(file.originalname)}`;
		const buffer = Buffer.from(file.buffer.toJSON().data);

		if (!file.mimetype) {
			throw new Error('File not found');
		}

		await this.client
			.putObject({
				Bucket: uploadConfig.config.aws.bucket, // Nome do bucket no CDN,
				Key: `uploads/${fileName}`,
				// ACL: 'public-read', // Permissões
				Body: buffer,
				ContentType: file.mimetype,
			})
			.promise();

		return `${fileHash}.jpg`;
	}

	public async deleteFile(file: string): Promise<void> {
		await this.client
			.deleteObject({
				Bucket: uploadConfig.config.aws.bucket,
				Key: file,
			})
			.promise();
	}

	public async getSignedUrl(file: string): Promise<string> {
		const url = await this.client.getSignedUrlPromise('getObject', {
			Bucket: uploadConfig.config.aws.bucket, // Nome do bucket no CDN,
			Key: file,
			Expires: 15,
		});

		return url;
	}
}

export default DiskStorageProvider;
