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
    res.send('Working!')
})

router.get('/count', async (req, res) => {
    count = await proposalCount()
    console.log(count)
    res.send({ 'count': count })
})

router.get('/all', async (req, res) => {
    try{
        proposals.find({}).then((result)=>{
            res.send(result)
        })
    }
    catch(err){
        res.send(err).sendStatus(404)
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
        if (currentCount + 1 != proposalId) {
            res.sendStatus(404)
        }
        else {

            let sign_check = await ethers.utils.verifyTypedData(domain, types, value, signature)
            if (sign_check != walletAddress) {
                console.log('Sign check failed')
                res.sendStatus(404)
            }
            else {
                let new_proposal = new proposals({
                    _id: proposalId,
                    contractAddress: contractAddress,
                    amount: amount,
                    receiver: receiver,
                    signature: signature
                })
                await new_proposal.save()
            }
            res.sendStatus(200)
        }
    }
    catch (err) {
        console.log(err)
        res.send(err).sendStatus(500)
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
        
        if (sign_check != walletAddress) {
            console.log('sign failed')
            res.sendStatus(404)
        }
        else{
            console.log('updating data')
            console.log(find.signature.length)
            // await proposals.findByIdAndUpdate(proposalId,{approved:true})
            await proposals.findByIdAndUpdate(proposalId,{ "$push":{signature:signature}, approved: find.signature.length >= 2? true: false},{ "new": true, "upsert": true })

            res.sendStatus(200)
        }
        
    }
    catch (err) {
        console.log(err)
        res.send(err).sendStatus(500)
    }
})

module.exports = router

