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
  }
}

export const deployDiamond = async (deployerSigner: SignerWithAddress) => {
    // 1. Deploy DiamondCutFacet
    const DiamondCutFacetFactory = await ethers.getContractFactory(
      "DiamondCutFacet"
    );
    const DiamondCutFacet = await DiamondCutFacetFactory.deploy();
  
    // 2. Deploy Diamond
    const DiamondFactory = await ethers.getContractFactory("Diamond");
    const Diamond = await DiamondFactory.deploy(
      deployerSigner.address,
      DiamondCutFacet.address
    );
  
    // TODO delete
    console.log(getFunctionSelectors(Diamond));
  
    // 3. Deploy DiamondInit helper
    const DiamondInitFactory = await ethers.getContractFactory("DiamondInit");
    const DiamondInit = await DiamondInitFactory.deploy();
  
    // 4. Deploy all other facets
    const otherFacetNames = ["DiamondLoupeFacet", "OwnershipFacet"];
    const cut = []; // add facet details here, then execute cuts to add to Diamond
  
    console.log("facets:", otherFacetNames);
  
    for (const facetName of otherFacetNames) {
      console.log(facetName);
      const factory = await ethers.getContractFactory(facetName);
      const contract = await factory.deploy();
      cut.push({
        facetAddress: contract.address,
        action: constants.DIAMOND.CUT_ACTIONS.ADD,
        functionSelectors: getFunctionSelectors(contract),
      });
    }
  
    // 4. Set up Facet cuts to be applied to Diamond
  
    // 5. Apply cuts to Diamond
  };

  export const getFunctionSelectors = (contract: Contract) => {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce((acc, val) => {
    console.log(val);
    if (val !== "init(bytes)") {
      // acc.push(contract.interface.getSighash(val))
    }
    return acc;
  }, []);
  // TODO add this back when needed
  // selectors.contract = contract;
  // selectors.remove = remove;
  // selectors.get = get;
  return selectors;
};
  