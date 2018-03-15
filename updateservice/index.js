import mongoose from 'mongoose';

//import models
import SSIModel from "../models/SSIModel";


export const updateSSI = (req,res) => {
	SSIModel.findOneAndUpdate({ _id:req.body.id }, req.body, { new:true }, (err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error whiloe updating the ssi','error':err});
		}
		console.log(ssi);
		return res.json({'success':true,'message':'SSI Updated Successfully',ssi});
	})
}