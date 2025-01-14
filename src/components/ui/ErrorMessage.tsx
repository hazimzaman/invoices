import React from 'react';

interface Props {
  message: string;
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
      {message}
    </div>
  );
};