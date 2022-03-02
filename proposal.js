require('dotenv').config()
const express = require('express');
var router = express.Router();
const proposals = require('./proposalSchema.js')
const ethers = require('ethers');

const domain = {
    name: "NDAO",
    version: "1",
    chainId: 80001,
    verifyingContract: '0xA710BfA9D9E9a4fe7c5b3520c0D73A94077156C6'
};

const types = {
    Signer: [
        { name: 'proposalId', type: 'uint256' },
        { name: 'contractAddress', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'receiver', type: 'address' },
    ],
};

const proposalCount = async () => {
    const count = await proposals.find({}).count()
    return count
}

router.use(express.json())
router.get('/', async (req, res) => {
    return res.send('Working!')
})

router.get('/count', async (req, res) => {
    count = await proposalCount()
    console.log(count)
    return res.send({ 'count': count })
})

router.get('/all', async (req, res) => {
    try{
        proposals.find({}).then((result)=>{
            return res.send(result)
        })
    }
    catch(err){
        return res.send(err).sendStatus(404)
    }
})

router.post('/new', async (req, res) => {
    try {
        const contractAddress = req.body.contractAddress
        const amount = req.body.amount
        const receiver = req.body.receiver
        const signature = req.body.signature
        const proposalId = req.body.proposalId
        const walletAddress = req.body.walletAddress

        const currentCount = await proposalCount()
        console.log(currentCount)

        const value = {
            proposalId: proposalId,
            contractAddress: contractAddress,
            amount: amount,
            receiver: receiver
        }
        console.log(value , signature, walletAddress)
        if (currentCount + 1 != proposalId) {
            console.log('Count not matched!')
            return res.status(500).send('Count not matched!')
        }
        else {

            let sign_check = await ethers.utils.verifyTypedData(domain, types, value, signature)
            console.log(sign_check)
            if (sign_check.toLowerCase() != walletAddress.toLowerCase()) {
                console.log('Sign check failed')
                return res.status(500).send('Sign check failed')
            }
            else {
                let new_proposal = new proposals({
                    _id: proposalId,
                    contractAddress: contractAddress,
                    amount: amount,
                    receiver: receiver,
                    signature: signature,
                    wallets: walletAddress
                })
                await new_proposal.save()
            }
            return res.sendStatus(200)
        }
    }
    catch (err) {
        console.log(err)
        return res.send(err).sendStatus(500)
    }
})




router.post('/approve', async (req, res) => {
    try {
        const walletAddress = req.body.walletAddress
        const signature = req.body.signature
        const proposalId = req.body.proposalId
        const find = await proposals.findById(proposalId)
        const value = {
            proposalId: proposalId,
            contractAddress: find.contractAddress,
            amount: find.amount,
            receiver: find.receiver
        }
        console.log(walletAddress,signature,proposalId)
        console.log(value)
        const sign_check =  await ethers.utils.verifyTypedData(domain, types, value, signature)
        
        if (sign_check.toLowerCase() != walletAddress.toLowerCase()) {
            console.log('sign failed')
            return res.status(500).send('Sign check failed')
        }
        else{
            console.log('updating data')
            console.log(find.signature.length)
            // await proposals.findByIdAndUpdate(proposalId,{approved:true})
            if(find.wallets.includes(walletAddress)||find.wallets.includes(signature)){
                return res.send('Already Exists')
            }
            await proposals.findByIdAndUpdate(proposalId,{ "$push":{signature:signature , wallets:walletAddress}, approved: find.signature.length >= 2? true: false},{ "new": true, "upsert": true })

            return res.sendStatus(200)
        }
        
    }
    catch (err) {
        console.log(err)
        return res.send(err)
        
    }
})

module.exports = router

