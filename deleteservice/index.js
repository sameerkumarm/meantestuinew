import mongoose from 'mongoose';

//import models
import SSIModel from "./models/SSIModel";

export const deleteSSI = (req,res) => {
	SSIModel.findByIdAndRemove(req.params.id, (err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}

		return res.json({'success':true,'message':'SSI Deleted Successfully',ssi});
	})
}