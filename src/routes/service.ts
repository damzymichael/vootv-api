import {Router} from 'express';
import controller from '../controllers/service';

const router = Router();

router.post('/add-service', controller.addService);

router.get('/location-services/:locationId', controller.getLocationServices);

export default router;
