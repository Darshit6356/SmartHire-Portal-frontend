import Header from "./Header"
import Sidebar from "./Sidebar"

const DashboardLayout = ({ children, userRole, userName, tabs, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userName={userName} userRole={userRole} />
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
