import React, { createContext, useContext, useState } from "react";

const TabsContext = createContext();

export const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList = ({ children }) => {
  return (
    <div className="flex space-x-1 border-b border-gray-200 mb-4">
      {children}
    </div>
  );
};

export const Tab = ({ value, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button
      className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
        activeTab === value
          ? "text-blue-600 border-b-2 border-blue-600"
          : "text-gray-500 hover:text-blue-600"
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabPanel = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return <div>{children}</div>;
};
