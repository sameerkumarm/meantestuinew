import express from 'express';
//import services
import {getSSIs, getSSI} from '../retriveservice';
import {addSSI} from '../createservice';
import {updateSSI} from '../updateservice';
import {deleteSSI} from '../deleteservice';

const router = express.Router();

router.route('/')
	.get(getSSIs)
	.post(addSSI)
	.put(updateSSI);

router.route('/:id')
	.get(getSSI)
	.delete(deleteSSI);

export default router;