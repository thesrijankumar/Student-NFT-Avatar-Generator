import React, { useState, useEffect } from 'react';
import { User, Award, Coins, Wallet, CheckCircle, AlertCircle } from 'lucide-react';

const StudentNFTApp = () => {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [studentAddress, setStudentAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'
  const [studentProfile, setStudentProfile] = useState(null);

  // Mock data for demonstration
  const mockStudents = [
    { address: '0x123...abc', name: 'Alice Johnson', avatar: 'QmX...123', completed: false, rewards: 0 },
    { address: '0x456...def', name: 'Bob Smith', avatar: 'QmY...456', completed: true, rewards: 100 },
    { address: '0x789...ghi', name: 'Carol Davis', avatar: 'QmZ...789', completed: false, rewards: 0 }
  ];

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.aptos) {
      try {
        const response = await window.aptos.account();
        setAccount(response);
        setWallet(window.aptos);
        await getBalance(response.address);
      } catch (error) {
        console.log('Wallet not connected');
      }
    }
  };

  const connectWallet = async () => {
    if (!window.aptos) {
      setMessage('Please install Petra Wallet');
      return;
    }

    try {
      setLoading(true);
      const response = await window.aptos.connect();
      setAccount(response);
      setWallet(window.aptos);
      await getBalance(response.address);
      setMessage('Wallet connected successfully!');
    } catch (error) {
      setMessage('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const getBalance = async (address) => {
    // Mock balance for demonstration
    setBalance(1000);
  };

  const createAvatar = async () => {
    if (!wallet || !avatarUri) {
      setMessage('Please connect wallet and enter avatar URI');
      return;
    }

    try {
      setLoading(true);
      
      // Mock transaction - In real implementation, this would call the Move contract
      const payload = {
        type: "entry_function_payload",
        function: `${account.address}::StudentNFTGenerator::create_avatar`,
        arguments: [avatarUri],
        type_arguments: []
      };

      // Simulate successful transaction
      setTimeout(() => {
        setStudentProfile({
          address: account.address,
          avatar: avatarUri,
          completed: false,
          rewards: 0,
          name: 'Current User'
        });
        setMessage('Avatar created successfully!');
        setAvatarUri('');
        setLoading(false);
      }, 2000);

    } catch (error) {
      setMessage('Failed to create avatar');
      setLoading(false);
    }
  };

  const completeAndReward = async () => {
    if (!wallet || !studentAddress || !rewardAmount) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      // Mock transaction for completion and reward
      const payload = {
        type: "entry_function_payload",
        function: `${account.address}::StudentNFTGenerator::complete_and_reward`,
        arguments: [studentAddress, parseInt(rewardAmount)],
        type_arguments: []
      };

      // Simulate successful transaction
      setTimeout(() => {
        setMessage(`Student rewarded with ${rewardAmount} APT!`);
        setStudentAddress('');
        setRewardAmount('');
        setLoading(false);
      }, 2000);

    } catch (error) {
      setMessage('Failed to process reward');
      setLoading(false);
    }
  };

  const StudentDashboard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="mr-3 text-blue-600" />
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
                  <Award className="mr-2 h-5 w-5" />
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
        <Award className="mr-3 text-green-600" />
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
                  <Coins className="mr-2 h-5 w-5" />
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
                  {student.completed ? (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  ) : (
                    <AlertCircle className="text-yellow-500 h-5 w-5" />
                  )}
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
        {/* Header */}
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
              
              {account ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Connected: {account.address.slice(0, 6)}...{account.address.slice(-4)}</p>
                  <p className="text-sm font-semibold text-green-600 flex items-center">
                    <Coins className="mr-1 h-4 w-4" />
                    {balance} APT
                  </p>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-6 rounded-lg font-semibold transition-colors flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  ) : (
                    <Wallet className="mr-2 h-5 w-5" />
                  )}
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Main Content */}
        {account ? (
          userRole === 'student' ? <StudentDashboard /> : <AdminDashboard />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="text-white h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Student NFT Generator</h2>
              <p className="text-gray-600 mb-6">Connect your Petra wallet to start creating avatars and earning rewards</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-blue-50 rounded-lg p-6">
                <User className="text-blue-600 h-8 w-8 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Create Avatar</h3>
                <p className="text-gray-600 text-sm">Generate your unique NFT avatar that represents your learning journey</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <Award className="text-green-600 h-8 w-8 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Complete Tasks</h3>
                <p className="text-gray-600 text-sm">Finish educational milestones and unlock achievement rewards</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <Coins className="text-purple-600 h-8 w-8 mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">Receive APT tokens as rewards for your learning achievements</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Aptos Blockchain • Built with Move Smart Contracts</p>
        </div>
      </div>
    </div>
  );
};

export default StudentNFTApp;