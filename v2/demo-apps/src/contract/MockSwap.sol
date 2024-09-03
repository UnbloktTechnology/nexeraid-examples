// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;


contract MockSwap {

    event SwapNativeForUSDT(
        address indexed user,
        uint256 nativeAmount,
        uint256 usdtAmount
    );

    function swapNativeForUSDT() payable public {
        emit SwapNativeForUSDT(msg.sender, msg.value, msg.value * 1000);
    }
}