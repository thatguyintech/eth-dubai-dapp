import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const web3 = createAlchemyWeb3(
  `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
);

const alchemy = web3.alchemy;

export default function MyNFTs() {
    const [fetchedNFTs, setFetchedNFTs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })

    useEffect(() => {
        if (accountData) {
          alchemy.getNfts({owner: accountData.address, contractAddresses: [process.env.REACT_APP_CONTRACT_ADDRESS]})
            .then(resp => {
              return resp.ownedNfts.map(nft =>
              ({
                name: nft.metadata.name,
                image: nft.media[0].gateway,
                tokenId: nft.id.tokenId 
              })
            )})
            .then(resp => setFetchedNFTs(resp))
            .finally(() => {
                setLoading(false);
            });
        }
    }, [])

    return (
        <div style={{ display: "flex" }}>
          <nav
            style={{
                display: "flex",
              padding: "1rem",
            }}
          >
              <div style={{flexDirection: "column"}}>
            {loading && <p>loading...</p>}
            {!loading && fetchedNFTs && fetchedNFTs.map((nft) => (
                <div style={{flexDirection: "column", display: "flex", padding: 5}} key={nft.tokenId}>
                    <div>{nft.name}</div>
                    <img src={nft.image} style={{display: "flex", height:300, width:300}}/>
                </div>
            ))}
              </div>
          </nav>
          <Outlet/>
        </div>
      );
  }