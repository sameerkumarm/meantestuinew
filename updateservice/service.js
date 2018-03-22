import mongoose from 'mongoose';
import express from 'express';
//import models
import SSIModel from "./models/SSIModel";

const router = express.Router();

const updateSSI = (req,res) => {
	SSIModel.findOneAndUpdate({ _id:req.body._id }, req.body, { new:true }, (err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error whiloe updating the ssi','error':err});
		}
		console.log(ssi);
		return res.json({'success':true,'message':'SSI Updated Successfully',ssi});
	})
}

router.route('/update').put(updateSSI);

export default router;