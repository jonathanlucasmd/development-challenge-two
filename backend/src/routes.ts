import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import InformationController from './controllers/InformationController';

const informationController = new InformationController();
const upload = multer(uploadConfig.multer);

const route = Router();

route.get('/', informationController.index);
route.get('/annex/:filename', informationController.url);

route.post('/', informationController.create);
route.post(
	'/exam/:id',
	upload.single('annex'),
	informationController.storeInformation
);

route.put('/:id', informationController.update);
route.delete('/:id', informationController.delete);

export default route;
