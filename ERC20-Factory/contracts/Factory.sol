pragma solidity >=0.4.20;

import "./Token.sol";

contract Factory {
    event TokenCreated(address tokenAddress);

    function deployNewToken(string memory name, string memory symbol, uint totalSupply, address issuer) 
    public returns (address) {
        Token t = new Token(name, symbol, totalSupply, issuer);
        emit TokenCreated(address(t));
    }
}