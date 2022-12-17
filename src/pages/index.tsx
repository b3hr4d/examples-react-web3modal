import { useWeb3Modal, Web3Button, Web3Modal } from "@web3modal/react"
import { utils } from "ethers"
import { useEffect } from "react"
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

  useEffect(() => {
    const handleTrustWallet = () => {
      console.log("handleTrustWallet")
      if (
        document.visibilityState === "hidden" &&
        navigator.userAgent.includes("Mac") &&
        "ontouchend" in document
      ) {
        const deepLink = window.localStorage.getItem(
          "WALLETCONNECT_DEEPLINK_CHOICE"
        )
        if (deepLink) {
          try {
            const _deepLink: { name: string; href: string } =
              JSON.parse(deepLink)
            if (_deepLink.href.includes("trust")) {
              window.localStorage.setItem(
                "WALLETCONNECT_DEEPLINK_CHOICE",
                JSON.stringify({ name: "Trust Wallet", href: "trust://" })
              )
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            console.log("TrustWallet force redirect err", err)
          }
        }
      }
    }

    // Hook up the event handler
    document.addEventListener("visibilitychange", handleTrustWallet)
    return () => {
      // Remove the handler when the component unmounts
      document.removeEventListener("visibilitychange", handleTrustWallet)
    }
  }, [])

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
        mobileWallets={[
          {
            id: "trust",
            name: "Trust Wallet",
            links: {
              native: "trust://",
              universal: "https://link.trustwallet.com/",
            },
          },
          {
            id: "metamask",
            name: "MetaMask",
            links: {
              native: "metamask://",
              universal: "https://metamask.app.link/",
            },
          },
        ]}
        // Custom Linking Desktop Wallets
        desktopWallets={[
          {
            id: "ledger",
            name: "Ledger",
            links: {
              native: "ledgerlive://",
              universal: "https://www.ledger.com",
            },
          },
          {
            id: "zerion",
            name: "Zerion",
            links: {
              native: "zerion://",
              universal: "https://wallet.zerion.io",
            },
          },
          {
            id: "tokenary",
            name: "Tokenary",
            links: { native: "tokenary://", universal: "https://tokenary.io" },
          },
          {
            id: "oreid",
            name: "OREID",
            links: {
              native: "",
              universal: "https://www.oreid.io/",
            },
          },
        ]}
        // Custom Wallet Images
        walletImages={{
          metaMask: "/images/wallet_metamask.webp",
          brave: "/images/wallet_brave.webp",
          ledger: "/images/wallet_ledger.webp",
          coinbaseWallet: "/images/wallet_coinbase.webp",
          zerion: "/images/wallet_zerion.webp",
          trust: "/images/wallet_trust.webp",
          rainbow: "/images/wallet_rainbow.webp",
          oreid: "/images/wallet_oreid.svg",
        }}
        // Custom Chain Images
        chainImages={{
          137: "/images/chain_polygon.webp",
          10: "/images/chain_optimism.webp",
          42161: "/images/chain_arbitrum.webp",
        }}
      />
    </>
  )
}
