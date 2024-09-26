// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './MerkleDistributorWithDeadline.sol';
import '@openzeppelin/contracts/proxy/Clones.sol';

contract MerkleDistributorFactory {
    using Clones for address;

    event MerkleDistributorCreated(address indexed proxy, string kind);

    MerkleDistributor public instance;
    MerkleDistributorWithDeadline public instanceWithDeadline;

    constructor() {
        instance = new MerkleDistributor();
        instanceWithDeadline = new MerkleDistributorWithDeadline();
    }

    function createDistributor(
        address token_,
        bytes32 merkleRoot_,
        address signer_,
        uint256 totalBalance_
    ) external returns (MerkleDistributor) {
        MerkleDistributor distributor = MerkleDistributor(address(instance).clone());

        distributor.initialize(token_, merkleRoot_, signer_);
        IERC20(token_).transferFrom(msg.sender, address(distributor), totalBalance_);

        emit MerkleDistributorCreated(address(distributor), 'MerkleDistributor');

        return distributor;
    }

    function createDistributorWithDeadline(
        address token_,
        bytes32 merkleRoot_,
        address signer_,
        uint256 endTime_,
        uint256 totalBalance_
    ) external returns (MerkleDistributorWithDeadline) {
        MerkleDistributorWithDeadline distributor = MerkleDistributorWithDeadline(
            address(instanceWithDeadline).clone()
        );

        distributor.initialize(token_, merkleRoot_, endTime_, signer_);
        IERC20(token_).transferFrom(msg.sender, address(distributor), totalBalance_);

        emit MerkleDistributorCreated(address(distributor), 'MerkleDistributorCreated');

        return distributor;
    }
}
