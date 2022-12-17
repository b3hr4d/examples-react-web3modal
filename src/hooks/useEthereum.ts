import { ethers } from "ethers"
import { useCallback, useEffect, useState } from "react"
import { ethereumClient } from "../pages/_app"
import HiVPN from "./contracts"

const handleWalletConnectDeepLink = () => {
  const deepLink = window.localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE")
  if (deepLink) {
    try {
      const _deepLink: { name: string; href: string } = JSON.parse(deepLink)
      if (_deepLink.href === "https://link.trustwallet.com/wc") {
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

const useEthereum = () => {
  const [{ isConnected, address, connector }, setAccount] = useState<any>({
    isConnected: false,
    address: null,
    connector: {},
  })

  const [etherLoading, setLoading] = useState(false)
  const [chainId, setChainId] = useState<number>(56)
  const [signer, setSigner] = useState<any>(null)
  const [contract, setContract] = useState<ethers.Contract>()
  const [etherError, setError] = useState<any>(null)
  const [signature, setSignature] = useState<string>("")

  useEffect(() => {
    ethereumClient.watchAccount((account) => {
      handleWalletConnectDeepLink()
      setLoading(true)
      console.log("account changed", account.address)
      account.connector?.getSigner().then((signer: any) => {
        setSigner(signer)
        setSignature("")
        Promise.all([signer.getChainId()])
          .then(([chainId]) => {
            setChainId(chainId)

            const contract = new ethers.Contract(
              "0x825a926a56c6E8bAf7e85c49fCBD2119897C0e74",
              HiVPN.abi,
              signer
            )

            setContract(contract)
            setLoading(false)
          })
          .catch((err) => {
            console.log(err)
            setLoading(false)
          })
      })

      setAccount(account)
    })
  }, [])

  const getSignature = useCallback(async () => {
    if (!signer) return
    setLoading(true)
    signer
      .signMessage("TEST")
      .then((signature: string) => {
        setSignature(signature)
        setLoading(false)
      })
      .catch((err: any) => {
        console.log(err)
        setLoading(false)
      })
  }, [signer])

  const disconnect = () => {
    ethereumClient.disconnect()
  }

  return {
    etherError,
    address,
    signer,
    isConnected,
    disconnect,
    getSignature,
    signature,
    chainId,
    connector,
    etherLoading,
    contract,
  }
}

export default useEthereum
