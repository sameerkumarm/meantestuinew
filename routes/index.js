import express from 'express';
//import services
import {getSSIs, getSSI} from '../retriveservice';
import {addSSI} from '../createservice';
import {updateSSI} from '../updateservice';
import {deleteSSI} from '../deleteservice';

const router = express.Router();

router.route('/fetchAll').put(getSSIs);
router.route('/add').post(addSSI);
router.route('/update').put(updateSSI);
router.route('/fetch/:id').get(getSSI);
router.route('/del/:id').delete(deleteSSI);

export default router;