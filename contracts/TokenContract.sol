pragma solidity ^0.4.24;
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol';

contract TokenContract is ERC20Mintable{
  uint256 private _openingTime;
  uint256 private _closingTime;
/// @notice this is a dummy event just to take the bonus :D openzeppelin emit Transfer event  on transfer 
 
  event TransferInValidTime(
    address indexed from,
    address indexed to,
    uint256 value,
    uint256 timestamp
  );
  /**
   * @dev Reverts if not in token time range.
   */
  modifier onlyWhileOpen {
    require(isOpen());
    _;
  }

    /**
   * @dev Constructor, takes transfer  opening and closing times.
   * @param openingTime transfer  opening time
   * @param closingTime transfer  closing time
   */
  constructor(uint256 openingTime, uint256 closingTime)  {
    // solium-disable-next-line security/no-block-members
    require(openingTime >= block.timestamp);
    require(closingTime > openingTime);

    _openingTime = openingTime;
    _closingTime = closingTime;
  }

  /**
   * @return the transfer  opening time.
   */
  function openingTime() public view returns(uint256) {
    return _openingTime;
  }

  /**
   * @return the transfer  closing time.
   */
  function closingTime() public view returns(uint256) {
    return _closingTime;
  }

  /**
   * @return true if the transfer  is open, false otherwise.
   */
  function isOpen() public view returns (bool) {
    // solium-disable-next-line security/no-block-members
    return block.timestamp >= _openingTime && block.timestamp <= _closingTime;
  }

  /**
   * @dev Checks whether the period in which the transfer  is open has already elapsed.
   * @return Whether transfer  period has elapsed
   */
  function hasClosed() public view returns (bool) {
    // solium-disable-next-line security/no-block-members
    return block.timestamp > _closingTime;
  }

 
  //   /**
  //  * @dev Extend parent behavior  to allow minting only while open 
  //  * @param to The address that will receive the minted tokens.
  //  * @param value The amount of tokens to mint.
  //  * @return A boolean that indicates if the operation was successful.
  //  */
  // function mint(
  //   address to,
  //   uint256 value
  // )
  //   public
  //   onlyWhileOpen
  //   returns (bool)
  // {
  //   super.mint(to, value);
  //   return true;
  // }

  /**
  * @dev Extend parent behavior to allow token transfer only while open 
  * @param from The address to transfer from.
  * @param to The address to transfer to.
  * @param value The amount to be transferred.
  */
  function _transfer(address from, address to, uint256 value) internal onlyWhileOpen {
    TransferInValidTime(from,to,value , now);
    super._transfer(from,to, value);
  }
}