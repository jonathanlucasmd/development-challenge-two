export default interface IStorageProvider {
	saveFile(file: Express.Multer.File): Promise<string>;
	deleteFile(file: string): Promise<void>;
	getSignedUrl(file: string): Promise<string>;
}
