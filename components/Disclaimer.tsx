
import React from 'react';
import { StethoscopeIcon } from './icons';

const Disclaimer: React.FC = () => {
  return (
    <div className="mt-8 bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-md shadow-sm" role="alert">
      <div className="flex">
        <div className="py-1">
          <StethoscopeIcon className="h-6 w-6 text-amber-500 mr-4" />
        </div>
        <div>
          <p className="font-bold">Important Disclaimer</p>
          <p className="text-sm">
            This tool is for informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
