import { useState } from "react";

export default function Carousel({ data }) {
    console.log("data",data)
  const [index, setIndex] = useState(0);
  const dataLength = data.length;

  function handleNext() {
    setIndex((prev) => {
      if (index === dataLength - 1) {
        return 0;
      }
      return prev + 1;
    });
  }

  function handlePrevious() {
    setIndex((prev) => {
      if (index === 0) {
        return dataLength - 1;
      }
      return prev - 1;
    });
  }

  return (
    <div className="relative w-full  aspect-square">
      <div className="w-full h-full mx-5 relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-16 top-1/2 -translate-y-1/2 bg-white w-10 h-10 shadow-lg rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous image"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
              fill="#374151"
            />
          </svg>
        </button>

        {/* Image */}
        <img 
          className="w-full h-full object-contain rounded-lg"
          src={data[index]} 
          alt={`Product image ${index + 1} of ${dataLength}`}
        />

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-16 top-1/2 -translate-y-1/2 bg-white w-10 h-10 shadow-lg rounded-full hover:bg-gray-100 transition-all duration-200 flex items-center justify-center border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next image"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
              fill="#374151"
            />
          </svg>
        </button>

        {/* Image Pagination Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {data.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === index ? 'bg-white' : 'bg-slate-400'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}