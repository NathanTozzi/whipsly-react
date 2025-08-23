import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MapPin, Car, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAffiliateLink from '../hooks/useAffiliateLink';

const LeadForm = ({ 
  isOpen = false, 
  onClose = () => {}, 
  variant = 'sidebar', // 'sidebar', 'modal', 'drawer' 
  title = "Get Your Perfect Car Match",
  description = "Tell us what you're looking for and we'll help you find the best deals."
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    vehicleInterest: '',
    budget: '',
    timeframe: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { userLocation, getBestAffiliate } = useAffiliateLink();

  const budgetRanges = [
    { value: '', label: 'Any Budget' },
    { value: 'under-20k', label: 'Under $20,000' },
    { value: '20k-30k', label: '$20,000 - $30,000' },
    { value: '30k-40k', label: '$30,000 - $40,000' },
    { value: '40k-50k', label: '$40,000 - $50,000' },
    { value: 'over-50k', label: 'Over $50,000' }
  ];

  const timeframes = [
    { value: '', label: 'Not specified' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '3-months', label: 'Within 3 months' },
    { value: '6-months', label: 'Within 6 months' },
    { value: 'research', label: 'Just researching' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare form data for FormSubmit
      const submitData = {
        ...formData,
        _subject: 'New Whipsly Lead',
        _template: 'table',
        _captcha: 'false',
        _next: window.location.origin + '?lead-submitted=true',
        // Hidden fields for tracking
        affiliate_partner: getBestAffiliate(),
        user_location: userLocation?.city || 'Unknown',
        user_state: userLocation?.state || 'Unknown',
        submission_timestamp: new Date().toISOString(),
        source_page: window.location.pathname
      };
      
      // Submit to FormSubmit
      const response = await fetch('https://formsubmit.co/support@whipsly.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        
        // Track lead submission
        if (window.gtag) {
          window.gtag('event', 'lead_submission', {
            event_category: 'Lead Generation',
            event_label: formData.vehicleInterest || 'General',
            value: 1
          });
        }
        
        // Store lead in localStorage for analytics
        const leads = JSON.parse(localStorage.getItem('whipsly-leads') || '[]');
        leads.push({
          timestamp: Date.now(),
          data: formData
        });
        localStorage.setItem('whipsly-leads', JSON.stringify(leads));
        
        // Auto-close after success
        setTimeout(() => {
          onClose();
          setIsSubmitted(false);
          setFormData({
            name: '',
            email: '',
            phone: '',
            zip: '',
            vehicleInterest: '',
            budget: '',
            timeframe: '',
            message: ''
          });
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-whipsly-navy mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      {isSubmitted ? (
        // Success State
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-green-600 mb-2">
            Thank You!
          </h4>
          <p className="text-gray-600 mb-4">
            We've received your request and will contact you within 24 hours with personalized vehicle recommendations.
          </p>
          <div className="text-sm text-gray-500">
            Check your email for a confirmation.
          </div>
        </motion.div>
      ) : (
        // Form State
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ZIP Code
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder={userLocation?.zip || "12345"}
              />
            </div>
          </div>

          {/* Vehicle Interest */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              What car are you interested in?
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="vehicleInterest"
                value={formData.vehicleInterest}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="e.g. Toyota Camry, SUV, Electric car..."
              />
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Budget Range
            </label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="input-field"
            >
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              When are you looking to buy?
            </label>
            <select
              name="timeframe"
              value={formData.timeframe}
              onChange={handleInputChange}
              className="input-field"
            >
              {timeframes.map(time => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Any specific requirements or questions..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Get My Car Recommendations</span>
              </>
            )}
          </button>

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          {/* Privacy Notice */}
          <div className="text-xs text-gray-500 text-center">
            By submitting this form, you agree to be contacted by our team. 
            We respect your privacy and will never share your information.
          </div>
        </form>
      )}
    </div>
  );

  // Sidebar variant (always visible)
  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
        <FormContent />
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div /> {/* Spacer */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FormContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Drawer variant (mobile bottom drawer)
  if (variant === 'drawer') {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onClose}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FormContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return null;
};

export default LeadForm;