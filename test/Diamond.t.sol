// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/upgradeInitializers/DiamondInit.sol";
import "../src/Diamond.sol";
import "../src/facets/DiamondCutFacet.sol";
import "../src/facets/DiamondLoupeFacet.sol";
import "../src/facets/OwnershipFacet.sol";

contract DiamondTest is Test {

    Diamond d;
    DiamondInit di;
    DiamondCutFacet dcf;
    DiamondLoupeFacet dlf;
    OwnershipFacet dof;


    function setUp() public {
        // d = new Diamond();
        dcf = new DiamondCutFacet();
    }

    function testDeploy() public {
        emit log_address(address(dcf));
        assertTrue(address(dcf) != address(0));
    }
}
