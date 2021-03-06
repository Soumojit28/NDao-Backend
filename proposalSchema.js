const mongoose =require('mongoose');

const proposal = new mongoose.Schema({
    _id:Number,
    contractAddress :String,
    encodedFunction: String,
    functionName:String,
    functionParams:[String],
    gas:Number,
    amount:Number,
    wallets: [String],
    signature : [String],
    approved : {
        type : Boolean,
        default : false
    },
})
module.exports = mongoose.model('proposal', proposal)