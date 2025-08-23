import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Star, ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import LeadForm from '../components/LeadForm';
import FinancingCalculator from '../components/FinancingCalculator';
import useVehicleData from '../hooks/useVehicleData';
import useAffiliateLink from '../hooks/useAffiliateLink';

const Homepage = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const { getFeaturedVehicles, getBestDeals } = useVehicleData();
  const { getAffiliateLink } = useAffiliateLink();

  const featuredVehicles = getFeaturedVehicles(6);
  const bestDeals = getBestDeals(4);

  const features = [
    {
      icon: Zap,
      title: 'Instant Search',
      description: 'Find your perfect car in seconds with our AI-powered search technology',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Trusted Partners',
      description: 'We only work with verified dealers and trusted automotive partners',
      color: 'text-green-500'
    },
    {
      icon: TrendingUp,
      title: 'Best Deals',
      description: 'Compare prices across multiple platforms to find the best deals available',
      color: 'text-blue-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'Los Angeles, CA',
      text: 'Found my dream car in under 10 minutes! The financing calculator helped me budget perfectly.',
      rating: 5,
      vehicle: '2023 Honda Accord'
    },
    {
      name: 'Mike Chen',
      location: 'Austin, TX',
      text: 'Whipsly saved me thousands on my truck purchase. The dealer network is incredible.',
      rating: 5,
      vehicle: '2024 Ford F-150'
    },
    {
      name: 'Emily Rodriguez',
      location: 'Miami, FL',
      text: 'As a first-time buyer, the expert guidance made all the difference. Highly recommended!',
      rating: 5,
      vehicle: '2023 Toyota RAV4'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = (price, marketPrice) => {
    return ((marketPrice - price) / marketPrice * 100).toFixed(0);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-whipsly-navy mb-4">
              Why Choose Whipsly?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We've revolutionized car shopping with cutting-edge technology and trusted partnerships
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-whipsly-navy mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-whipsly-navy mb-4">
              Today's Best Deals
            </h2>
            <p className="text-gray-600 text-lg">
              Hand-picked vehicles with the biggest savings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestDeals.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card card-hover cursor-pointer"
                onClick={() => window.open(getAffiliateLink({
                  make: vehicle.make,
                  model: vehicle.model,
                  year: vehicle.year
                }), '_blank')}
              >
                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Save {calculateSavings(vehicle.price, vehicle.marketPrice)}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-whipsly-navy mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-bold text-whipsly-blue">
                      {formatPrice(vehicle.price)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {formatPrice(vehicle.marketPrice)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {vehicle.mileage.toLocaleString()} miles • {vehicle.location}
                  </div>
                  <button className="btn-primary w-full text-sm">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowLeadForm(true)}
              className="btn-secondary"
            >
              See More Deals
            </button>
          </div>
        </div>
      </section>

      {/* Financing Calculator CTA */}
      <section className="py-16 bg-gradient-to-r from-whipsly-navy to-whipsly-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Calculate Your Monthly Payment
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Use our financing calculator to estimate payments and explore loan options from trusted lenders
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setShowCalculator(true)}
                className="bg-whipsly-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Try Calculator
              </button>
              <button
                onClick={() => setShowLeadForm(true)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 border border-white/20"
              >
                Get Pre-Approved
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-whipsly-navy mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of satisfied car buyers who found their perfect match
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-whipsly-navy">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.location} • {testimonial.vehicle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-whipsly-navy mb-6">
                Ready to Find Your Perfect Car?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Get personalized recommendations, financing options, and expert guidance 
                from our team of automotive specialists. Start your car buying journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.href = '/search'}
                  className="btn-primary flex items-center gap-2"
                >
                  <span>Start Searching</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="btn-secondary"
                >
                  Get Expert Help
                </button>
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:w-1/3"
            >
              <LeadForm 
                variant="sidebar"
                title="Get Started Today"
                description="Tell us what you're looking for and we'll help you find it."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <LeadForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        variant="modal"
        title="Find Your Perfect Car"
        description="Get personalized recommendations from our experts"
      />

      <FinancingCalculator
        isModal={true}
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </div>
  );
};

export default Homepage;