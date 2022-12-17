import { useWeb3Modal, Web3Button } from "@web3modal/react"
import { utils } from "ethers"
import { useAccount } from "wagmi"
import ThemeControls from "../components/ThemeControls"
import useEthereum from "../hooks/useEthereum"

export default function HomePage() {
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
      <div className="container">
        {/* Use predefined button */}
        <Web3Button />

        {/* Alternatively Use custom button */}
        {!isConnected ? (
          <button onClick={() => open()}>Custom</button>
        ) : (
          <>
            <button onClick={() => getSignature()}>Get Signature</button>
            <button onClick={sendTransaction}>Send Transaction</button>
          </>
        )}
      </div>

      <ThemeControls />
    </>
  )
}
