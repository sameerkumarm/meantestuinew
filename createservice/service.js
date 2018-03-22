import mongoose from 'mongoose';

import express from 'express';
//import models
import SSIModel from "./models/SSIModel";

const router = express.Router();
const addSSI = (req,res) => {
	console.log(req.body);
	const newSSI = new SSIModel(req.body);
	newSSI.save((err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}

		return res.json({'success':true,'message':'SSI added successfully',ssi});
	})
}

router.route('/add').post(addSSI);

export default router;