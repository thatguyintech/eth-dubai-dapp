import { Outlet } from "react-router-dom";
import { providers } from "ethers";
import { chain, defaultChains, WagmiProvider } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Connect from "./components/connect";
import Router from "./components/router";

const alchemyProvider = ({ chainId }) =>
  new providers.AlchemyProvider("rinkeby", process.env.REACT_APP_ALCHEMY_API_KEY)

// Chains for connectors to support
const chains = defaultChains

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0]
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  ]
}

export default function App() {
  return (
    <WagmiProvider autoConnect connectors={connectors} provider={alchemyProvider}>
      <div>
        <h1>ETHDubai NFTs</h1>
        <Connect />
        <Router />
        <Outlet />
      </div>
    </WagmiProvider>
  );
}