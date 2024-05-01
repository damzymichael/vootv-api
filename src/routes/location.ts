import {Router} from 'express';
import controller from '../controllers/location';

const router = Router();

router.get('/get-locations', controller.getLocations);

router.get('/get-location/:id', controller.getLocation);

router.post('/add-location', controller.addLocation);

router.patch('/update-location/:id', controller.updateLocation);

export default router;
