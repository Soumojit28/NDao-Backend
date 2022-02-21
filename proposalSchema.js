const mongoose =require('mongoose');

const proposal = new mongoose.Schema({
    _id:Number,
    contractAddress :String,
    amount : Number,
    receiver : String,
    wallets: [String],
    signature : [String],
    approved : {
        type : Boolean,
        default : false
    },
})
module.exports = mongoose.model('proposal', proposal)