import { Label } from "@/app/types";

/**
 * Returns the Tailwind CSS class for the given label.
 * @param label - The label to get the color for.
 * @returns The Tailwind CSS class representing the color for the label.
 */
export default function getLabelColor(label: Label) {
  switch (label) {
    case Label.Important:
      return "bg-green-500 text-white";
    case Label.Marketing:
      return "bg-yellow-500 text-white";
    case Label.Spam:
      return "bg-red-500 text-white";
    case Label.Promotions:
      return "bg-purple-500 text-white";
    case Label.Social:
      return "bg-blue-500 text-white";
    case Label.General:
      return "bg-indigo-500 text-white";
    case Label.Nothing:
      return "invisible";
    default:
      return "bg-gray-200 text-gray-800";
  }
}
