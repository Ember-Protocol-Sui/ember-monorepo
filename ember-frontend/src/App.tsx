import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Lock,
  ArrowRight,
  Github,
  Twitter,
  MessageCircle,
  Bitcoin,
  DollarSign,
  MousePointer,
  Layers,
  X,
  Wallet,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  Info,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Home
} from 'lucide-react';
import { DropdownPortal } from './DropdownPortal';

// Persistent Prototype Banner
function PrototypeBanner() {
  return (
    <div className="w-full bg-yellow-500 text-black text-center py-2 px-4 font-semibold text-sm shadow-lg z-[100] fixed top-0 left-0">
      ⚠️ Notice: No active ember nodes are running, atleast 1 ember node must run to communicate with ember network.
    </div>
  );
}

// Prototype Notice Modal
function PrototypeNoticeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-yellow-100 text-black rounded-2xl shadow-xl p-8 max-w-md w-full relative border-2 border-yellow-400">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-yellow-700 hover:text-black text-xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-center">Notice</h2>
          <p className="text-center text-base mb-4">
             No active ember nodes are running, atleast 1 ember node must run to communicate with ember network.<br/>
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectedMetaMask, setConnectedMetaMask] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'loan' | 'lend' | 'transaction' | 'manage-loans' | 'repay-loan'>('home');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [selectedChain, setSelectedChain] = useState('Ethereum');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [lendAmount, setLendAmount] = useState('');
  const [ltvRatio, setLtvRatio] = useState(1.5);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showLendTokenDropdown, setShowLendTokenDropdown] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<any>(null);
  const [repayBtcAddress, setRepayBtcAddress] = useState('');
  const tokenDropdownRef = useRef(null);
  const chainDropdownRef = useRef(null);
  const lendTokenDropdownRef = useRef(null);
  const [showPrototypeNotice, setShowPrototypeNotice] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const bitcoinWallets = [
    {
      name: "Unisat",
      icon: "🟠",
      description: "Popular Bitcoin wallet with ordinals support"
    },
    {
      name: "Xverse",
      icon: "⚡",
      description: "Multi-chain Bitcoin wallet"
    },
    {
      name: "Leather",
      icon: "🔶",
      description: "Bitcoin & Stacks wallet"
    },
    {
      name: "OKX Wallet",
      icon: "⭕",
      description: "Multi-chain wallet with Bitcoin support"
    },
    {
      name: "Phantom",
      icon: "👻",
      description: "Multi-chain wallet supporting Bitcoin"
    },
    {
      name: "BitKeep",
      icon: "🔑",
      description: "Comprehensive Bitcoin wallet solution"
    }
  ];

  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', icon: '💵', rate: '5.2%', tvl: '$124M' },
    { symbol: 'USDT', name: 'Tether USD', icon: '💰', rate: '4.8%', tvl: '$89M' },
    { symbol: 'DAI', name: 'Dai Stablecoin', icon: '🟡', rate: '5.5%', tvl: '$67M' },
    { symbol: 'FRAX', name: 'Frax', icon: '🔷', rate: '6.1%', tvl: '$34M' }
  ];

  const chains = [
    { name: 'Ethereum', icon: '⟠', fee: '$12' },
    { name: 'Polygon', icon: '🟣', fee: '$0.50' },
    { name: 'Arbitrum', icon: '🔵', fee: '$2' },
    { name: 'Optimism', icon: '🔴', fee: '$3' },
    { name: 'Base', icon: '🔷', fee: '$1' }
  ];

  // Mock active loans data
  const activeLoans = [
    {
      id: 'loan-001',
      token: 'USDC',
      amount: '25000',
      collateral: '0.4231',
      ltv: '1.8:1',
      interestRate: '5.2%',
      monthlyPayment: '108.33',
      dueDate: '2024-12-15',
      status: 'active',
      chain: 'Ethereum'
    },
    {
      id: 'loan-002',
      token: 'USDT',
      amount: '15000',
      collateral: '0.2538',
      ltv: '2.1:1',
      interestRate: '4.8%',
      monthlyPayment: '60.00',
      dueDate: '2024-11-28',
      status: 'active',
      chain: 'Polygon'
    }
  ];

  // Helper to show the modal after actions
  const showNotice = () => setShowPrototypeNotice(true);

  const handleWalletConnect = (walletName: string) => {
    setConnectedWallet(walletName);
    setShowWalletModal(false);
    showNotice();
    console.log(`Connecting to ${walletName} wallet...`);
  };

  const handleMetaMaskConnect = () => {
    setConnectedMetaMask('0x742d35Cc6634C0532925a3b8D');
    setShowMetaMaskModal(false);
    showNotice();
    console.log('Connecting to MetaMask...');
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    setConnectedMetaMask(null);
    setCurrentPage('home');
    showNotice();
  };

  const handleGetLoan = () => {
    if (connectedWallet) {
      setCurrentPage('loan');
      showNotice();
    } else {
      setShowWalletModal(true);
      showNotice();
    }
  };

  const handleLendTokens = () => {
    if (connectedMetaMask) {
      setCurrentPage('lend');
      showNotice();
    } else {
      setShowMetaMaskModal(true);
      showNotice();
    }
  };

  const handleExecuteLoan = () => {
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);
    const collateralNeeded = calculateCollateralNeeded();
    const monthlyInterest = calculateInterest();
    
    setTransactionData({
      type: 'loan',
      txHash,
      token: selectedToken,
      amount: loanAmount,
      collateral: collateralNeeded.toFixed(4),
      ltv: ltvRatio.toFixed(1),
      interestRate: tokens.find(t => t.symbol === selectedToken)?.rate,
      monthlyPayment: monthlyInterest.toFixed(2),
      chain: selectedChain,
      recipientAddress,
      networkFee: chains.find(c => c.name === selectedChain)?.fee
    });
    
    setCurrentPage('transaction');
    showNotice();
  };

  const handleExecuteLend = () => {
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);
    const epTokens = calculateEPTokens();
    const yearlyReturn = calculateYearlyReturn();
    
    setTransactionData({
      type: 'lend',
      txHash,
      token: selectedToken,
      amount: lendAmount,
      epTokens: epTokens.toFixed(2),
      apy: tokens.find(t => t.symbol === selectedToken)?.rate,
      yearlyReturn: yearlyReturn.toFixed(2),
      monthlyReturn: (yearlyReturn / 12).toFixed(2)
    });
    
    setCurrentPage('transaction');
    showNotice();
  };

  const handleRepayLoan = (loan: any) => {
    setSelectedLoanForRepay(loan);
    setCurrentPage('repay-loan');
    showNotice();
  };

  const handleExecuteRepayment = () => {
    const txHash = '0x' + Math.random().toString(16).substr(2, 64);
    
    setTransactionData({
      type: 'repay',
      txHash,
      loanId: selectedLoanForRepay.id,
      token: selectedLoanForRepay.token,
      amount: selectedLoanForRepay.amount,
      collateral: selectedLoanForRepay.collateral,
      btcAddress: repayBtcAddress
    });
    
    setCurrentPage('transaction');
    showNotice();
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const calculateCollateralNeeded = () => {
    if (!loanAmount) return 0;
    const btcPrice = 65000; // Mock BTC price
    return (parseFloat(loanAmount) * ltvRatio) / btcPrice;
  };

  const calculateInterest = () => {
    if (!loanAmount) return 0;
    const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
    const rate = parseFloat(selectedTokenData?.rate.replace('%', '') || '0') / 100;
    return parseFloat(loanAmount) * rate / 12; // Monthly interest
  };

  const calculateEPTokens = () => {
    if (!lendAmount) return 0;
    return parseFloat(lendAmount); // 1:1 ratio for EP tokens
  };

  const calculateYearlyReturn = () => {
    if (!lendAmount) return 0;
    const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
    const rate = parseFloat(selectedTokenData?.rate.replace('%', '') || '0') / 100;
    return parseFloat(lendAmount) * rate;
  };

  const features = [
    {
      icon: <Bitcoin className="w-8 h-8" />,
      title: "Native Bitcoin Collateral",
      description: "Use your Bitcoin directly as collateral without bridging, wrapping, or custody risks"
    },
    {
      icon: <MousePointer className="w-8 h-8" />,
      title: "One-Click Loans",
      description: "Get USDC/USDT loans instantly with a single click - no complex processes"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "High Liquidity",
      description: "Access deep liquidity pools for immediate loan fulfillment at competitive rates"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "No Bridging Required",
      description: "Keep your Bitcoin native and secure"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "No Wrapping",
      description: "Direct collateralization without token wrapping"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Settlement",
      description: "Immediate loan disbursement"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Competitive Rates",
      description: "Market-leading loan terms"
    }
  ];

  const lendingBenefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "100% Risk-Free",
      description: "Over-collateralized by Bitcoin"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Guaranteed Returns",
      description: "Fixed APY with no impermanent loss"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "EP Token Liquidity",
      description: "Trade your position anytime"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Bitcoin Secured",
      description: "Backed by native Bitcoin collateral"
    }
  ];

  const stats = [
    { label: "Bitcoin Collateral Locked", value: "$847M+" },
    { label: "Loans Issued", value: "12.4K+" },
    { label: "Average Loan Size", value: "$45K" },
    { label: "Loan Success Rate", value: "99.8%" }
  ];

  // Transaction Completion Page
  if (currentPage === 'transaction') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <PrototypeBanner />
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Transaction Completed!
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                {transactionData?.type === 'loan' && 'Your Bitcoin loan has been successfully executed'}
                {transactionData?.type === 'lend' && 'Your tokens have been successfully deposited'}
                {transactionData?.type === 'repay' && 'Your loan has been successfully repaid'}
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Transaction Details</h2>
                <div className="flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm text-green-300">Confirmed</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl">
                  <span className="text-gray-400">Transaction Hash:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-sm mr-2">{transactionData?.txHash}</span>
                    <button
                      onClick={() => copyToClipboard(transactionData?.txHash)}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {addressCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={`https://etherscan.io/tx/${transactionData?.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {transactionData?.type === 'loan' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Loan Amount</div>
                        <div className="text-xl font-semibold">{transactionData.amount} {transactionData.token}</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Collateral Locked</div>
                        <div className="text-xl font-semibold">{transactionData.collateral} BTC</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">LTV Ratio</div>
                        <div className="text-xl font-semibold">{transactionData.ltv}:1</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Interest Rate</div>
                        <div className="text-xl font-semibold text-green-400">{transactionData.interestRate}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Recipient Address</div>
                      <div className="font-mono text-sm">{transactionData.recipientAddress}</div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Monthly Payment</div>
                      <div className="text-xl font-semibold">{transactionData.monthlyPayment} {transactionData.token}</div>
                    </div>
                  </>
                )}

                {transactionData?.type === 'lend' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Deposited Amount</div>
                        <div className="text-xl font-semibold">{transactionData.amount} {transactionData.token}</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">EP Tokens Received</div>
                        <div className="text-xl font-semibold">{transactionData.epTokens} EP{transactionData.token}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">APY</div>
                        <div className="text-xl font-semibold text-green-400">{transactionData.apy}</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Yearly Return</div>
                        <div className="text-xl font-semibold">{transactionData.yearlyReturn} {transactionData.token}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Monthly Return</div>
                      <div className="text-xl font-semibold">{transactionData.monthlyReturn} {transactionData.token}</div>
                    </div>
                  </>
                )}

                {transactionData?.type === 'repay' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Loan ID</div>
                        <div className="text-xl font-semibold">{transactionData.loanId}</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Repaid Amount</div>
                        <div className="text-xl font-semibold">{transactionData.amount} {transactionData.token}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Collateral Released</div>
                        <div className="text-xl font-semibold">{transactionData.collateral} BTC</div>
                      </div>
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">BTC Destination</div>
                        <div className="font-mono text-sm">{transactionData.btcAddress}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-700 pt-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Transaction Confirmed</span>
                  </div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Block: 18,542,891</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  setTransactionData(null);
                  setLoanAmount('');
                  setLendAmount('');
                  setRecipientAddress('');
                  setRepayBtcAddress('');
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                <Home className="w-5 h-5 mr-2 inline" />
                Back to Homepage
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Manage Loans Page
  if (currentPage === 'manage-loans') {
    <PrototypeBanner />
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400/20 via-transparent to-transparent"></div>
        
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ember Protocol
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {connectedMetaMask && (
                <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-sm text-green-300">{connectedMetaMask.slice(0, 8)}...{connectedMetaMask.slice(-6)}</span>
                </div>
              )}
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </nav>

        <main className="relative z-10 px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                  Manage Your Loans
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                View and manage all your active Bitcoin-collateralized loans
              </p>
            </div>

            {!connectedMetaMask ? (
              <div className="text-center">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 max-w-md mx-auto">
                  <Wallet className="w-16 h-16 text-orange-400 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold mb-4">Connect MetaMask</h2>
                  <p className="text-gray-400 mb-6">Connect your MetaMask wallet to view your active loans</p>
                  <button
                    onClick={() => setShowMetaMaskModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Connect MetaMask
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Active Loans ({activeLoans.length})</h2>
                  <div className="text-sm text-gray-400">
                    Total Borrowed: $40,000 • Total Collateral: 0.6769 BTC
                  </div>
                </div>

                {activeLoans.map((loan) => (
                  <div key={loan.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{tokens.find(t => t.symbol === loan.token)?.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold">{loan.amount} {loan.token} Loan</h3>
                          <p className="text-sm text-gray-400">Loan ID: {loan.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                          <span className="text-sm text-green-300 capitalize">{loan.status}</span>
                        </div>
                        <div className="text-sm text-gray-400">{loan.chain}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-3 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Collateral</div>
                        <div className="font-semibold">{loan.collateral} BTC</div>
                      </div>
                      <div className="p-3 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">LTV Ratio</div>
                        <div className="font-semibold">{loan.ltv}</div>
                      </div>
                      <div className="p-3 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Interest Rate</div>
                        <div className="font-semibold text-green-400">{loan.interestRate}</div>
                      </div>
                      <div className="p-3 bg-gray-700/30 rounded-xl">
                        <div className="text-gray-400 text-sm mb-1">Monthly Payment</div>
                        <div className="font-semibold">{loan.monthlyPayment} {loan.token}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                          Due Date: <span className="text-white">{loan.dueDate}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-yellow-400">Payment due in 12 days</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRepayLoan(loan)}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
                      >
                        Repay Loan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Repay Loan Page
  if (currentPage === 'repay-loan') {
    <PrototypeBanner />
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('manage-loans')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ember Protocol
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-300">{connectedMetaMask?.slice(0, 8)}...{connectedMetaMask?.slice(-6)}</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Repay Your Loan
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Repay your loan and claim your Bitcoin collateral
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Loan Details */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Loan Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Loan Amount</div>
                      <div className="text-xl font-semibold">{selectedLoanForRepay?.amount} {selectedLoanForRepay?.token}</div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Collateral</div>
                      <div className="text-xl font-semibold">{selectedLoanForRepay?.collateral} BTC</div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Interest Rate</div>
                      <div className="text-xl font-semibold text-green-400">{selectedLoanForRepay?.interestRate}</div>
                    </div>
                    <div className="p-4 bg-gray-700/30 rounded-xl">
                      <div className="text-gray-400 text-sm mb-1">Due Date</div>
                      <div className="text-xl font-semibold">{selectedLoanForRepay?.dueDate}</div>
                    </div>
                  </div>
                </div>

                {/* Bitcoin Address for Collateral */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Bitcoin className="w-5 h-5 mr-2 text-orange-400" />
                    Bitcoin Address for Collateral Return
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={repayBtcAddress}
                      onChange={(e) => setRepayBtcAddress(e.target.value)}
                      placeholder="Enter your Bitcoin address to receive collateral"
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-green-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Your {selectedLoanForRepay?.collateral} BTC collateral will be sent to this address after repayment
                  </p>
                </div>
              </div>

              {/* Repayment Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">Repayment Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Principal:</span>
                      <span className="font-semibold">{selectedLoanForRepay?.amount} {selectedLoanForRepay?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accrued Interest:</span>
                      <span className="font-semibold">245.67 {selectedLoanForRepay?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee:</span>
                      <span className="font-semibold">12.50 {selectedLoanForRepay?.token}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Collateral to Receive:</span>
                      <span className="font-semibold text-orange-400">{selectedLoanForRepay?.collateral} BTC</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total to Pay:</span>
                      <span className="text-green-400">{selectedLoanForRepay ? (parseFloat(selectedLoanForRepay.amount) + 245.67 + 12.50).toFixed(2) : '0'} {selectedLoanForRepay?.token}</span>
                    </div>
                  </div>

                  <button 
                    disabled={!repayBtcAddress}
                    onClick={handleExecuteRepayment}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Repay Loan & Claim Collateral
                  </button>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-green-200">
                        After repayment, your Bitcoin collateral will be automatically released to the specified address.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Lending Page
  if (currentPage === 'lend') {
    <PrototypeBanner />
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ember Protocol
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-300">{connectedMetaMask?.slice(0, 8)}...{connectedMetaMask?.slice(-6)}</span>
              </div>
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </nav>

        {/* Lending Configuration */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Lend & Earn Risk-Free Returns
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Deposit your tokens and earn guaranteed APY backed by Bitcoin collateral
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Lending Configuration Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Token Selection (Lend) */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 relative z-30 overflow-visible">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                    Select Token to Lend
                  </h3>
                  <div className="relative">
                    <button
                      ref={lendTokenDropdownRef}
                      onClick={() => setShowLendTokenDropdown(!showLendTokenDropdown)}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-between hover:border-green-500/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{tokens.find(t => t.symbol === selectedToken)?.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{selectedToken}</div>
                          <div className="text-sm text-gray-400">{tokens.find(t => t.symbol === selectedToken)?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 text-sm mr-2">{tokens.find(t => t.symbol === selectedToken)?.rate} APY</span>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>
                    <DropdownPortal open={showLendTokenDropdown} targetRef={lendTokenDropdownRef}>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white">
                        {tokens.map((token) => (
                          <button
                            key={token.symbol}
                            onClick={() => {
                              setSelectedToken(token.symbol);
                              setShowLendTokenDropdown(false);
                            }}
                            className="w-full p-4 hover:bg-gray-700 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{token.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 text-sm">{token.rate} APY</div>
                              <div className="text-xs text-gray-400">TVL: {token.tvl}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </DropdownPortal>
                  </div>
                </div>

                {/* Token Selection (Borrow) */}
                {/* <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 relative z-30 overflow-visible">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-400" />
                    Select Token to Borrow
                  </h3>
                  <div className="relative">
                    <button
                      ref={tokenDropdownRef}
                      onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{tokens.find(t => t.symbol === selectedToken)?.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{selectedToken}</div>
                          <div className="text-sm text-gray-400">{tokens.find(t => t.symbol === selectedToken)?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 text-sm mr-2">{tokens.find(t => t.symbol === selectedToken)?.rate} APR</span>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>
                    <DropdownPortal open={showTokenDropdown} targetRef={tokenDropdownRef}>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white">
                        {tokens.map((token) => (
                          <button
                            key={token.symbol}
                            onClick={() => {
                              setSelectedToken(token.symbol);
                              setShowTokenDropdown(false);
                            }}
                            className="w-full p-4 hover:bg-gray-700 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{token.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <span className="text-green-400 text-sm">{token.rate} APR</span>
                          </button>
                        ))}
                      </div>
                    </DropdownPortal>
                  </div>
                </div> */}

                {/* Chain Selection */}
                {/* <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 relative z-30 overflow-visible">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-orange-400" />
                    Select Chain
                  </h3>
                  <div className="relative">
                    <button
                      ref={chainDropdownRef}
                      onClick={() => setShowChainDropdown(!showChainDropdown)}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{chains.find(c => c.name === selectedChain)?.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{selectedChain}</div>
                          <div className="text-sm text-gray-400">Network fee: {chains.find(c => c.name === selectedChain)?.fee}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <DropdownPortal open={showChainDropdown} targetRef={chainDropdownRef}>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white">
                        {chains.map((chain) => (
                          <button
                            key={chain.name}
                            onClick={() => {
                              setSelectedChain(chain.name);
                              setShowChainDropdown(false);
                            }}
                            className="w-full p-4 hover:bg-gray-700 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{chain.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{chain.name}</div>
                                <div className="text-sm text-gray-400">Network fee: {chain.fee}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </DropdownPortal>
                  </div>
                </div> */}

                {/* Lending Amount */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Amount to Lend
                  </h3>
                  <div className="relative mb-4">
                    <input
                      type="number"
                      value={lendAmount}
                      onChange={(e) => setLendAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-lg focus:border-green-500/50 focus:outline-none transition-colors pr-20"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button className="text-sm text-green-400 hover:text-green-300 transition-colors">
                        Max
                      </button>
                      <div className="text-gray-400">{selectedToken}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Balance: 50,000 {selectedToken} • Available: 50,000 {selectedToken}
                  </div>
                </div>

                {/* Risk Information */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-400" />
                    Why This is Risk-Free
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-green-300">Over-Collateralized by Bitcoin</div>
                        <div className="text-sm text-gray-400">Every loan is backed by 150-300% Bitcoin collateral value</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-green-300">Automatic Liquidation</div>
                        <div className="text-sm text-gray-400">Loans are automatically liquidated if collateral drops below threshold</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-green-300">No Impermanent Loss</div>
                        <div className="text-sm text-gray-400">Unlike AMM LPs, you get back exactly what you lent plus interest</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-green-300">EP Token Liquidity</div>
                        <div className="text-sm text-gray-400">Trade your EP tokens anytime for instant liquidity</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lending Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">Lending Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lending Amount:</span>
                      <span className="font-semibold">{lendAmount || '0'} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">APY:</span>
                      <span className="font-semibold text-green-400">{tokens.find(t => t.symbol === selectedToken)?.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">EP Tokens Received:</span>
                      <span className="font-semibold">{calculateEPTokens().toFixed(2)} EP{selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Return:</span>
                      <span className="font-semibold">{(calculateYearlyReturn() / 12).toFixed(2)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Yearly Return:</span>
                      <span className="font-semibold">{calculateYearlyReturn().toFixed(2)} {selectedToken}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total After 1 Year:</span>
                      <span className="text-green-400">{lendAmount ? (parseFloat(lendAmount) + calculateYearlyReturn()).toFixed(2) : '0'} {selectedToken}</span>
                    </div>
                  </div>

                  <button 
                    disabled={!lendAmount}
                    onClick={handleExecuteLend}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Lend Tokens
                  </button>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-green-200">
                        100% risk-free lending backed by over-collateralized Bitcoin. Your EP tokens can be traded anytime for liquidity.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loan Configuration Page
  if (currentPage === 'loan') {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400/20 via-transparent to-transparent"></div>
        
        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentPage('home')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ember Protocol
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm text-green-300">{connectedWallet}</span>
              </div>
              <button 
                onClick={handleDisconnect}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </nav>

        {/* Loan Configuration */}
        <main className="relative z-10 px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                  Configure Your Bitcoin Loan
                </span>
              </h1>
              <p className="text-xl text-gray-400">
                Set your loan parameters and get instant liquidity from your Bitcoin
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Loan Configuration Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Token Selection */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-400" />
                    Select Token to Borrow
                  </h3>
                  <div className="relative">
                    <button
                      ref={tokenDropdownRef}
                      onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{tokens.find(t => t.symbol === selectedToken)?.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{selectedToken}</div>
                          <div className="text-sm text-gray-400">{tokens.find(t => t.symbol === selectedToken)?.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-400 text-sm mr-2">{tokens.find(t => t.symbol === selectedToken)?.rate} APR</span>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>
                    <DropdownPortal open={showTokenDropdown} targetRef={tokenDropdownRef}>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white">
                        {tokens.map((token) => (
                          <button
                            key={token.symbol}
                            onClick={() => {
                              setSelectedToken(token.symbol);
                              setShowTokenDropdown(false);
                            }}
                            className="w-full p-4 hover:bg-gray-700 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{token.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{token.symbol}</div>
                                <div className="text-sm text-gray-400">{token.name}</div>
                              </div>
                            </div>
                            <span className="text-green-400 text-sm">{token.rate} APR</span>
                          </button>
                        ))}
                      </div>
                    </DropdownPortal>
                  </div>
                </div>

                {/* Chain Selection */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-orange-400" />
                    Select Chain
                  </h3>
                  <div className="relative">
                    <button
                      ref={chainDropdownRef}
                      onClick={() => setShowChainDropdown(!showChainDropdown)}
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl flex items-center justify-between hover:border-orange-500/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{chains.find(c => c.name === selectedChain)?.icon}</span>
                        <div className="text-left">
                          <div className="font-semibold">{selectedChain}</div>
                          <div className="text-sm text-gray-400">Network fee: {chains.find(c => c.name === selectedChain)?.fee}</div>
                        </div>
                      </div>
                      <ChevronDown className="w-5 h-5" />
                    </button>
                    <DropdownPortal open={showChainDropdown} targetRef={chainDropdownRef}>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white">
                        {chains.map((chain) => (
                          <button
                            key={chain.name}
                            onClick={() => {
                              setSelectedChain(chain.name);
                              setShowChainDropdown(false);
                            }}
                            className="w-full p-4 hover:bg-gray-700 flex items-center justify-between transition-colors"
                          >
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{chain.icon}</span>
                              <div className="text-left">
                                <div className="font-semibold">{chain.name}</div>
                                <div className="text-sm text-gray-400">Network fee: {chain.fee}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </DropdownPortal>
                  </div>
                </div>

                {/* Loan Amount */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
                    Loan Amount
                  </h3>
                  <div className="relative">
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl text-lg focus:border-orange-500/50 focus:outline-none transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {selectedToken}
                    </div>
                  </div>
                </div>

                {/* Recipient Address */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-orange-400" />
                    Recipient Address
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter recipient address"
                      className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-orange-500/50 focus:outline-none transition-colors pr-12"
                    />
                    {recipientAddress && (
                      <button
                        onClick={() => copyToClipboard(recipientAddress)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                      >
                        {addressCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* LTV Ratio */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-orange-400" />
                    Loan-to-Value Ratio
                    <div className="ml-2 group relative">
                      <Info className="w-4 h-4 text-gray-400" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-700 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Higher ratio = more collateral required
                      </div>
                    </div>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Ratio:</span>
                      <span className="text-2xl font-bold text-orange-400">{ltvRatio.toFixed(1)}:1</span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="3.0"
                      step="0.1"
                      value={ltvRatio}
                      onChange={(e) => setLtvRatio(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>1.5:1 (Risky)</span>
                      <span>3.0:1 (Safe)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-6">
                  <h3 className="text-xl font-semibold mb-6 text-center">Loan Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loan Amount:</span>
                      <span className="font-semibold">{loanAmount || '0'} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Collateral Needed:</span>
                      <span className="font-semibold">{calculateCollateralNeeded().toFixed(4)} BTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">LTV Ratio:</span>
                      <span className="font-semibold">{ltvRatio.toFixed(1)}:1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Interest Rate:</span>
                      <span className="font-semibold text-green-400">{tokens.find(t => t.symbol === selectedToken)?.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Payment:</span>
                      <span className="font-semibold">{calculateInterest().toFixed(2)} {selectedToken}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network Fee:</span>
                      <span className="font-semibold">{chains.find(c => c.name === selectedChain)?.fee}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total to Receive:</span>
                      <span className="text-orange-400">{loanAmount || '0'} {selectedToken}</span>
                    </div>
                  </div>

                  <button 
                    disabled={!loanAmount || !recipientAddress}
                    onClick={handleExecuteLoan}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Execute Loan
                  </button>
                  
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-orange-200">
                        Your Bitcoin remains in your wallet as collateral. Loan will be automatically liquidated if BTC price drops significantly.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Homepage
  return (
    <>
      <PrototypeBanner />
      <PrototypeNoticeModal open={showPrototypeNotice} onClose={() => setShowPrototypeNotice(false)} />
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden pt-10">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-400/20 via-transparent to-transparent"></div>
        
        {/* Wallet Connection Modals */}
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">
              <button 
                onClick={() => setShowWalletModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect Bitcoin Wallet</h2>
                <p className="text-gray-400">Choose your preferred Bitcoin wallet to get started</p>
              </div>
              
              <div className="space-y-3">
                {bitcoinWallets.map((wallet, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWalletConnect(wallet.name)}
                    className="w-full p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-orange-500/50 rounded-xl transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-4">{wallet.icon}</span>
                      <div>
                        <div className="font-semibold group-hover:text-orange-400 transition-colors">
                          {wallet.name}
                        </div>
                        <div className="text-sm text-gray-400">{wallet.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-orange-300 mb-1">Secure Connection</div>
                    <div className="text-orange-200/80">Your Bitcoin stays in your wallet. We never have custody of your funds.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showMetaMaskModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">
              <button 
                onClick={() => setShowMetaMaskModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect MetaMask</h2>
                <p className="text-gray-400">Connect your MetaMask wallet to start lending</p>
              </div>
              
              <button
                onClick={handleMetaMaskConnect}
                className="w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl transition-all duration-200 text-center group mb-4"
              >
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-4">🦊</span>
                  <div>
                    <div className="font-semibold">MetaMask</div>
                    <div className="text-sm opacity-80">Connect using browser extension</div>
                  </div>
                </div>
              </button>
              
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium text-green-300 mb-1">Secure Lending</div>
                    <div className="text-green-200/80">Your funds are protected by Bitcoin over-collateralization.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Ember Protocol
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Stats</a>
              
              {connectedWallet || connectedMetaMask ? (
                <div className="flex items-center space-x-3">
                  {connectedWallet && (
                    <div className="flex items-center px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm text-green-300">{connectedWallet}</span>
                    </div>
                  )}
                  {connectedMetaMask && (
                    <div className="flex items-center px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                      <span className="text-sm text-blue-300">{connectedMetaMask.slice(0, 8)}...{connectedMetaMask.slice(-6)}</span>
                    </div>
                  )}
                  <button 
                    onClick={() => setCurrentPage('manage-loans')}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                  >
                    Manage Loans
                  </button>
                  <button 
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowWalletModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 px-6 pt-20 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6">
                  <Bitcoin className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-sm text-orange-300">Native Bitcoin Collateralized Loans</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                  Unlock Liquidity
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
                  From Your Bitcoin
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Get instant USDC/USDT loans using your native Bitcoin as collateral. 
                No bridging, no wrapping, no complexity - just one click to liquidity.
              </p>

              {/* Value Props */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex flex-col items-center p-4 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl">
                    <div className="text-orange-400 mb-2">
                      {benefit.icon}
                    </div>
                    <h3 className="text-sm font-semibold mb-1 text-center">{benefit.title}</h3>
                    <p className="text-xs text-gray-400 text-center">{benefit.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Launch App Button */}
              <div className="mb-16">
                <button 
                  onClick={handleGetLoan}
                  className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                >
                  <span className="flex items-center">
                    <Bitcoin className="w-6 h-6 mr-3" />
                    {connectedWallet ? 'Get Your Bitcoin Loan' : 'Connect Wallet to Start'}
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  {connectedWallet ? 'One click • No bridging • Instant liquidity' : 'Connect your Bitcoin wallet to get started'}
                </p>
              </div>
              
              {/* Stats */}
              <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Liquidity Provider Section */}
        <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm text-green-300">Risk-Free Lending</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Earn 4% APY Risk-Free
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Lend your USDC, USDT, and other stablecoins to earn guaranteed returns. 
                100% backed by over-collateralized Bitcoin - no impermanent loss, no complexity.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {lendingBenefits.map((benefit, idx) => (
                <div key={idx} className="flex flex-col items-center p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl">
                  <div className="text-green-400 mb-3">
                    {benefit.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-2 text-center">{benefit.title}</h3>
                  <p className="text-xs text-gray-400 text-center">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">Why Ember Protocol Beats Traditional DeFi</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-4">Feature</th>
                      <th className="text-center py-4 px-4 text-green-400">Ember Protocol</th>
                      <th className="text-center py-4 px-4 text-gray-400">AMM Liquidity Pools</th>
                      <th className="text-center py-4 px-4 text-gray-400">Traditional Lending</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 px-4 font-medium">Impermanent Loss</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ None</td>
                      <td className="py-4 px-4 text-center text-red-400">✗ High Risk</td>
                      <td className="py-4 px-4 text-center text-yellow-400">~ Variable</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 px-4 font-medium">Guaranteed Returns</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ Fixed APY</td>
                      <td className="py-4 px-4 text-center text-red-400">✗ Variable</td>
                      <td className="py-4 px-4 text-center text-yellow-400">~ Depends</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 px-4 font-medium">Collateral Security</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ Bitcoin Backed</td>
                      <td className="py-4 px-4 text-center text-red-400">✗ No Collateral</td>
                      <td className="py-4 px-4 text-center text-yellow-400">~ Mixed Assets</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 px-4 font-medium">Liquidity Access</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ EP Tokens</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ LP Tokens</td>
                      <td className="py-4 px-4 text-center text-red-400">✗ Locked</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Complexity</td>
                      <td className="py-4 px-4 text-center text-green-400">✓ One Click</td>
                      <td className="py-4 px-4 text-center text-red-400">✗ Complex</td>
                      <td className="py-4 px-4 text-center text-yellow-400">~ Moderate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button 
                onClick={handleLendTokens}
                className="group relative px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
              >
                <span className="flex items-center">
                  <DollarSign className="w-6 h-6 mr-3" />
                  {connectedMetaMask ? 'Start Earning Risk-Free Returns' : 'Connect MetaMask to Lend'}
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
              <p className="text-sm text-gray-400 mt-3">
                {connectedMetaMask ? 'Earn guaranteed returns • Get tradeable EP tokens • 100% Bitcoin secured' : 'Connect MetaMask to start earning risk-free returns'}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative z-10 px-6 py-20 bg-gray-800/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  How It Works
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Three simple steps to unlock liquidity from your Bitcoin holdings
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Connect Your Bitcoin Wallet</h3>
                <p className="text-gray-400">Connect your Bitcoin wallet - your BTC stays in your control, no custody required</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Set Loan Terms</h3>
                <p className="text-gray-400">Choose your loan amount in USDC/USDT and collateral ratio - instant rate calculation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Receive Instant Loan</h3>
                <p className="text-gray-400">One click execution - receive USDC/USDT immediately while keeping your Bitcoin native</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Why Choose Ember Protocol
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                The most advanced Bitcoin collateralized lending platform with unmatched simplicity and security
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-orange-500/10 to-red-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Unlock Your Bitcoin?
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of Bitcoin holders who've discovered the power of native collateralized lending
            </p>
            
            <button 
              onClick={handleGetLoan}
              className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
            >
              <span className="flex items-center">
                <Bitcoin className="w-6 h-6 mr-3" />
                {connectedWallet ? 'Start Your First Loan' : 'Connect Bitcoin Wallet'}
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="relative z-10 px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Join the Community
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Connect with Bitcoin holders and DeFi enthusiasts leveraging native Bitcoin collateral
            </p>
            
            <div className="flex justify-center space-x-6">
              <a href="#" className="group p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-orange-500/50 transition-all duration-200 hover:transform hover:scale-105">
                <Twitter className="w-6 h-6 text-gray-400 group-hover:text-orange-400" />
              </a>
              <a href="#" className="group p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-orange-500/50 transition-all duration-200 hover:transform hover:scale-105">
                <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-orange-400" />
              </a>
              <a href="#" className="group p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:border-orange-500/50 transition-all duration-200 hover:transform hover:scale-105">
                <Github className="w-6 h-6 text-gray-400 group-hover:text-orange-400" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Ember Protocol
                </span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2024 Ember Protocol. Native Bitcoin collateralized lending.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;