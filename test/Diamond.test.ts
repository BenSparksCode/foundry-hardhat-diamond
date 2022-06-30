import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { constants, deployDiamond } from "./helpers/helpers.test";

// import ERC20_ABI from "../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";

describe("Diamond Tests", () => {
  let owner, alice;

  let ContractFactory;
  let Contract;

  beforeEach(async () => {
    [owner, alice] = await ethers.getSigners();

    await deployDiamond(owner);
  });

  describe.only("Deployment Tests", () => {
    it.only("Diamond has 3 facets", async () => {
      // TODO

      
    });

    it("Facets should have correct function selectors", async () => {
      // TODO
    });

    it("Function selectors are associated with correct facet addresses", async () => {
      // TODO
    });
  });

  describe("Cut Facet Tests - ADD", () => {
    it("Test 1", async () => {
      // TODO
    });
  });
});
