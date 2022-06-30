// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/Diamond.sol";

contract DiamondTest is Test {
    Diamond d;

    function setUp() public {
        // d = new Diamond();
    }

    function testName() public {
        assertEq(true, true);
    }
}
