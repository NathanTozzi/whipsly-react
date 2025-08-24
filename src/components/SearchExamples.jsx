import React from 'react';
import { Sparkles, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchExamples = ({ onExampleClick }) => {
  const examples = [
    {
      query: "reliable family SUV under $30k",
      description: "Find family-friendly SUVs with good reliability under $30,000",
      category: "Family",
      icon: "👨‍👩‍👧‍👦"
    },
    {
      query: "fuel efficient hybrid Toyota",
      description: "Discover eco-friendly hybrid vehicles from Toyota",
      category: "Eco",
      icon: "🌱"
    },
    {
      query: "luxury sedan over $40k with low mileage",
      description: "Premium sedans above $40,000 with minimal wear",
      category: "Luxury",
      icon: "⭐"
    },
    {
      query: "budget car under $20k 2020 or newer",
      description: "Affordable vehicles under $20k from recent model years",
      category: "Budget",
      icon: "💰"
    },
    {
      query: "electric vehicle Tesla Model 3",
      description: "Find electric Tesla Model 3 vehicles",
      category: "Electric",
      icon: "⚡"
    },
    {
      query: "truck with 4WD for work",
      description: "Heavy-duty trucks with four-wheel drive capability",
      category: "Work",
      icon: "🚛"
    }
  ];

  const categoryColors = {
    Family: 'bg-blue-100 text-blue-700 border-blue-200',
    Eco: 'bg-green-100 text-green-700 border-green-200',
    Luxury: 'bg-purple-100 text-purple-700 border-purple-200',
    Budget: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Electric: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Work: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-100">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
        <h3 className="text-lg font-semibold text-purple-900">
          Try AI-Powered Natural Language Search
        </h3>
      </div>
      
      <p className="text-purple-700 mb-6">
        Search using everyday language! Click any example below to see how AI understands your intent.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all duration-200 group"
            onClick={() => onExampleClick && onExampleClick(example.query)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{example.icon}</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[example.category]}`}>
                {example.category}
              </span>
            </div>
            
            <div className="mb-2">
              <div className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                "{example.query}"
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {example.description}
            </div>
            
            <div className="flex items-center mt-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="h-4 w-4 mr-1" />
              <span className="text-xs font-medium">Try this search →</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center space-x-6 text-sm text-purple-600">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1" />
            <span>Smart filtering</span>
          </div>
          <div className="flex items-center">
            <Sparkles className="h-4 w-4 mr-1" />
            <span>Intent recognition</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            <span>Instant results</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchExamples;