import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, ExternalLink, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAffiliateLink from '../hooks/useAffiliateLink';

const FinancingCalculator = ({ vehiclePrice: initialPrice = null, isModal = false, isOpen = true, onClose = null }) => {
  const [vehiclePrice, setVehiclePrice] = useState(initialPrice || 25000);
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60); // months
  const [interestRate, setInterestRate] = useState(6.5); // APR
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  
  const { getAffiliateLink } = useAffiliateLink();

  // Calculate monthly payment when inputs change
  useEffect(() => {
    calculatePayment();
  }, [vehiclePrice, downPayment, loanTerm, interestRate]);

  // Update down payment when vehicle price changes
  useEffect(() => {
    if (initialPrice && initialPrice !== vehiclePrice) {
      setVehiclePrice(initialPrice);
      // Set down payment to 20% of vehicle price by default
      setDownPayment(Math.round(initialPrice * 0.2));
    }
  }, [initialPrice]);

  const calculatePayment = () => {
    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    if (principal <= 0) {
      setMonthlyPayment(0);
      setTotalCost(vehiclePrice);
      setTotalInterest(0);
      return;
    }

    if (monthlyRate === 0) {
      // No interest case
      const payment = principal / numberOfPayments;
      setMonthlyPayment(payment);
      setTotalCost(vehiclePrice);
      setTotalInterest(0);
    } else {
      // Standard loan calculation: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const total = payment * numberOfPayments + downPayment;
      const interest = total - vehiclePrice;
      
      setMonthlyPayment(payment);
      setTotalCost(total);
      setTotalInterest(interest);
    }
  };

  // Preset loan terms
  const loanTermOptions = [
    { months: 36, label: '3 years', recommended: false },
    { months: 48, label: '4 years', recommended: false },
    { months: 60, label: '5 years', recommended: true },
    { months: 72, label: '6 years', recommended: false },
    { months: 84, label: '7 years', recommended: false }
  ];

  // Interest rate suggestions based on credit score
  const creditScoreRates = [
    { score: 'Excellent (750+)', rate: 4.5, color: 'text-green-600' },
    { score: 'Good (700-749)', rate: 6.5, color: 'text-blue-600' },
    { score: 'Fair (650-699)', rate: 8.5, color: 'text-yellow-600' },
    { score: 'Poor (600-649)', rate: 12.0, color: 'text-red-600' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CalculatorContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-whipsly-blue/10 rounded-full mb-4">
          <Calculator className="h-6 w-6 text-whipsly-blue" />
        </div>
        <h3 className="text-2xl font-bold text-whipsly-navy mb-2">
          Auto Loan Calculator
        </h3>
        <p className="text-gray-600">
          Calculate your estimated monthly payment and see financing options
        </p>
      </div>

      {/* Calculator Form */}
      <div className="space-y-6">
        {/* Vehicle Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Vehicle Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-whipsly-blue focus:outline-none transition-colors"
              min="0"
              step="1000"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Down Payment
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-whipsly-blue focus:outline-none transition-colors"
              min="0"
              max={vehiclePrice}
              step="500"
            />
          </div>
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max={vehiclePrice * 0.5}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>{((downPayment / vehiclePrice) * 100).toFixed(0)}% of price</span>
              <span>{formatCurrency(vehiclePrice * 0.5)}</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Loan Term
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {loanTermOptions.map((option) => (
              <button
                key={option.months}
                onClick={() => setLoanTerm(option.months)}
                className={`relative py-3 px-3 rounded-lg text-sm font-medium transition-all ${
                  loanTerm === option.months
                    ? 'bg-whipsly-blue text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {option.label}
                {option.recommended && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Longer terms = lower payments but more interest paid
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Percentage Rate (APR)
          </label>
          <div className="relative">
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-whipsly-blue focus:outline-none transition-colors"
              min="0"
              max="30"
              step="0.1"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              %
            </span>
          </div>
          <div className="mt-3">
            <input
              type="range"
              min="2"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          
          {/* Credit Score Guide */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Typical rates by credit score:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {creditScoreRates.map((item, index) => (
                <button
                  key={`credit-${index}-${item.rate}`}
                  onClick={() => setInterestRate(item.rate)}
                  className={`text-left hover:bg-white/50 p-2 rounded transition-colors ${item.color}`}
                >
                  <div className="font-medium">{item.score}</div>
                  <div className="text-gray-600">{item.rate}% APR</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-r from-whipsly-navy to-whipsly-blue rounded-xl p-6 text-white">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2">
            {formatCurrency(monthlyPayment)}
          </div>
          <div className="text-blue-100">Estimated Monthly Payment</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold mb-1">
              {formatCurrency(totalCost)}
            </div>
            <div className="text-blue-100 text-sm">Total Cost</div>
          </div>
          <div>
            <div className="text-2xl font-semibold mb-1">
              {formatCurrency(totalInterest)}
            </div>
            <div className="text-blue-100 text-sm">Total Interest</div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-100">Loan Amount:</span>
              <span>{formatCurrency(vehiclePrice - downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Down Payment:</span>
              <span>{formatCurrency(downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-100">Loan Term:</span>
              <span>{loanTerm} months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => setShowFinancingModal(true)}
          className="w-full bg-whipsly-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <TrendingUp className="h-5 w-5" />
          See Financing Options
        </button>
        
        <button
          onClick={() => window.open(getAffiliateLink(), '_blank')}
          className="w-full bg-white hover:bg-gray-50 text-whipsly-blue border-2 border-whipsly-blue font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Get Pre-Approved Now
        </button>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center p-3 bg-gray-50 rounded-lg">
        <strong>Disclaimer:</strong> This calculator provides estimates only. Actual rates and terms may vary based on creditworthiness, 
        vehicle details, and lender requirements. See our partners for official quotes.
      </div>
    </div>
  );

  if (isModal) {
    return (
      <AnimatePresence>
        {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <CalculatorContent />
          </motion.div>

          {/* Financing Options Modal */}
          <FinancingOptionsModal 
            isOpen={showFinancingModal} 
            onClose={() => setShowFinancingModal(false)}
            monthlyPayment={monthlyPayment}
          />
        </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <CalculatorContent />
      
      {/* Financing Options Modal */}
      <FinancingOptionsModal 
        isOpen={showFinancingModal} 
        onClose={() => setShowFinancingModal(false)}
        monthlyPayment={monthlyPayment}
      />
    </div>
  );
};

// Financing Options Modal Component
const FinancingOptionsModal = ({ isOpen, onClose, monthlyPayment }) => {
  const { getAffiliateLink } = useAffiliateLink();

  const financingPartners = [
    {
      name: 'Capital One Auto Navigator',
      description: 'Pre-qualify with no impact to your credit score',
      features: ['No dealer visits required', 'See real offers from dealers', 'Shop with confidence'],
      url: getAffiliateLink(),
      icon: '💳',
      badge: 'Most Popular',
      badgeColor: 'bg-green-500'
    },
    {
      name: 'LightStream Auto Loans',
      description: 'Low rates for qualified borrowers',
      features: ['Same-day funding available', 'No fees ever', 'Rate beat program'],
      url: 'https://www.lightstream.com/auto-loans?utm_source=whipsly',
      icon: '⚡',
      badge: 'Lowest Rates',
      badgeColor: 'bg-blue-500'
    },
    {
      name: 'myAutoloan',
      description: 'Get approved in minutes, even with bad credit',
      features: ['Quick 2-minute application', 'Bad credit OK', 'Refinancing available'],
      url: 'https://www.myautoloan.com/?ref=whipsly',
      icon: '🚗',
      badge: 'Bad Credit OK',
      badgeColor: 'bg-yellow-500'
    },
    {
      name: 'Auto Credit Express',
      description: 'Connects you with dealers in your area',
      features: ['Local dealer network', 'All credit types', 'Fast approval process'],
      url: 'https://www.autocreditexpress.com/?src=whipsly',
      icon: '🏪',
      badge: 'Local Dealers',
      badgeColor: 'bg-purple-500'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-whipsly-navy">Auto Financing Options</h3>
              <p className="text-gray-600">Based on your ${monthlyPayment.toFixed(0)} monthly payment estimate</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            {financingPartners.map((partner, index) => (
              <div key={`partner-${index}-${partner.name.replace(/\s+/g, '-').toLowerCase()}`} className="border border-gray-200 rounded-xl p-6 hover:border-whipsly-blue transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{partner.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-whipsly-navy">{partner.name}</h4>
                      <span className={`${partner.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                        {partner.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{partner.description}</p>
                    <ul className="space-y-1 mb-4">
                      {partner.features.map((feature, idx) => (
                        <li key={`${index}-${idx}`} className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="text-green-500 text-xs">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-whipsly-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Get Started
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">Shopping for auto loans?</p>
                <p className="text-yellow-700">
                  Multiple credit inquiries for auto loans within a 14-45 day period typically count as one inquiry 
                  for credit scoring purposes. Shop around with confidence!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FinancingCalculator;