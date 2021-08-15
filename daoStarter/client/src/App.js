import React, { useState } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { ethers } from "ethers";
import FactoryArtifact from "./contracts/Factory.json"
import contractAddress from "./contracts/contract-address.json"
import { providers, Signer } from "ethers"
//import { CoreAPI, Request } from "@textile/eth-storage"
import TextField from '@material-ui/core/TextField';
const BUIDLER_EVM_NETWORK_ID = '137'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const ethereum = window.ethereum;
// let provider;




const useStyles = makeStyles((theme) => ({
    root: {
        height: '10%',
    },
    text:{
        primary: "#FFFFFF"
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    cardContainer: {
        display: 'flex',
        height: '100vmin',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#11BAA7',
    },
    InnerCard: {
        backgroundColor: '#282c34',
        color: 'white',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        paddingBottom: '3rem',
        width: '50rem',
    },
    input: {
        color: "white"
      }
}));

export default function App() {
    const [token, setToken] = useState()
    const [DaoName, setDaoName] = useState()
    const [TotalSupply, setTotalSupply] = useState()
    const [info, setInfo] = useState()
    const classes = useStyles()
    const [createDocStore, setCreateDocStore] = useState(false)
    const steps = getSteps()
    const [activeStep, setActiveStep] = React.useState(0)
    const [skipped, setSkipped] = React.useState(new Set())
    //eth state
    const [Addr, setAddr] = useState()
    const [provider, setProvider] = useState()
    const [TokenData, setTokenData] = useState()
    const [networkError, setNetworkError] = useState()
    const [txError, setTxError] = useState()
    const [txBeingSent, setTxBeingSent] = useState()
    const [getTestAddr, setTestAddr] = useState('1')
    const [txHash, setTxHash] = useState(0)
    const [associateSuccess, setAssociateSuccess] = useState()
    //ipfs state
    const [proposalCID, setProposalCID] = useState()
    const [filAddr, setFilAddr] = useState()
    const [dealStatus, setDealStatus] = useState()

    React.useEffect(() => {
        const windowProvider = async () => {
            if (typeof window.ethereum !== 'undefined'
                || (typeof window.web3 !== 'undefined')) {

                setProvider(window['ethereum'] || window.web3.currentProvider);

                try {
                    await provider.enable();
                } catch (e) {
                    console.error('user refused to connect');
                }
                //console.log('network:', provider.networkVersion);
                //console.log('selectedAddress:', provider.selectedAddress);
                //console.log('is metamask:', provider.isMetaMask);
            }
        }
        windowProvider();
    });

    /////////////////START ETH CONNECTION///////////////////////////
    /////////////////START ETH CONNECTION///////////////////////////

    if (ethereum) {
        ethereum.on('accountsChanged', function (accounts) {
            setAddr(accounts[0])
        })
    }

    async function connectWallet() {
        const tempAddr = await window.ethereum.enable()
        setAddr(tempAddr)
        if (!checkNetwork()) {
            return;
        }
        initializeEthers()
        setToken(token);
        console.log(token)

    }

    async function initializeEthers() {
        const provider3 = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider3)
        // console.log(provider3)
        const tokenFactoryTemp = await new ethers.Contract(
            contractAddress.Factory,
            FactoryArtifact.abi,
            provider3.getSigner(0)
        )
        console.log(tokenFactoryTemp)
        setTokenData(tokenFactoryTemp)
    }

    async function deployToken() {
        const provider4 = new ethers.providers.Web3Provider(window.ethereum);
        let account = await provider4.getSigner(0)
        let addr = await account.getAddress()
        // (
        //     "Demo Token",
        //     "DEMO",
        //     1000000,
        //     accounts[0]
        //   )
        console.log(DaoName)
        console.log(TotalSupply)
        let successfulDeploy = await TokenData.deployNewToken(DaoName,'TEST', TotalSupply, addr)
    }

    async function checkNetwork() {
        if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
            return true;
        }
        setNetworkError('Please connect Metamask to Localhost:8545')
        return false;
    }

    if (!Addr) {
        return <div>
            <h1> Connect dat wallet</h1>
            <Button variant="contained" color="primary" onClick={() => connectWallet()} > Connect Wallet</Button>
        </div>
    }


    async function mintFunc() {
        try {
            setTxError('undefined')

            const tx = await TokenData.mint(filAddr, proposalCID)
            setTxBeingSent(tx.hash)
            const receipt = await tx.wait()
            if (receipt.status === 0) {
                throw new Error("Tx failed")
            }
        } catch (error) {
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
                return;
            }
            console.error(error);
            setTxError({ transactionError: error });
        } finally {
            setTxBeingSent({ txBeingSent: undefined });
        }
        submitSpreadTxn(proposalCID)
    }

    async function submitSpreadTxn(proposalCID) {
        console.log("sending to backend")


    }

    /////////////////END ETH CONNECTION///////////////////////////
    /////////////////END ETH CONNECTION///////////////////////////

    /////////////////Start Material UI Stepper///////////////////////////
    /////////////////Start Material UI Stepper///////////////////////////
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getSteps() {
        return ['Welcome','Deploy DAO Token', 'Deposit to Fil<->Polygon Bridge', 'Launch Website!'];
    }
    const handleDaoNameChange = (event) => {
        setDaoName(event.target.value);
      }

    const handleTotalSupplyChange = (event) => {
    setTotalSupply(event.target.value);
    }
    
    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <div>
                        <Card style={{textAlign:'center'}} className={classes.InnerCard}>
                            <h1> So you want to start an internet native organization?</h1>
                            <h4> Follow the instructions to deploy a website and a token</h4>
                            <h4> Our polygon mainnet address is <span style={{color:'purple'}}> 0x82e1882bE43ADb7FA07195a069760449d04A2155 </span> </h4>
                        </Card>
                    </div>

                )
            case 1:
                return (
                    <div>
                        <Card style={{textAlign:'center',color:'white'}} className={classes.InnerCard}>
                            <h4> Please enter DAO name and token supply!</h4>
                            <span style={{color:'orange'}}>
                            <input label="Dao Name" type="text" value={DaoName} onChange={handleDaoNameChange}/>
                            <input label="Total Supply" type="text"  value={TotalSupply} onChange={handleTotalSupplyChange} />
                            {/* <TextField id="standard-basic" label="Dao Name"  color="white" variant="outlined" value={DaoName} onChange={handleDaoNameChange} /> */}
                            </span>
                            {/* <TextField id="standard-basic" label="Total Supply" variant="outlined" value={TotalSupply} onChange={handleTotalSupplyChange} /> */}
                            {/* <h4>  Eth Address : <br/> <span style={{color:'orange'}}> {Addr} </span> </h4> */}
                            <Button onClick={deployToken} className={classes.button}>
                            Launch Token!
                            </Button>
                            <br />
                            {associateSuccess ? <h4> ✅ Awesome Association Made!</h4> : <div></div>}
                          

                        </Card>
                    </div>

                )

            case 2:
                return <div>
                    <Card  className={classes.InnerCard}>
                        <h4> Deposit polygon for filecoin bridge to host your DAOs website </h4>
                        <Button onClick={deployToken} className={classes.button}>
                            Deposit!
                        </Button>
                    </Card>
                </div>;
            case 3:
                return <div>
                    <Card className={classes.InnerCard}>
                        <h4> Publish DAO website to IPFS and make storage deal! </h4>
                        <Button onClick={deployToken} className={classes.button}>
                            Launch!
                        </Button>
                    </Card>
                </div>
            default:
                return 'Unknown step';
        }
    }
    /////////////////End Material UI Stepper///////////////////////////
    /////////////////End Material UI Stepper///////////////////////////

    return (

            <div className={classes.cardContainer}>
                <div style={{width:'100%',position:'absolute', left:'43%', top:'5%',color:'white'}}>
                    <h1>Internet Organization-in-a-Box</h1>
                    </div>    
                <Card >
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    <Typography>{getStepContent(index)}</Typography>
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className={classes.button}
                                            >
                                                Back
                    </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleNext}
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Card>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>Congrats on launching an Internet Native Organization!! Stay tuned for more features</Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
            </Button>
                    </Paper>
                )}
               
            </div>
        
    );

}

//ethers/web3 agnostic implementation
