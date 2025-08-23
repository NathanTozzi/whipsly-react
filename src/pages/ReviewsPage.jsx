import React, { useState } from 'react';
import { Star, ChevronRight, Filter, MessageSquare, ThumbsUp, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadForm from '../components/LeadForm';
import useAffiliateLink from '../hooks/useAffiliateLink';

const ReviewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { getAffiliateLink } = useAffiliateLink();

  // Mock review data
  const reviews = [
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2024,
      rating: 4.8,
      reviewCount: 127,
      pros: ['Excellent reliability', 'Great fuel economy', 'Comfortable interior'],
      cons: ['CVT transmission feel', 'Road noise at highway speeds'],
      summary: 'The 2024 Toyota Camry continues to excel in the midsize sedan segment with outstanding reliability, impressive fuel efficiency, and a surprisingly engaging driving experience.',
      category: 'sedan',
      image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      make: 'Honda',
      model: 'CR-V',
      year: 2024,
      rating: 4.6,
      reviewCount: 89,
      pros: ['Spacious interior', 'Strong safety ratings', 'Excellent resale value'],
      cons: ['Engine can be noisy', 'Infotainment system learning curve'],
      summary: 'Honda\'s compact SUV remains a top choice for families seeking reliability, practicality, and strong value retention.',
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1606611861919-b5b8d107b2ba?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      rating: 4.4,
      reviewCount: 203,
      pros: ['Incredible acceleration', 'Autopilot features', 'Over-the-air updates'],
      cons: ['Build quality inconsistencies', 'Limited service locations'],
      summary: 'The Model 3 continues to push the boundaries of what an electric vehicle can be, though quality control remains a concern.',
      category: 'electric',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      make: 'Ford',
      model: 'F-150',
      year: 2024,
      rating: 4.7,
      reviewCount: 156,
      pros: ['Best-in-class towing', 'Advanced tech features', 'Multiple powertrains'],
      cons: ['Fuel economy with V8', 'Complex infotainment'],
      summary: 'America\'s best-selling truck continues to set the standard for capability, technology, and versatility in the full-size segment.',
      category: 'truck',
      image: 'https://images.unsplash.com/photo-1594736797933-d0b22d3b7c19?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Reviews', count: reviews.length },
    { id: 'sedan', name: 'Sedans', count: reviews.filter(r => r.category === 'sedan').length },
    { id: 'suv', name: 'SUVs', count: reviews.filter(r => r.category === 'suv').length },
    { id: 'truck', name: 'Trucks', count: reviews.filter(r => r.category === 'truck').length },
    { id: 'electric', name: 'Electric', count: reviews.filter(r => r.category === 'electric').length }
  ];

  const filteredReviews = selectedCategory === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  const StarRating = ({ rating, size = 'small' }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === 'large' ? 'h-5 w-5' : 'h-4 w-4'} ${
            star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
      <span className={`ml-2 ${size === 'large' ? 'text-lg' : 'text-sm'} font-medium text-gray-700`}>
        {rating}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-whipsly-navy mb-4">
            Vehicle Reviews & Ratings
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Expert reviews and real owner feedback to help you make informed decisions about your next vehicle purchase.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-whipsly-blue text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-1/3">
                  <img
                    src={review.image}
                    alt={`${review.year} ${review.make} ${review.model}`}
                    className="w-full h-64 md:h-full object-cover rounded-l-xl"
                  />
                </div>
                
                {/* Content */}
                <div className="md:w-2/3 p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-whipsly-navy mb-2">
                        {review.year} {review.make} {review.model}
                      </h3>
                      <div className="flex items-center gap-4">
                        <StarRating rating={review.rating} size="large" />
                        <span className="text-gray-600">({review.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {review.summary}
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Pros */}
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        What We Love
                      </h4>
                      <ul className="space-y-2">
                        {review.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Cons */}
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Room for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {review.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="text-red-500 mr-2 mt-0.5">−</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={getAffiliateLink({ make: review.make, model: review.model, year: review.year })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-whipsly-blue hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Shop {review.make} {review.model}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    
                    <button
                      onClick={() => setShowLeadForm(true)}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-whipsly-blue border-2 border-whipsly-blue font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Get Expert Opinion
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-whipsly-navy to-whipsly-blue rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our automotive experts can help you compare vehicles and find the perfect match for your needs and budget.
            </p>
            <button
              onClick={() => setShowLeadForm(true)}
              className="bg-whipsly-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              Get Personalized Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        variant="modal"
        title="Get Expert Car Advice"
        description="Tell us what you're looking for and we'll help you find the perfect vehicle."
      />
    </div>
  );
};

export default ReviewsPage;