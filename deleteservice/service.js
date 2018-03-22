import mongoose from 'mongoose';
import express from 'express';
//import models
import SSIModel from "./models/SSIModel";

const router = express.
const deleteSSI = (req,res) => {
	SSIModel.findByIdAndRemove(req.params.id, (err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}

		return res.json({'success':true,'message':'SSI Deleted Successfully',ssi});
	})
}

router.route('/del/:id').delete(deleteSSI);

export default router;