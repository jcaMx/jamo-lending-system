
import React, { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={
              "px-4 py-2 -mb-px font-medium border-b-2 transition-all " +
              (active === index
                  ? 'bg-[#D97706] text-white border-b-2 border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-b-2 border-transparent hover:text-gray-800')
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div className="mt-4 p-4 bg-white rounded shadow-sm">
        {tabs[active].content}
      </div>
    </div>
  );
}
