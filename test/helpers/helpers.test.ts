import hre, { ethers } from "hardhat";
import { BigNumber, Contract, Wallet } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

export const constants = {
  DIAMOND: {
    CUT_ACTIONS: {
      ADD: 0,
      REPLACE: 1,
      REMOVE: 2,
    },
  },
};

export const deployDiamond = async (deployerSigner: SignerWithAddress) => {
  // 1. Deploy DiamondCutFacet
  const DiamondCutFacetFactory = await ethers.getContractFactory(
    "DiamondCutFacet"
  );
  const DiamondCutFacet = await DiamondCutFacetFactory.deploy();

  // 2. Deploy Diamond - needs DiamondCutFacet address as deploy arg
  const DiamondFactory = await ethers.getContractFactory("Diamond");
  const Diamond = await DiamondFactory.deploy(
    deployerSigner.address,
    DiamondCutFacet.address
  );

  // 3. Deploy DiamondInit helper
  const DiamondInitFactory = await ethers.getContractFactory("DiamondInit");
  const DiamondInit = await DiamondInitFactory.deploy();

  // 4. Set up other facets to be added to the Diamond
  const otherFacetNames = ["DiamondLoupeFacet", "OwnershipFacet"];
  const cuts = []; // add facet details here, then execute cuts to add to Diamond

  for (const facetName of otherFacetNames) {
    // 4.1. Deploy the facet
    const factory = await ethers.getContractFactory(facetName);
    const contract = await factory.deploy();
    // 4.2. Add the facet and its function selectors to the cut object
    cuts.push({
      facetAddress: contract.address,
      action: constants.DIAMOND.CUT_ACTIONS.ADD,
      functionSelectors: getFunctionSelectors(contract),
    });
  }

  // 5. Retrieves contract deployed at Diamond address, but uses Cut facet interface to
  // ensure diamondCut function can be called on this contract object
  const DiamondWithCutInterface = await ethers.getContractAt(
    "IDiamondCut",
    Diamond.address
  );

  // 5.1. also calls init() on initDiamond contract in the same Cut call
  const initFunctionCall = DiamondInit.interface.encodeFunctionData("init");
  await DiamondWithCutInterface.connect(deployerSigner).diamondCut(
    cuts,
    DiamondInit.address,
    initFunctionCall
  );

  return Diamond.address
};

export const getFunctionSelectors = (contract: Contract) => {
  const signatures = Object.keys(contract.interface.functions);

  let selectors = [];

  for (const sig of signatures) {
    if (sig !== "init(bytes)") {
      selectors.push(contract.interface.getSighash(sig));
    }
  }

  console.log("selectors", selectors)
  return selectors;
};
