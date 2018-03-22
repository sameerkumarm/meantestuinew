import mongoose from 'mongoose';

var ssiSchema = new mongoose.Schema({
	Ssi: String,
	AssetClass: { type: String, trim: true, enum:['BA','CD']},
	Currency: { type: String, trim: true },
	TransactionSubtype: { type: String, trim: true, enum:['OWNE','PAIR', 'REPU'] },
	PlaceofSettlement: { type: String, trim: true },
	BuyerSellerIDType: { type: String, trim: true, enum:['BIC', 'UNKNOWN'] },
	BuyerSellerID: String,
	BuyerSellerNameAndAddress: String,
	BuyerSellerAccount: String,
	RecDelAgentIDType: { type: String, trim: true, enum:['BIC', 'UNKNOWN'] },
	RecDelAgentID: String,
	RecDelAgentNameAndAddress: String,
	RecDelAgentAccount: String,
});

export default mongoose.model("SSIModel", ssiSchema);