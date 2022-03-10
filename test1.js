require('dotenv').config()
const ethers = require('ethers')
const abi = require('./abi.json')
const encodeSinger = async() =>{
    //let ABI = ["function mint(uint amount) external"];
    let iface = new ethers.utils.Interface(abi);
    const n= await iface.encodeFunctionData('burn', [10000]);
    console.log(n)
    return n
}



async function levelSigner(){
    const wallet = new ethers.Wallet(process.env.KEY3)
    const domain = {
        name: "NDAO",
        version: "1",
        chainId: 80001,
        verifyingContract: '0x23F9c5478d0F56a3566dbb671080217dEde570CB'
    };
    const types = {
        Signer: [
            { name: "proposalId", type: "uint256" },
            { name: "contractAddress", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "functionCall", type: "bytes" },
        ]
        
    };
    const value = {
        proposalId: 8,
        contractAddress: "0x435e0632714408413e51495ab44341f28f983012",
        amount:0,
        gas:5000,
        functionCall:  ethers.utils.arrayify(await encodeSinger())
        
    }
    console.log(value)
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

