import { BigNumber, utils } from 'ethers'
import { v4 as uuidv4 } from 'uuid'
import { apolloClient } from './apollo-client'
import { login } from './authentication/login'
import { PROFILE_ID } from './config'
import { getAddressFromSigner, signedTypeData, splitSignature } from './ethers.service'
import { CreatePostTypedDataDocument, PublicationMainFocus } from './graphql/generated'
import { pollUntilIndexed } from './indexer/has-transaction-been-indexed'
import { Metadata } from './interfaces/publication'
import { uploadIpfs } from './ipfs'
import { lensHub } from './lens-hub'

const prefix = 'create post'
export const createPostTypedData = async (request) => {
  const result = await apolloClient.mutate({
    mutation: CreatePostTypedDataDocument,
    variables: {
      request
    }
  })

  return result.data.createPostTypedData
}

export const signCreatePostTypedData = async (request) => {
  const result = await createPostTypedData(request)
  console.log('create post: createPostTypedData', result)

  const typedData = result.typedData
  console.log('create post: typedData', typedData)

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value)
  console.log('create post: signature', signature)

  return { result, signature }
}

export const pollAndIndexPost = async (txHash, profileId, prefix) => {
  console.log(`${prefix}: poll until indexed`)
  const indexedResult = await pollUntilIndexed({ txHash })

  console.log(`${prefix}: profile has been indexed`)

  const logs = indexedResult.txReceipt.logs

  console.log(`${prefix}: logs`, logs)

  const topicId = utils.id(
    'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
  )
  console.log('topicid we care about', topicId)

  const profileCreatedLog = logs.find((l) => l.topics[0] === topicId)
  console.log(`${prefix}: created log`, profileCreatedLog)

  let profileCreatedEventLog = profileCreatedLog.topics
  console.log(`${prefix}: created event logs`, profileCreatedEventLog)

  const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0]

  const contractPublicationId = BigNumber.from(publicationId).toHexString()

  const internalPublicationId = profileId + '-' + contractPublicationId

  console.log(`${prefix}: contract publication id`, contractPublicationId)
  console.log(`${prefix}: internal publication id`, internalPublicationId)
  return internalPublicationId
}

const createPost = async () => {
  const profileId = PROFILE_ID
  console.log(profileId)
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this')
  }

  const address = getAddressFromSigner()
  console.log(`${prefix}: address`, address)

  await login(address)

  const ipfsResult =
    (await uploadIpfs) <
    Metadata >
    {
      version: '2.0.0',
      mainContentFocus: PublicationMainFocus.TextOnly,
      metadata_id: uuidv4(),
      description: 'desc2',
      locale: 'en-US',
      content: 'Content2',
      external_url: null,
      image: null,
      imageMimeType: null,
      name: 'Name2',
      attributes: [],
      tags: ['using_api_examples', 'api-stone-1', 'p2', 'p2-test'],
      appId: 'api-stone'
    }
  console.log(`${prefix}: ipfs result`, ipfsResult)

  // hard coded to make the code example clear
  const createPostRequest = {
    profileId,
    contentURI: `ipfs://${ipfsResult.path}`,
    collectModule: {
      freeCollectModule: { followerOnly: true }
    },
    referenceModule: {
      followerOnlyReferenceModule: false
    }
  }

  const signedResult = await signCreatePostTypedData(createPostRequest)
  console.log(`${prefix}: signedResult`, signedResult)

  const typedData = signedResult.result.typedData

  const { v, r, s } = splitSignature(signedResult.signature)

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline
    }
  })
  console.log(`${prefix}: tx hash`, tx.hash)

  await pollAndIndexPost(tx.hash, profileId, prefix)
}

// test
createPost()
