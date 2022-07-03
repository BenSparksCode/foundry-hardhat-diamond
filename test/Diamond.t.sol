// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/upgradeInitializers/DiamondInit.sol";
import "../src/Diamond.sol";
import "../src/facets/DiamondCutFacet.sol";
import "../src/facets/DiamondLoupeFacet.sol";
import "../src/facets/OwnershipFacet.sol";

import "../src/interfaces/IDiamondCut.sol";

contract DiamondTest is Test {

    Diamond d;
    DiamondInit di;
    DiamondCutFacet dcf;
    DiamondLoupeFacet dlf;
    OwnershipFacet dof;

    address owner;

    function deployDiamond() public {
        // 1. Deploy DiamondCutFacet
        dcf = new DiamondCutFacet();

        // 2. Deploy Diamond - needs DiamondCutFacet address as deploy arg
        d = new Diamond(owner, address(dcf));

        // 3. Deploy DiamondInit helper
        di = new DiamondInit();

        // 4. Set up other facets to be added to the Diamond
        IDiamondCut.FacetCut[] memory cuts = new IDiamondCut.FacetCut[](2);
        bytes4[] memory sigs;

        // 4.1. Deploy the additional facets
        dlf = new DiamondLoupeFacet();
        dof = new OwnershipFacet();

        // 4.2. Build function sig array per facet
        // Loupe Facet
        sigs = new bytes4[](4);
        sigs[0] = dlf.facets.selector;
        sigs[1] = dlf.facetFunctionSelectors.selector;
        sigs[2] = dlf.facetAddresses.selector;
        sigs[3] = dlf.facetAddress.selector;

        // 4.3. Add the facets and their function sigs to the cut object
        cuts[0] = IDiamondCut.FacetCut(
            address(dlf),
            IDiamondCut.FacetCutAction.Add,
            sigs
        );

        // Ownership Facet
        sigs = new bytes4[](2);
        sigs[0] = dof.transferOwnership.selector;
        sigs[1] = dof.owner.selector;

        cuts[1] = IDiamondCut.FacetCut(
            address(dof),
            IDiamondCut.FacetCutAction.Add,
            sigs
        );

        // sig = 0x1f931c1c ???
        address(d).call(abi.encodeWithSignature("diamondCut(IDiamondCut.FacetCut[],address,bytes)", cuts, address(di), di.init.selector));

    }

    function setUp() public {
        // d = new Diamond();
        
        deployDiamond();
    }

    function testDeploy() public {
        emit log_address(address(dcf));
        assertTrue(address(dcf) != address(0));

        (bool success, bytes memory data) = address(d).call(abi.encodeWithSignature("facetFunctionSelectors(address)", address(dof)));

        bytes4[] memory sigs = abi.decode(data, (bytes4[]));
        emit log_bytes32(sigs[1]);
    }


}
