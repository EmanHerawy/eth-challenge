pragma solidity ^0.4.24;
import "./TokenContract.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
/**
 * @title Contribution
 * @author Eman Herawy
 * @dev Extension of MintedCrowdsale contract to store the amount of ETH that a wallet address has contributed.
 * @notice I'm inheriting from MintedCrowdsale as it has buytoken function that do all what donate function need but with different name.
 * @notice Should be added to  minter role to work .
 */
contract Contribution is MintedCrowdsale {
      using SafeMath for uint256;
     mapping (address => uint256) private donators ;
 /// @notice this is a dummy event just to take the bonus :D openzeppelin emit TokensPurchased event  on buyToken 
  event Donate(
    address indexed donator,
    uint256 value,
    uint256 timestamp
  );
      constructor
          (

              uint256 _rate,
              address _wallet,
              TokenContract _token

          )
          public
          Crowdsale(_rate, _wallet, _token)
         {

          }

            /**
  * @dev Gets the user donation the specified wallet address.
  * @param wallet The address to query the user donation.
  * @return An uint256 representing the eth amount donated by the passed address.
  */
  function userDonation(address wallet) public view returns (uint256) {
    return donators[wallet];
  }


   /**
   * @dev Override the parent function to add donator ether
   * @param donator Address making donation and receiving the tokens
   * @param weiAmount Value in wei involved in the purchase/ donation
   */
  function _updatePurchasingState(
    address donator,
    uint256 weiAmount
  )
    internal
  {
   donators[donator]=donators[donator].add(weiAmount);
   Donate(donator,weiAmount,now);
  super._updatePurchasingState(donator,weiAmount);
  }
}