import { expect } from "chai";
import hre, { ethers } from "hardhat";
import {
  constants,
  deployDiamond,
  getFunctionSelectors,
} from "./helpers/helpers.test";
import {
  DiamondCutFacet,
  DiamondLoupeFacet,
  OwnershipFacet,
} from "../typechain-types/src/facets";

// import ERC20_ABI from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";

describe("Diamond Tests", () => {
  let owner, alice;
  let diamondAddress: string;
  let DiamondCutFacet: DiamondCutFacet;
  let DiamondLoupeFacet: DiamondLoupeFacet;
  let OwnershipFacet: OwnershipFacet;

  beforeEach(async () => {
    [owner, alice] = await ethers.getSigners();

    // Retrieve Diamond address from the deployed set
    diamondAddress = await deployDiamond(owner);
    // Instantiate interface-shaped contracts for facets, passing in Diamond address for each
    DiamondCutFacet = await ethers.getContractAt(
      "DiamondCutFacet",
      diamondAddress
    );
    DiamondLoupeFacet = await ethers.getContractAt(
      "DiamondLoupeFacet",
      diamondAddress
    );
    OwnershipFacet = await ethers.getContractAt(
      "OwnershipFacet",
      diamondAddress
    );
  });

  describe.only("Deployment Tests", () => {
    it("Diamond has 3 facets", async () => {
      const expectedFacetDeployCount = 3;
      const facetAddresses = await DiamondLoupeFacet.facetAddresses();
      expect(facetAddresses.length).to.equal(expectedFacetDeployCount);
    });

    it("Facets should have correct function selectors", async () => {
      const facetAddresses = await DiamondLoupeFacet.facetAddresses();

      // 1. DiamondCutFacet selectors
      let expectedSelectors = getFunctionSelectors(DiamondCutFacet);
      let actualSelectors = await DiamondLoupeFacet.facetFunctionSelectors(
        facetAddresses[0]
      );
      expect(expectedSelectors.toString()).to.equal(actualSelectors.toString());

      // 2. DiamondLoupeFacet selectors
      expectedSelectors = getFunctionSelectors(DiamondLoupeFacet);
      actualSelectors = await DiamondLoupeFacet.facetFunctionSelectors(
        facetAddresses[1]
      );
      expect(expectedSelectors.toString()).to.equal(actualSelectors.toString());

      // 3. OwnershipFacet selectors
      expectedSelectors = getFunctionSelectors(OwnershipFacet);
      actualSelectors = await DiamondLoupeFacet.facetFunctionSelectors(
        facetAddresses[2]
      );
      expect(expectedSelectors.toString()).to.equal(actualSelectors.toString());
    });
  });

  describe("Cut Facet Tests - ADD", () => {
    it("Test 1", async () => {
      // TODO
    });
  });
});
