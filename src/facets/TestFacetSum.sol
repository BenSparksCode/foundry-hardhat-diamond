// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract TestFacetSum {
    function executeOperation(uint256 x, uint256 y) external pure returns (uint256) {
        return x + y;
    }

    function test1() external {}

    function supportsInterface(bytes4 _interfaceID) external view returns (bool) {}
}
