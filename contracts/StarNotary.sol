// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721{
    /**
     * @dev Stuct `Star`: It contains all the details of the star
     * @param name: Name of the Star
     */

    struct Star{
        string name;
    }
    /**
     * @dev `starTokenToStarInfo`: It's a mapping of `_tokenId` to `Star`
     * uint256: The `_tokenId` of the Star
     * Star: The `Star` struct
     */
    mapping(uint256 => Star) public starTokenToStarInfo;

    /**
     * @dev `_starsForSell`: It's a mapping of `_tokenId` to `_price`
     * uint256: The `_tokenId` of the Star
     * uint256: The `_price` of the Star in wei
     */
     mapping(uint256 => uint256) public starsForSell;

     constructor() ERC721('Decentralize Starnotary App', 'DSA'){}

    /**
     * @dev `createStar`: It will create a new Star with the given tokenId
     * @param _starName: The name of the Star
     * @param _tokenId: The unique tokenId of the Star
     * @return bool: `true` as success
     * It will create a new `Star` struct then assign `_starTokenToStarInfo[_tokenId]` to new Star
     * Then mint `_tokenId` to sender
     */
    function createStar(string calldata _starName, uint256 _tokenId) public returns(bool) {
        Star memory newStar = Star(_starName);
        starTokenToStarInfo[_tokenId] = newStar;
        _mint(msg.sender, _tokenId);
        return true;
    }

    /**
     * @dev `putStarUpForSale`: It will put your star for sale
     * @param _tokenId: The id of star
     * @param _price: The price of the star
     * @return bool: `true` as success
     * It will check if star owner is `msg.sender` and `_price` then assign `_starsForSell[_tokenId]` to `_price`
     */
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public returns(bool) {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell the Star you don't owned");
        require(_price > 0, "You can't sell the Star at zero price");
        starsForSell[_tokenId] = _price;
        return true;
    }

    /**
     * @dev `buyStar`: It's for buying a new Star which are already for sale
     * @param _tokenId: The tokenId of the star
     * @return bool: `true` as success
     * At first it will check if `msg.vale` greater than or equals to the Star price. After that transfer the star ownership
     * to new buyer. Then, transfer the ether to seller and rest ether back to buyer.
     */
    function buyStar(uint256 _tokenId) public payable returns(bool){
        uint256 _starPrice = starsForSell[_tokenId];
        address _starOwner = ownerOf(_tokenId);
        require(msg.value >= _starPrice, "Try to send corrent ammout");
        _transfer(_starOwner, msg.sender, _tokenId);
        payable(_starOwner).transfer(_starPrice);
        if(msg.value > _starPrice){
            payable(msg.sender).transfer(msg.value - _starPrice);
        }
        return true;
    }

    /**
     * @dev `lookUptokenIdToStarInfo`: It returns the `name` from `Star` struct on the basis of token id
     * @param _tokenId: The token id of `Star` struct.
     * @return string meory: _starTokenToStarInfo[_tokenid].name
     */
    
    function lookUptokenIdToStarInfo(uint256 _tokenId) public view returns(string memory){
        return starTokenToStarInfo[_tokenId].name;
    }

    /**
     * @dev `exchangeStars`: It exchange the `Star` owner between two owner
     * @param _tokenId1: The token id of first token
     * @param _tokenId2: The token id of second token
     * @return bool: true as success
     * It checks if `msg.sender` is the owner of `_tokenId1` or `_tokenId2`. Then change their ownership to other
     */
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public returns(bool){
        require(
            ownerOf(_tokenId1) == msg.sender || ownerOf(_tokenId2) == msg.sender,
            "You are not a owner of any of these two tokens"
        );
        address _tokenOwnerOfId1 = ownerOf(_tokenId1);
        address _tokenOwnerOfId2 = ownerOf(_tokenId2);
        transferFrom(_tokenOwnerOfId1, _tokenOwnerOfId2, _tokenId1);
        transferFrom(_tokenOwnerOfId2, _tokenOwnerOfId1, _tokenId2);

        return true;
    }

    /**
     * @dev `transferStar`: It transfers the token ownership to another address
     * @param _to: The new owner address
     * @param _tokenId: The token id of the `Star`
     * @return bool: true as success
     * It checks the ownership of `msg.sender` first the transfers the ownership to new owner
     */
    function transferStar(address _to, uint256 _tokenId) public returns(bool){
        require(ownerOf(_tokenId) == msg.sender, "You can't transfer which you don't own");
        _transfer(msg.sender, _to, _tokenId);
        return true;
    }

}