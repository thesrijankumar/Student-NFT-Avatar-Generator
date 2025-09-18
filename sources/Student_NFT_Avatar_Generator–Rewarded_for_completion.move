module MyModule::StudentNFTGenerator {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::string::String;

    /// Struct representing a student's NFT avatar with completion status
    struct StudentAvatar has store, key {
        avatar_uri: String,        // IPFS URI or metadata link for the NFT
        completion_status: bool,   // Whether student completed required tasks
        reward_claimed: bool,      // Whether reward has been claimed
        total_rewards: u64,        // Total rewards earned by the student
    }

    /// Error codes
    const E_AVATAR_NOT_FOUND: u64 = 1;
    const E_ALREADY_COMPLETED: u64 = 2;
    const E_NOT_COMPLETED: u64 = 3;
    const E_REWARD_ALREADY_CLAIMED: u64 = 4;
    const E_INSUFFICIENT_FUNDS: u64 = 5;

    /// Function to create a new student avatar NFT
    /// @param student: The student's signer reference
    /// @param avatar_uri: The metadata URI for the NFT avatar
    public fun create_avatar(student: &signer, avatar_uri: String) {
        let avatar = StudentAvatar {
            avatar_uri,
            completion_status: false,
            reward_claimed: false,
            total_rewards: 0,
        };
        move_to(student, avatar);
    }

    /// Function to mark completion and distribute rewards
    /// @param admin: Admin signer who can mark completion
    /// @param student_address: Address of the student to reward
    /// @param reward_amount: Amount of AptosCoin to reward
    public fun complete_and_reward(
        admin: &signer, 
        student_address: address, 
        reward_amount: u64
    ) acquires StudentAvatar {
        // Verify admin has sufficient balance
        assert!(coin::balance<AptosCoin>(signer::address_of(admin)) >= reward_amount, E_INSUFFICIENT_FUNDS);
        
        let avatar = borrow_global_mut<StudentAvatar>(student_address);
        
        // Check if already completed
        assert!(!avatar.completion_status, E_ALREADY_COMPLETED);
        
        // Mark as completed
        avatar.completion_status = true;
        avatar.total_rewards = avatar.total_rewards + reward_amount;
        
        // Transfer reward tokens from admin to student
        let reward_coins = coin::withdraw<AptosCoin>(admin, reward_amount);
        coin::deposit<AptosCoin>(student_address, reward_coins);
        
        // Mark reward as claimed
        avatar.reward_claimed = true;
    }
}