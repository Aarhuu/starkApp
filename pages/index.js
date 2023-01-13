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
  tokenContract.connect(account);
  console.log(tokenContract);
  const allow = await tokenContract.invoke("request_allowlist");
};

const getTokens = async (account) => {
  const tokenContract = await getTokenContract();
  tokenContract.connect(account);
  const handle = await tokenContract.invoke("get_tokens");
};

export default function Home() {
  const { account, address, status } = useAccount();
  const { connect, connectors } = useConnectors();
  return (
    <div>
      <div className="flex flex-row justify-between w-screen text-xl p-4">
        <h1 className="text-3xl font-bold">Token App</h1>
        <div className="flex flex-row">
          {connectors.map((connector) => (
            <div key={connector.id()} className="">
              <button
                onClick={() => connect(connector)}
                className="bg-orange-500 ml-2 p-2 rounded-xl hover:bg-black hover:text-orange-500"
              >
                Connect {connector.id()}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col mt-60 align-middle items-center">
        <button
          onClick={() => allow(account)}
          className="bg-orange-500 p-2 w-fit rounded-xl animate-bounce font-bold hover:bg-black hover:text-orange-500"
        >
          Get whitelisted
        </button>
        <button
          onClick={() => getTokens(account)}
          className="bg-orange-500 p-2 w-fit rounded-xl mt-8 font-bold hover:bg-black hover:text-orange-500"
        >
          Mint Tokens!
        </button>
      </div>
    </div>
  );
}
