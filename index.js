import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fund = document.getElementById("fund")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.onclick = connect
fund.onclick = fundFunc
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("connecting...")
        await window.ethereum.request({ method: "eth_requestAccounts" })
        console.log("connected")
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "please install metamask!"
        console.log("please install metamask! ")
    }
}

async function fundFunc() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //provider / connection to the blockchain
        // signer / wallet / someone with gas
        //contract that are interacting with
        // ^ ABI & Address

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            //listen for the tx to be mined
            // wait for this tx to finish
            await listenForTransactionMined(transactionResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        } // console.log(provider.getSigner.toString   // console.log(signer)
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`mining ${transactionResponse.hash}...`)
    //listen for this tx to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            resolve()
        })
    })

    // because we need to create a listener for the blockchain
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log(`Withdrawing...`)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMined(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

