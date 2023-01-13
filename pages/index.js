import { useConnectors, useAccount } from "@starknet-react/core";
import { Provider, Contract, Account, ec, json } from "starknet";

const getTokenContract = async () => {
  const provider = new Provider({ sequencer: { network: "goerli-alpha" } });
  // Connect the deployed Test contract in Tesnet
  const testAddress =
    "0x07d5fc532536537f907af8a948403519f9a75ab15c36cb7b945e3ac390b9a1b1";
  // read abi of Test contract
  const { abi: testAbi } = await provider.getClassAt(testAddress);
  if (testAbi === undefined) {
    throw new Error("no abi.");
  }
  const myTestContract = new Contract(testAbi, testAddress, provider);
  return myTestContract;
};


const allow = async (account) => {
  const tokenContract = await getTokenContract();
  tokenContract.connect(account)
  console.log(tokenContract);
  const allow = await tokenContract.invoke("request_allowlist");
  
};

const getTokens = async (account) => {
  const tokenContract = await getTokenContract();
  tokenContract.connect(account)
  const handle = await tokenContract.invoke("get_tokens");
};


export default function Home() {
  const { account, address, status } = useAccount()
  const {connect, connectors} = useConnectors()
  return (
    <>
    <h1>App</h1>
    <ul>
      {connectors.map((connector) => (
        <li key={connector.id()}>
          <button onClick={() => connect(connector)}>
            Connect {connector.id()}
          </button>
        </li>
      ))}
    </ul>
    <div>
      <button onClick={() => allow(account)}>permission</button>
      <button onClick = {() =>getTokens(account)}>getTokens</button>
    </div>
    </>
  )
}
