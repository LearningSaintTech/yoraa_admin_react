// SizeChartModal.jsx
import React, { useState, useEffect } from 'react';
import { getItemDetailsById } from "../../Components/commonComponent/UserApi";

const SizeChartModal = ({ isOpen, onClose, itemId, onConfirm }) => {
  const [unit, setUnit] = useState('In');
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({
    sizeChartInch: '',
    sizeChartCm: '',
    sizeMeasurement: '',
    sizes: [], // Array of size objects with size and stock
  });
  const [selectedSize, setSelectedSize] = useState('S'); // Default size
  const [activeTab, setActiveTab] = useState('Size Chart'); // Tab state
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']; // All possible sizes

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (itemId) {
        try {
          setLoading(true);
          const response = await getItemDetailsById(itemId);
          setItemDetails({
            sizeChartInch: response.sizeChartInch || 'https://via.placeholder.com/300x250', // Inch chart image
            sizeChartCm: response.sizeChartCm || 'https://via.placeholder.com/300x250',     // Cm chart image
            sizeMeasurement: response.sizeMeasurement || 'https://via.placeholder.com/300x250', // How to measure image
            sizes: response.sizes || [], // Fetch sizes array from API
          });
        } catch (error) {
          console.error('Failed to fetch item details:', error);
          setItemDetails({
            sizeChartInch: 'https://via.placeholder.com/300x250',
            sizeChartCm: 'https://via.placeholder.com/300x250',
            sizeMeasurement: 'https://via.placeholder.com/300x250',
            sizes: [],
          });
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchItemDetails();
    }
  }, [itemId, isOpen]);

  const handleConfirm = () => {
    onConfirm(selectedSize);
    onClose();
  };

  // Check if a size is available (present in sizes array and stock > 0)
  const isSizeAvailable = (size) => {
    const sizeData = itemDetails.sizes.find(s => s.size === size);
    return sizeData && sizeData.stock > 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Header and Tabs */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center space-x-4 mb-4 border-b border-gray-300">
              <button
                onClick={() => setActiveTab('Size Chart')}
                className={`pb-2 ${activeTab === 'Size Chart' ? 'border-b-2 border-black font-normal' : 'text-gray-500'}`}
              >
                Size Chart
              </button>
              <button
                onClick={() => setActiveTab('How To Measure')}
                className={`pb-2 ${activeTab === 'How To Measure' ? 'border-b-2 border-black font-normal' : 'text-gray-500'}`}
              >
                How To Measure
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'Size Chart' ? (
              <div className="overflow-x-auto">
                <img
                  src={unit === 'In' ? itemDetails.sizeChartInch : itemDetails.sizeChartCm}
                  alt={unit === 'In' ? 'Size Chart (Inch)' : 'Size Chart (Cm)'}
                  className="w-full h-64 object-contain"
                />
              </div>
            ) : (
              <img
                src={itemDetails.sizeMeasurement}
                alt="How To Measure"
                className="w-full h-64 object-contain"
              />
            )}

            {/* Unit Toggle */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setUnit('In')}
                className={`px-4 py-2 rounded-lg text-sm font-light transition-all duration-200 ${
                  unit === 'In' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Inch
              </button>
              <button
                onClick={() => setUnit('Cm')}
                className={`px-4 py-2 rounded-lg text-sm font-light transition-all duration-200 ${
                  unit === 'Cm' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cm
              </button>
            </div>

            {/* Size Selection */}
            <div className="flex justify-around mt-4">
              {allSizes.map((size) => {
                const available = isSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={() => available && setSelectedSize(size)}
                    disabled={!available}
                    className={`px-4 py-2 rounded-lg text-sm uppercase tracking-wide transition-all duration-200 ${
                      selectedSize === size && available
                        ? 'bg-black text-white font-semibold'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${!available ? 'line-through text-gray-400 cursor-not-allowed' : ''}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirm}
              className="w-full mt-6 py-2 bg-black text-white font-light uppercase tracking-wide hover:bg-gray-800 transition-colors duration-200"
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SizeChartModal;