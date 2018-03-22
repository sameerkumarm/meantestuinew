import mongoose from 'mongoose';

//import models
import SSIModel from "./models/SSIModel";
import fs from 'fs';

function readJSONFile(filename, callback) {
	console.log("Reading file");
	fs.readFile(filename, (err, data) => {
		console.log("File read callback");
		if (err) {
			console.log("File read callback");
			callback(err);
			return;
		}
		try {
			callback(null, JSON.parse(data));
		} catch (exception) {
			callback(exception);
		}
	});
}

export const getSSIs = (req,res) => {
	SSIModel.find(req.body).exec((err,ssis) => {
		if(err){
			return res.json({'success':false,'message':'Some Error'});
		}
		console.log(ssis);
		return res.json({'success':true,'message':'SSIs fetched successfully',ssis});
	});
}

export const getSSI = (req,res) => {
	readJSONFile('./fields.json', (err, data) => {
	    if (err) {
	      console.error(err);
	    }
	    setTimeout(() => {
	    	console.log("Id param:" + req.params.id)
	    	SSIModel.find({_id: mongoose.Types.ObjectId(req.params.id)}).exec((err,ssi) => {
	    		if(err){
	    			return res.json({'success':false,'message':'Some Error'});
	    		}
	    		if(ssi.length){
	    			console.log("Fetched ssi:" + ssi)
	    			var fields = data.map(function(field) {
	    				console.log(field.fieldName + ':' + ssi[0][field.fieldName]);
	    				return {...field,...{data:ssi[0][field.fieldName]}};
	    			});
	    			console.log(JSON.stringify(fields));
	    			return res.json({'success':true,'message':'SSI fetched by id successfully',"data":fields});
	    		}
	    		else{
	    			return res.json({'success':false,'message':'SSI with the given id not found'});
	    		}
	    	})
	    }, 1500);
	});
	
}