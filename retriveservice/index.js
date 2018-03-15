import mongoose from 'mongoose';

//import models
import SSIModel from "../models/SSIModel";

export const getSSIs = (req,res) => {
	SSI.find().exec((err,ssis) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}

		return res.json({'success':true,'message':'SSIs fetched successfully',ssis});
	});
}

export const getSSI = (req,res) => {
	SSIModel.find({_id:req.params.id}).exec((err,ssi) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}
		if(ssi.length){
			return res.json({'success':true,'message':'SSI fetched by id successfully',ssi});
		}
		else{
			return res.json({'success':false,'message':'SSI with the given id not found'});
		}
	})
}