import {
  Minted as MintedEvent,
  Redeemed as RedeemedEvent,
} from "../generated/SynthereumPool/SynthereumPool"
import {
  PositionCreated as PositionCreatedEvent,
  Redeem as RedeemEvent,
  Repay as RepayEvent,
} from "../generated/CreditLine/CreditLine"
import {
  GlobalFees,
  PoolAccumulatedFees,
  LatestPrice,
  CreditLineAccumulatedFees,
} from "../generated/schema"
import { SynthereumPriceFeed } from "./synthereum-price-feed"
import { BigInt, Bytes, typeConversion, Address } from "@graphprotocol/graph-ts";

const globalFeesId = 'JarvisGlobalFees';
const usdcDecimalConverter = BigInt.fromI64(1000000000000);
const weiScaling = BigInt.fromI64(1000000000000000000);
const synthereumPriceFeedAddress = Address.fromString("0x12F513D977B47D1d155bC5ED4d295c1B10D6D027")

const usdcCollateralContracts = [typeConversion.stringToH160("0x65a7b4Ff684C2d08c115D55a4B089bf4E92F5003"),
typeConversion.stringToH160("0x8734CF40A402D4191BD4D7a64bEeF12E4c452DeF"),
typeConversion.stringToH160("0x36d6D1d6249fbC6EBd0fC28fd46C846fB69b9074"),
typeConversion.stringToH160("0x8aE34663B4622336818e334dC42f92C41eFbfa35"),
typeConversion.stringToH160("0xBE813590e1B191120f5df3343368f8a2F579514C"),
typeConversion.stringToH160("0x06440a2DA257233790B5355322dAD82C10F0389A"),
typeConversion.stringToH160("0xAEc757BF73cc1f4609a1459205835Dd40b4e3F29"),
typeConversion.stringToH160("0xc8442072CF1E131506eaC7df33eA8910e1d5cFDd"),
typeConversion.stringToH160("0x36572797Cc569A74731E0738Ef56e3b8ce3F309c"),
typeConversion.stringToH160("0x1493607042C5725cEf277A83CFC94caA4fc6278F"),
typeConversion.stringToH160("0x72E7Da7C0dD3C082Dfe8f22343D6AD70286e07bd"),
typeConversion.stringToH160("0x4FDA1B4b16f5F2535482b91314018aE5A2fda602"),
typeConversion.stringToH160("0x166e4B3Ec3F81F32f0863B9cD63621181d6bFED5"),
typeConversion.stringToH160("0x25E9F976f5020F6BF2d417b231e5f414b7700E31"),
typeConversion.stringToH160("0x7aC6515f4772fcB6EEeF978f60D996B21C56089D"),
typeConversion.stringToH160("0x7a75624f051041baA74aE4E47724216307c7401D"),
typeConversion.stringToH160("0x874b8d8E818C79166F00b64FB161925e3E95921F"),
typeConversion.stringToH160("0x30E97dc680Ee97Ff65B5188d34Fb4EA20B38D710"),
typeConversion.stringToH160("0x38f3066a3C487556f5be53919f7E75B6ef41E439"),
typeConversion.stringToH160("0x4154550f4Db74Dc38d1FE98e1F3F28ed6daD627d"),
typeConversion.stringToH160("0xcd16DDA43664315B88a7B1d6DDeA3Ae0AA068C23"),
typeConversion.stringToH160("0x49bA729b3146Fbce18ce27acD800703B37a6906b")
]
const wethCollateralContracts = [typeConversion.stringToH160("0x162eD91cb79066B4fE7993c920E2e04f67Cf768E"), typeConversion.stringToH160("0x9Db17967f2C14Beea791a2fd4654f8DdC11D990B"), typeConversion.stringToH160("0xcfA605F06901a176A6FBC2c4BF40Cd6489f89913"), typeConversion.stringToH160("0xE63F878213Dbb7953328614aE69d06D734b40E51"), typeConversion.stringToH160("0x4a117a4343cbE4b0d4F06D21EA3429A1bD865F6b"), typeConversion.stringToH160("0x7bdD9C75C798638915005629A0A735e357fBbd69")]
const maiCollateralContracts = [typeConversion.stringToH160("0xBC988A0146178825C26c255989cfd5083Bae672C")]
const wbtcCollateralContracts = [typeConversion.stringToH160("0xcc6BD078024BE9D391E6F47961B8078dEDd56F23"), typeConversion.stringToH160("0xE85FC097Cb53b0733B47D037EB4DbE5bDC37d085"), typeConversion.stringToH160("0x8ec0BFE71a8bB7a1E174c4c2cFFF6816d675Da58")]
const brlCollateralContracts = [typeConversion.stringToH160("0xfb95Ee2d0B7047A5DF1480e9BAE32b9960B8808f"), typeConversion.stringToH160("0x12BdCE0441fA830376A45aB4f13cE738ba166aBf")]
const cadCollateralContracts = [typeConversion.stringToH160("0xaeD3E56DBe05785345FF8159852aa754c0E281BA"), typeConversion.stringToH160("0x9A25835cBb12C5641aC281Ddb686fb4F8ec2B963"), typeConversion.stringToH160("0xb63926f06744eA0b2C11514818a22ed958665543")]
const chfCollateralContracts = [typeConversion.stringToH160("0x6ffcdc20517b8DA83E7ABe6Fdd836759bEdcF9e6"), typeConversion.stringToH160("0x271913629AbB8C85714454686590c7Af8EA5306F"), typeConversion.stringToH160("0x7E97d28f3d918615F49F0c3a49d4f19b01A1323a")]
const goldCollateralContracts = [typeConversion.stringToH160("0x0725087494Aa23196e37724760416Dd41b481b7c"), typeConversion.stringToH160("0x917FA4c6b9d086011dffAc4495Fb5c3B34fB1042"), typeConversion.stringToH160("0x84647D0231c022eb2d9Ae41C244E7eB0672d0adb")]
const gbpCollateralContracts = [typeConversion.stringToH160("0xcdeaA3bB564954f4ed6a445E5a5Af11100B3fD5D"), typeConversion.stringToH160("0xbEcebC058fc73A702C4AD92A4333E6a0a85A6Bd3"), typeConversion.stringToH160("0xeB6438b9f1Aa968F3673F6BaDad8A081731382d9")]
const maticCollateralContracts = [typeConversion.stringToH160("0x422989ab4Ce1C10336A85207Df020a732Cc29956"), typeConversion.stringToH160("0x005CC40b590030d4511E47FBe3F501E3aE02487B"), typeConversion.stringToH160("0xCe5828119a45f87aD3af8bCbb5a6c581f4dB3BB6")]
const mxnCollateralContracts = [typeConversion.stringToH160("0xcDD27586394eE154749EBd69C590c0C864a9A067"), typeConversion.stringToH160("0x09Bc62655a9461dd74c8C5F7C13Fbc0cA198A7D6")]
const sgdCollateralContracts = [typeConversion.stringToH160("0xcb124c790c2A7F6E2c5E08E652b5323b4A2cd461"), typeConversion.stringToH160("0x5f29FE5586121bEC324642aF595669d78961202e"), typeConversion.stringToH160("0x9850E1c87857716B57c11bFB47C2A5DFc4B9d902")]
const wstethCollateralContracts = [typeConversion.stringToH160("0x89eB60FAa4AF132904748161aAdA014eCb89B213"), typeConversion.stringToH160("0x3b899F9A0F2A54a1Ca0C6aca96851f0414E97D6E"), typeConversion.stringToH160("0x3De43575880EE29F24A0F54061317632E6fF9c05")]
const eurCollateralContracts = [typeConversion.stringToH160("0xB65a07D46eeDf1D2bdb299FB632f6A6232F594e2"), typeConversion.stringToH160("0xF098F3b10980F2Bd6Aba037ea402654adA91a6Ab")]

export function handleMinted(event: MintedEvent): void {
  let globalFeesEntity = GlobalFees.load(globalFeesId)
  let finalValue = computeValue(event.address, event.params.mintvalues.feeAmount)
  poolFees(event.address, event.params.mintvalues.feeAmount, finalValue)
  if (globalFeesEntity == null) {
    let globalFeesEntity = new GlobalFees(globalFeesId)
    globalFeesEntity.totalCreditLineFeesUsd = new BigInt(0)
    globalFeesEntity.totalPoolFeesUsd = finalValue
    globalFeesEntity.totalJarvisFeesUsd = finalValue
    globalFeesEntity.save()
  }
  else {
    globalFeesEntity.totalPoolFeesUsd = globalFeesEntity.totalPoolFeesUsd.plus(finalValue)
    globalFeesEntity.totalJarvisFeesUsd = globalFeesEntity.totalJarvisFeesUsd.plus(finalValue)
    globalFeesEntity.save()
  }
}

export function handleRedeemed(event: RedeemedEvent): void {
  let globalFeesEntity = GlobalFees.load(globalFeesId)
  let finalValue = computeValue(event.address, event.params.redeemvalues.feeAmount)
  poolFees(event.address, event.params.redeemvalues.feeAmount, finalValue)
  if (globalFeesEntity == null) {
    let globalFeesEntity = new GlobalFees(globalFeesId)
    globalFeesEntity.totalCreditLineFeesUsd = new BigInt(0)
    globalFeesEntity.totalPoolFeesUsd = finalValue
    globalFeesEntity.totalJarvisFeesUsd = finalValue
    globalFeesEntity.save()
  } else {
    globalFeesEntity.totalPoolFeesUsd = globalFeesEntity.totalPoolFeesUsd.plus(finalValue)
    globalFeesEntity.totalJarvisFeesUsd = globalFeesEntity.totalJarvisFeesUsd.plus(finalValue)
    globalFeesEntity.save()
  }
}

export function handlePositionCreated(event: PositionCreatedEvent): void {
  let globalFeesEntity = GlobalFees.load(globalFeesId)
  let finalValue = computeValue(event.address, event.params.feeAmount)
  creditLineFees(event.address, event.params.feeAmount, finalValue)
  if (globalFeesEntity == null) {
    let globalFeesEntity = new GlobalFees(globalFeesId)
    globalFeesEntity.totalCreditLineFeesUsd = finalValue
    globalFeesEntity.totalPoolFeesUsd = new BigInt(0)
    globalFeesEntity.totalJarvisFeesUsd = finalValue
    globalFeesEntity.save()
  } else {
    globalFeesEntity.totalCreditLineFeesUsd = globalFeesEntity.totalCreditLineFeesUsd.plus(finalValue)
    globalFeesEntity.totalJarvisFeesUsd = globalFeesEntity.totalJarvisFeesUsd.plus(finalValue)
    globalFeesEntity.save()
  }
}

export function poolFees(poolAddress: Bytes, feeAmountNative: BigInt, feeAmountUsd: BigInt): void {
  let poolFeesEntity = PoolAccumulatedFees.load(poolAddress)
  if (poolFeesEntity == null) {
    let poolFeesEntity = new PoolAccumulatedFees(poolAddress)
    poolFeesEntity.totalPoolFeesNative = feeAmountNative
    poolFeesEntity.totalPoolFeesUsd = feeAmountUsd
    poolFeesEntity.save()
  }
  else {
    poolFeesEntity.totalPoolFeesNative = poolFeesEntity.totalPoolFeesNative.plus(feeAmountNative)
    poolFeesEntity.totalPoolFeesUsd = poolFeesEntity.totalPoolFeesUsd.plus(feeAmountUsd)
    poolFeesEntity.save()
  }
}

export function creditLineFees(creditLineAddress: Bytes, feeAmountNative: BigInt, feeAmountUsd: BigInt): void {
  let creditLineFeesEntity = CreditLineAccumulatedFees.load(creditLineAddress)
  if (creditLineFeesEntity == null) {
    let creditLineFeesEntity = new CreditLineAccumulatedFees(creditLineAddress)
    creditLineFeesEntity.totalCreditLineFeesNative = feeAmountNative
    creditLineFeesEntity.totalCreditLineFeesUsd = feeAmountUsd
    creditLineFeesEntity.save()
  }
  else {
    creditLineFeesEntity.totalCreditLineFeesNative = creditLineFeesEntity.totalCreditLineFeesNative.plus(feeAmountNative)
    creditLineFeesEntity.totalCreditLineFeesUsd = creditLineFeesEntity.totalCreditLineFeesUsd.plus(feeAmountUsd)
    creditLineFeesEntity.save()
  }
}
// TO-DO: update computeValue function to use the SynthereumPriceFeed
export function computeValue(contractAddress: Bytes, value: BigInt): BigInt {
  if (usdcCollateralContracts.includes(contractAddress)) {
    let tempValue = value.times(usdcDecimalConverter)
    return tempValue
  } else if (maiCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x5553444d4149")
    let currentPrice = weiScaling.times(weiScaling).div(priceFeed.getLatestPrice(identifier))
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (wethCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x555344455448")
    let currentPrice = weiScaling.times(weiScaling).div(priceFeed.getLatestPrice(identifier))
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (wbtcCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x555344425443")
    let currentPrice = weiScaling.times(weiScaling).div(priceFeed.getLatestPrice(identifier))
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (brlCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x42524c555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (cadCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x434144555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (chfCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x434846555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (goldCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x584155555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (gbpCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x474250555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (maticCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x5553444d41544943")
    let currentPrice = weiScaling.times(weiScaling).div(priceFeed.getLatestPrice(identifier))
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (mxnCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x4d584e555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (sgdCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x534744555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (eurCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("455552555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  } else if (wstethCollateralContracts.includes(contractAddress)) {
    let priceFeed = SynthereumPriceFeed.bind(synthereumPriceFeedAddress)
    let identifier = Bytes.fromHexString("0x575354455448555344")
    let currentPrice = priceFeed.getLatestPrice(identifier)
    let tempValue = (value.times(currentPrice)).div(weiScaling)
    return tempValue
  }
  else {
    return value
  }
}
