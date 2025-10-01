import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { createAvatarTransaction, completeAndRewardTransaction } from "./utils/aptosClient";
import { aptos } from "./config/aptosConfig";

// Simple SVG Icons
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AwardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CoinsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StudentNFTApp = () => {
  // Removed 'wallet' state as it's provided by useWallet's connected/wallet props
  //Adding wallet as it isn't working!
//   const[wallet, setWallet] = useState(null);
//   const[account, setAccount] = useState(null);
  // Removed 'account' state as it's provided by useWallet's account hook
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [studentProfile, setStudentProfile] = useState(null);

  // Correctly using useWallet hook
  const { account, connected, signAndSubmitTransaction, connect, wallets } = useWallet();


  // The first `createAvatar` function was the correct one using the wallet adapter.
  const createAvatar = async () => {
    if (!account || !avatarUri) {
      setMessage('Please connect wallet and enter avatar URI');
      return;
    }

    try {
      setLoading(true);
      setMessage('🔄 Processing transaction...');
      
      // Use the utility function to get the transaction payload
      const transaction = createAvatarTransaction(avatarUri);
      
      // Sign and submit the transaction via the connected wallet
      const response = await signAndSubmitTransaction(transaction);
      const txHash = response.hash;
      
      setMessage(`⏳ Transaction submitted! Hash: ${txHash}`);
      
      // Wait for transaction confirmation
      // NOTE: `aptos` must be correctly configured in `./config/aptosConfig`
      await aptos.waitForTransaction({ transactionHash: txHash });
      
      // Update student profile on successful transaction confirmation
      setStudentProfile({
        address: account.address,
        avatar: avatarUri,
        completed: false,
        rewards: 0,
        name: 'Current User',
        transactionHash: txHash
      });
      
      setMessage(`✅ Avatar created successfully! Transaction: ${txHash}`);
      setAvatarUri('');
      setLoading(false);
    } catch (error) {
      console.error('Create Avatar Error:', error);
      setMessage('❌ Failed to create avatar');
      setLoading(false);
    }
  };

  // New `completeAndReward` using the wallet adapter
  const completeAndReward = async () => {
    if (!account || !studentAddress || !rewardAmount) {
      setMessage('Please connect wallet and fill all fields');
      return;
    }

    try {
      setLoading(true);
      setMessage('🔄 Processing reward transaction...');
      
      // Use the utility function to get the transaction payload
      const amount = parseInt(rewardAmount);
      if (isNaN(amount) || amount <= 0) {
        setMessage('Invalid reward amount.');
        setLoading(false);
        return;
      }

      const transaction = completeAndRewardTransaction(studentAddress, amount);
      
      const response = await signAndSubmitTransaction(transaction);
      const txHash = response.hash;
      
      setMessage(`⏳ Reward transaction submitted! Hash: ${txHash}`);

      await aptos.waitForTransaction({ transactionHash: txHash });
      
      setMessage(`✅ Student rewarded with ${rewardAmount} APT! Transaction: ${txHash}`);
      setStudentAddress('');
      setRewardAmount('');
      setLoading(false);

      // In a real app, you would fetch updated student data here.

    } catch (error) {
      console.error('Reward Error:', error);
      setMessage('❌ Failed to process reward');
      setLoading(false);
    }
  };


  const mockStudents = [
    { address: '0x123...abc', name: 'Alice Johnson', avatar: 'QmX...123', completed: false, rewards: 0 },
    { address: '0x456...def', name: 'Bob Smith', avatar: 'QmY...456', completed: true, rewards: 100 },
    { address: '0x789...ghi', name: 'Carol Davis', avatar: 'QmZ...789', completed: false, rewards: 0 }
  ];
  
  // Mock function for balance
  const getBalance = async (address) => {
    // In a real app, use aptos.getAccountAPTBalance(address)
    setBalance(1000); 
  };
  
  // Use effect to fetch balance when account changes (i.e., on connection)
  useEffect(() => {
    if (account?.address) {
      getBalance(account.address);
      // In a real app, you might also fetch the student profile here
      // getStudentProfile(account.address);
    }
  }, [account?.address]);


  // **The previous `checkWalletConnection` and `connectWallet` are redundant/incorrect** // **when using `@aptos-labs/wallet-adapter-react`.**
  // **The wallet adapter manages connection state and provides a `connect` function.**

 const handleConnectWallet = async () => {
  try {
    setLoading(true);

    if (!window.aptos) {
      setMessage('Petra wallet not found. Please install and unlock your wallet.');
      return;
    }

    // Request connection to the wallet
    const response = await window.aptos.connect(); // Prompts user to connect
    // response will have connected account info
    const accountAddress = response.address;

    // Optionally, fetch account info
    const accountInfo = await window.aptos.account(); // { address, publicKey }

    setMessage(`Wallet connected successfully! Address: ${accountAddress}`);
    console.log('Connected account:', accountInfo);

    // You can store connected account in state
    setStudentAddress(accountAddress);

  } catch (error) {
    console.error('Wallet connection failed:', error);
    setMessage('Failed to connect wallet');
  } finally {
    setLoading(false);
  }
};



  const StudentDashboard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3 text-blue-600"><UserIcon /></span>
        Student Dashboard
      </h2>
      
      {studentProfile ? (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Avatar NFT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-2"><strong>Avatar URI:</strong> {studentProfile.avatar}</p>
              <p className="text-gray-600 mb-2"><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm ${studentProfile.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {studentProfile.completed ? 'Completed' : 'In Progress'}
                </span>
              </p>
              <p className="text-gray-600 mb-2"><strong>Total Rewards:</strong> {studentProfile.rewards} APT</p>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                NFT
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Your Avatar NFT</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Avatar URI (e.g., ipfs://QmX...)"
              value={avatarUri}
              onChange={(e) => setAvatarUri(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={createAvatar}
              disabled={loading || !avatarUri}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span className="mr-2"><AwardIcon /></span>
                  Create Avatar NFT
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AdminDashboard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-3 text-green-600"><AwardIcon /></span>
        Admin Dashboard
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reward Student</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Student Address (0x...)"
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Reward Amount (APT)"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={completeAndReward}
              disabled={loading || !studentAddress || !rewardAmount}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span className="mr-2"><CoinsIcon /></span>
                  Complete & Reward
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Overview</h3>
          <div className="space-y-3">
            {mockStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={student.completed ? 'text-green-500' : 'text-yellow-500'}>
                    {student.completed ? <CheckCircleIcon /> : <AlertCircleIcon />}
                  </span>
                  <span className="text-sm font-semibold">{student.rewards} APT</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Student NFT Avatar Generator</h1>
              <p className="text-gray-600">Create NFT avatars and earn rewards for learning achievements</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Role:</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {connected && account ? (
                <div className="text-center">
<p className="text-sm text-gray-600">
  Connected: {String(account.address).slice(0, 6)}...{String(account.address).slice(-4)}
</p>                  <p className="text-sm font-semibold text-green-600 flex items-center justify-center">
                    <span className="mr-1"><CoinsIcon /></span>
                    {balance} APT
                  </p>
                </div>
              ) : (
                <button
  onClick={handleConnectWallet} // Use our new window.aptos connection
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg font-semibold transition-colors flex items-center"
>
  {loading ? (
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
  ) : (
    <span className="mr-2"><WalletIcon /></span>
  )}
  Connect Petra
</button>

              )}
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {connected && account ? (
          userRole === 'student' ? <StudentDashboard /> : <AdminDashboard />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                <UserIcon />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Student NFT Generator</h2>
              <p className="text-gray-600 mb-6">Connect your Petra wallet to start creating avatars and earning rewards</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-blue-50 rounded-lg p-6">
                <span className="text-blue-600 inline-block mb-3"><UserIcon /></span>
                <h3 className="font-semibold text-gray-800 mb-2">Create Avatar</h3>
                <p className="text-gray-600 text-sm">Generate your unique NFT avatar that represents your learning journey</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <span className="text-green-600 inline-block mb-3"><AwardIcon /></span>
                <h3 className="font-semibold text-gray-800 mb-2">Complete Tasks</h3>
                <p className="text-gray-600 text-sm">Finish educational milestones and unlock achievement rewards</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <span className="text-purple-600 inline-block mb-3"><CoinsIcon /></span>
                <h3 className="font-semibold text-gray-800 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">Receive APT tokens as rewards for your learning achievements</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Aptos Blockchain • Built with Move Smart Contracts</p>
        </div>
      </div>
    </div>
  );
};

export default StudentNFTApp;