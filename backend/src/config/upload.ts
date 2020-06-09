import multer, { StorageEngine } from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
	driver: 's3' | 'disk';
	tmpFolder: string;
	uploadsFolder: string;
	multer: {
		storage: StorageEngine;
	};
	config: {
		disk: {};
		aws: {
			bucket: string;
		};
	};
}

export default {
	driver: process.env.STORAGE_DRIVER,
	tmpFolder,
	uploadsFolder: path.resolve(tmpFolder, 'uploads'),

	multer: {
		storage: multer.memoryStorage(),
	},
	config: {
		disk: {},
		aws: {
			bucket: 'medcloudchallenge', // Bucket do cdn
		},
	},
} as IUploadConfig;
