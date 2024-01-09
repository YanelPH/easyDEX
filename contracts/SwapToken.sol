// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.7.0 < 0.9.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SingleSwapToken {

    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1D18E0157C05861564);

    address public constant DAI = 0x2bcAE8205a77dabB2479CF2c85ded7d963101B86;
    address public WETH9 = 0xEF1DACBce5194C668BEe55f2ca599F366709db0C;
    address public USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    
    
    function swapExactInputString(uint amountIn)external returns (uint amountOut){
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn : WETH9,
            tokenOut: DAI,

            fee:3000,//should be dynamic
            recipient:  msg.sender,
            deadline: block.timestamp,
            amountIn: amountIn,
            amountOutMinimum: 0, //Should be never 0
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactInputString(uint amountOut, uint amountInMaximum) external returns(uint amountIn){
        TransferHelper.safeTransferFrom(WETH9, msg.sender,address(this), amountInMaximum);
        TransferHelper.safeApprove(WETH9, address(this), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams({
            tokenIn : WETH9,
            tokenOut: DAI,

            fee:3000,//should be dynamic
            recipient:  msg.sender,
            deadline: block.timestamp,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum, //Should be never 0
            sqrtPriceLimitX96: 0
        });

        amountIn = swapRouter.exactOutputSingle(params);
        if(amountIn < amountInMaximum){
            TransferHelper.safeApprove(WETH9, address(swapRouter),0);
            TransferHelper.safeTransfer(WETH9, msg.sender, amountInMaximum - amountIn);
        }

    }
}

