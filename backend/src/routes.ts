import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import PatientsController from './controllers/PatientsController';
import ExamsController from './controllers/ExamsController';

const patientsController = new PatientsController();
const examsController = new ExamsController();
const upload = multer(uploadConfig.multer);

const route = Router();

route.get('/', patientsController.index);
route.get('/annex/:filename', patientsController.url);

route.post('/', patientsController.create);
route.post('/exam/:id', upload.single('annex'), examsController.storeExam);

route.put('/:id', patientsController.update);

route.delete('/exam/', examsController.deleteExam);
route.delete('/:id', patientsController.delete);

export default route;
