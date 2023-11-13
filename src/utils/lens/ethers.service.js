import { ethers, utils, Wallet } from 'ethers'
import { MUMBAI_RPC_URL, PK } from './config'
import omitDeep from 'omit-deep'

export const omit = (object, name) => {
  return omitDeep(object, name)
}

export const ethersProvider = new ethers.providers.JsonRpcProvider(MUMBAI_RPC_URL)

export const getProvider = () => {
  return new ethers.providers.Web3Provider(window.ethereum)
}

export const getSigner = () => {
  // if (typeof window == 'undefined')
  // return new Wallet(PK, ethersProvider)
  return getProvider().getSigner()
}

export const getAddressFromSigner = () => {
  return getSigner().address
}

export const signedTypeData = async (domain, types, value) => {
  const signer = getSigner()

  // remove the __typedname from the signature!
  const result = await signer._signTypedData(
    omit(domain, '__typename'),
    omit(types, '__typename'),
    omit(value, '__typename')
  )

  return result
}

export const splitSignature = (signature) => {
  return utils.splitSignature(signature)
}

export const sendTx = (transaction) => {
  const signer = getSigner()
  return signer.sendTransaction(transaction)
}

export const signText = (text) => {
  return getSigner().signMessage(text)
}
