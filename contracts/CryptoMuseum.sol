pragma solidity >=0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CryptoMuseum is ERC721 {
    constructor() ERC721("CryptoMuseum", "CM") public {
    }

    mapping(uint256 => string) private _CIDS;

    function CID(uint256 tokenId) public view returns (string memory) {
      require(_exists(tokenId), "ERC721Metadata: CID query for nonexistent token");

      string memory _CID = _CIDS[tokenId];

      return _CID;
    }

    function _setTokenCID(uint256 tokenId, string memory _CID) internal virtual {
      require(_exists(tokenId), "ERC721Metadata: CID set of nonexistent token");
      _CIDS[tokenId] = _CID;
    }


    function mint(string memory _CID) public {
      uint256 _newId = totalSupply() + 1;
      _safeMint(msg.sender, _newId);
      _setTokenCID(_newId, _CID);
    }
}