module MyModule::StudentNFTGenerator {
    use aptos_framework::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use std::string::String;

    struct StudentAvatar has store, key {
        avatar_uri: String,
        completion_status: bool,
        reward_claimed: bool,
        total_rewards: u64,
    }

    const E_AVATAR_ALREADY_EXISTS: u64 = 0;
    const E_AVATAR_NOT_FOUND: u64 = 1;
    const E_ALREADY_COMPLETED: u64 = 2;
    const E_NOT_COMPLETED: u64 = 3;
    const E_REWARD_ALREADY_CLAIMED: u64 = 4;
    const E_INSUFFICIENT_FUNDS: u64 = 5;

    public entry fun create_avatar(student: &signer, avatar_uri: String) {
        let student_addr = signer::address_of(student);
        assert!(!exists<StudentAvatar>(student_addr), E_AVATAR_ALREADY_EXISTS);
        
        let avatar = StudentAvatar {
            avatar_uri,
            completion_status: false,
            reward_claimed: false,
            total_rewards: 0,
        };
        move_to(student, avatar);
    }

    public entry fun complete_and_reward(
        admin: &signer, 
        student_address: address, 
        reward_amount: u64
    ) acquires StudentAvatar {
        assert!(exists<StudentAvatar>(student_address), E_AVATAR_NOT_FOUND);
        
        let admin_addr = signer::address_of(admin);
        assert!(coin::balance<AptosCoin>(admin_addr) >= reward_amount, E_INSUFFICIENT_FUNDS);
        
        let avatar = borrow_global_mut<StudentAvatar>(student_address);
        assert!(!avatar.completion_status, E_ALREADY_COMPLETED);
        
        avatar.completion_status = true;
        avatar.total_rewards = avatar.total_rewards + reward_amount;
        
        let reward_coins = coin::withdraw<AptosCoin>(admin, reward_amount);
        coin::deposit<AptosCoin>(student_address, reward_coins);
        
        avatar.reward_claimed = true;
    }
}