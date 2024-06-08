import { emailDetailsType, Label } from "@/app/types";
import React from "react";

function getLabelColor(label: Label) {
  switch (label) {
    case Label.Important:
      return "bg-green-500";
    case Label.Marketing:
      return "bg-yellow-500";
    case Label.Spam:
      return "bg-red-500";
    case Label.Promotional:
      return "bg-purple-500";
    case Label.Social:
      return "bg-blue-500";
    case Label.General:
      return "bg-indigo-500";
    case Label.Nothing:
      return "invisible";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

const EmailCard = ({ category, from, snippet, index }: emailDetailsType) => {
  const chipClasses = `inline-block rounded-full px-3 py-1 text-sm font-semibold ${getLabelColor(
    Label[category]
  )}`;
  return (
    <div
      data-id={index}
      className="p-5 bg-white email-card border rounded-lg mx-1 my-4 shadow-sm space-y-2 scale-100 hover:scale-101 hover:cursor-pointer transition-all duration-200"
    >
      <div className="flex justify-between items-center mt-1 mb-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{from}</h2>
        <span className={chipClasses.toString()}>{category}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{snippet}</p>
    </div>
  );
};

export default EmailCard;
