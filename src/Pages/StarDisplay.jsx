import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarDisplay = ({ rating }) => {
  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) =>
        i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
      )}
    </div>
  );
};

export default StarDisplay;
