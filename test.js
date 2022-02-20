require('dotenv').config()
const ethers = require('ethers')


async function levelSigner(){
    const wallet = new ethers.Wallet(process.env.KEY2)
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
    const value = {
        proposalId: 1,
        contractAddress : "0x9a53d2E5497468eD2569E7D8d7eD9b1379Fb2c05",
        amount: 100,
        receiver: "0x5d0c83A6bd7bf1986E5519C766f6568D2B390dE0"
    }
    // const value = {
    //     proposalId: 1,
    //     contractAddress : "0x9b29c09dfF568912B22fFd9A4b03964907df1b57",
    //     amount: 100,
    //     receiver: "0x2141fc90F4d8114e8778447d7c19b5992F6A0611"
    // }
    sign =await wallet._signTypedData(domain, types, value)
    console.log(sign)
    let test = await ethers.utils.verifyTypedData(domain, types, value, sign)
    console.log(test)
   
}

levelSigner()

