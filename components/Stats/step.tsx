import React from "react";

interface Variables {
  Title: React.ReactNode;
  value: React.ReactNode;
}

const Step = ({ Title, value }: Variables) => {
  return (
    <div className="text-center p-4 bg-base-200 rounded-xl shadow">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{Title}</p>
    </div>
  );
};

export default Step;
