// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Prompt {
  string[10] private i_prompts = [
    "Prompt 1",
    "Prompt 2",
    "Prompt 3",
    "Prompt 4",
    "Prompt 5",
    "Prompt 6",
    "Prompt 7",
    "Prompt 8",
    "Prompt 9",
    "Prompt 10"
  ];
  string public s_currentPrompt;
  uint256 public lastUpdated;
  string private s_lastPrompt;
  string private s_secondLastPrompt;
  uint public lastTimeStamp;

  event CurrentPrompt(string _currentPrompt);

  // constructor() {
  // }

  function updatePrompt() external {
    // Find a new prompt that hasn't been used in the last two updates
    string memory newPrompt;
    uint256 i = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1)))) % i_prompts.length;
    while (compareStrings(i_prompts[i], s_lastPrompt) || compareStrings(i_prompts[i], s_secondLastPrompt)) {
      if (i == i_prompts.length - 1) {
        i = 0; // reset if we have checked all prompts
      } else {
        i++; // move to the next prompt
      }
    }
    newPrompt = i_prompts[i];

    // Update the last two used prompts
    s_secondLastPrompt = s_lastPrompt;
    s_lastPrompt = newPrompt;

    // Set the current prompt to the new prompt
    s_currentPrompt = newPrompt;

    emit CurrentPrompt(s_currentPrompt);
  }

  // Helper function to compare strings
  function compareStrings(string memory a, string memory b) private pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function getPrompt(uint8 index) public view returns (string memory) {
    return i_prompts[index];
  }

  function getTotalPromptCount() public view returns (uint256) {
    return uint256(i_prompts.length);
  }

  function getCurrentPrompt() public view returns (string memory) {
    return s_currentPrompt;
  }
}
