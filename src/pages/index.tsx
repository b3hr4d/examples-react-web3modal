import { useWeb3Modal, Web3Button, Web3Modal } from "@web3modal/react"
import { utils } from "ethers"
import { useAccount } from "wagmi"
import useEthereum from "../hooks/useEthereum"
import { ethereumClient } from "./_app"

export default function CustomPage() {
  const { isConnected } = useAccount()
  const { open } = useWeb3Modal()

  const { getSignature, signer } = useEthereum()

  const sendTransaction = async () => {
    const erc20 = new utils.Interface([
      "function approve(address spender, uint256 amount) external returns (bool)",
    ])

    const tx = await signer.sendTransaction({
      to: "0x0000000000000000000000000000000000000000",
      data: erc20.encodeFunctionData("approve", [
        "0x0000000000000000000000000000000000000000",
        "10000000000000000000000",
      ]),
    })

    await tx.wait(1)
  }

  return (
    <>
      {/* Use predefined button */}
      <Web3Button />

      {/* Use custom button */}
      {!isConnected ? (
        <>
          <button onClick={() => open()}>Or Use Custom Button</button>
        </>
      ) : (
        <>
          <button onClick={() => getSignature()}>Get Signature</button>
          <button onClick={sendTransaction}>Send Transaction</button>
        </>
      )}

      <Web3Modal
        ethereumClient={ethereumClient}
        projectId={process.env.NEXT_PUBLIC_PROJECT_ID}
      />
    </>
  )
}
