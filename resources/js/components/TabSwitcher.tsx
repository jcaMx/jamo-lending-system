import React from 'react';

export type TabItem<K extends string> = {
  key: K;
  label: string;
  content: React.ReactNode;
};

type Props<K extends string> = {
  items: TabItem<K>[];
  activeKey: K;
  onChange: (key: K) => void;
  className?: string;
};

export default function TabSwitcher<K extends string>({
  items,
  activeKey,
  onChange,
  className,
}: Props<K>) {
  const currentTab = items.find((tab) => tab.key === activeKey);

  return (
    <div
      className={
        className ??
        'm-4 bg-white rounded-xl border border-amber-100 shadow-[0_2px_10px_rgba(17,24,39,0.06)] space-y-2 mb-6'
      }
    >
      <div className="flex flex-wrap gap-2 border-b border-amber-100 px-3 pt-3">
        {items.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
              activeKey === tab.key
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-4">{currentTab?.content}</div>
    </div>
  );
}
