import { useContractRead, useContractWrite, useProvider } from "wagmi";
import { getABI } from "../utils/abi";

export default function Mint() {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    const contractInterface = getABI();
    const etherscanLink = `https://rinkeby.etherscan.io/address/${contractAddress}`;

    const [{ data: totalMinted, error:totalMintedError, loading:totalMintedLoading}, read] = useContractRead(
        {
            addressOrName: contractAddress,
            contractInterface,
            signerOrProvider: useProvider(),
        },
        "totalSupply",
    );

    const [{ data: owner, error:ownerError, loading:ownerLoading}, ownerCall] = useContractRead(
        {
            addressOrName: contractAddress,
            contractInterface,
            signerOrProvider: useProvider(),
        },
        "owner",
    );

    const [{ data: mintData, error: mintError, loading: mintLoading }, mint ] = useContractWrite(
        {
            addressOrName: contractAddress,
            contractInterface,
        },
        "mint",
    );

    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Mint</h2>
        <p>Pointed at contract: <a href={etherscanLink} target={"_blank"}>{contractAddress}</a></p>
        <button onClick={mint}>Mint 1 Nft</button>
        <p>{totalMinted && totalMinted.toString()} minted</p>
      </main>
    );
  }