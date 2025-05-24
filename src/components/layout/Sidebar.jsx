"use client"

const Sidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] lg:block hidden">
      <nav className="flex flex-col p-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
