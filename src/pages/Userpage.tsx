
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Calendar,
  MessageSquare,
  Bell,
  Search as SearchIcon,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Palmtree
} from "lucide-react";

const UserPage: React.FC = () => {
const navigate = useNavigate();


const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isProfileOpen, setIsProfileOpen] = useState(false);
const [activeNav, setActiveNav] = useState("users");
const [search, setSearch] = useState("");

const [users, setUsers] = useState([
{ name: "Jonh Doe", role: "Owner", email: "Jonh1558@gmail.com", joined: "October 2, 2025", status: "Inactive" },
{ name: "Sok Dara", role: "", email: "dara5855@gmail.com", joined: "November 2, 2025", status: "Active" },
{ name: "Vy Rak", role: "", email: "rak58884@gmail.com", joined: "July 4, 2025", status: "Inactive" },
{ name: "Da Ny", role: "", email: "ny87444@gmail.com", joined: "June 8, 2025", status: "Active" },
]);
const [openAdd, setOpenAdd] = useState(false);
const [newUser, setNewUser] = useState({ name: "", email: "", role: "User" });
const [openEdit, setOpenEdit] = useState(false);
const [editIndex, setEditIndex] = useState<number | null>(null);

const navItems = [
{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/Dashboard" },
{ id: "users", label: "Users", icon: Users, path: "/user" },
{ id: "reports", label: "Reports", icon: FileText },
{ id: "analytics", label: "Analytics", icon: BarChart3 },
{ id: "calendar", label: "Calendar", icon: Calendar },
{ id: "messages", label: "Messages", icon: MessageSquare },
{ id: "settings", label: "Settings", icon: Settings },
];

const filteredUsers = users.filter(u =>
u.name.toLowerCase().includes(search.toLowerCase()) ||
u.email.toLowerCase().includes(search.toLowerCase())
);

// ================== Handlers ==================
const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

const handleAddUser = () => {
const today = new Date().toLocaleDateString(undefined, {
year: "numeric", month: "long", day: "numeric"
});
setUsers([...users, { ...newUser, joined: today, status: "Active" }]);
setNewUser({ name: "", email: "", role: "User" });
setOpenAdd(false);
};

const handleEditUser = (index: number, field: "name" | "status", value: string) => {
const updated = [...users];
updated[index][field] = value;
setUsers(updated);
};

// ================== Render ==================
return ( <div className="min-h-screen bg-gradient-to-br from-[#102A43] via-[#0D3C73] to-[#102A43]">
{/* Sidebar */}
<aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#102A43] to-slate-900 border-r border-slate-700/50 transition-all duration-300 z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64`}> <div className='h-20 flex items-center justify-center border-b border-slate-700/50 px-4'> <div className='flex items-center gap-2'> <div className='w-10 h-10 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-lg flex items-center justify-center'> <Palmtree size={24} className='text-slate-900' /> </div> <div> <h1 className='text-[#DAA520] font-bold text-lg'>Palm Biz</h1> <p className='text-xs text-gray-400'>Digital Solutions</p> </div> </div> </div>

    <nav className='flex-1 py-6 px-3 space-y-2'>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveNav(item.id);
              if (item.path) navigate(item.path);
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-[#D5A520]/20 text-[#DAA520] shadow-[0_0_20px_rgba(218,165,32,0.3)]' : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'}`}
          >
            <Icon size={22} className={isActive ? 'drop-shadow-[0_0_8px_rgba(218,165,32,0.6)]' : ''} />
            <span className='font-medium text-sm'>{item.label}</span>
          </button>
        )
      })}
    </nav>
  </aside>

  <div className='lg:ml-64'>
    {/* Header */}
    <header className='h-16 lg:h-20 bg-[#0D3C73]/30 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-20'>
      <div className='h-full px-4 lg:px-6 flex items-center justify-between gap-4'>
        <button onClick={toggleSidebar} className='lg:hidden p-2 text-gray-400 hover:text-[#DAA520] transition-colors rounded-lg hover:bg-slate-700/50'>
          <Menu size={24} />
        </button>
        <div className='flex-1 max-w-xl'>
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#DAA520]/50 focus:ring-1 focus:ring-[#DAA520]/50"
            />
          </div>
        </div>

        {/* Profile & Notification */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <button className='relative p-2 text-gray-400 hover:text-[#DAA520] transition-colors rounded-lg hover:bg-slate-700/50'>
            <Bell size={20} />
            <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
          </button>

          <div className='relative'>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className='flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all'>
              <div className='w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-full flex items-center justify-center flex-shrink-0'>
                <User size={18} className='text-slate-900' />
              </div>
              <div className='text-left hidden md:block'>
                <p className='text-sm font-medium text-white'>John Doe</p>
                <p className='text-xs text-gray-400'>Administrator</p>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className='absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden'>
                <div className='p-4 border-b border-slate-700'>
                  <p className='text-sm font-medium text-white'>John Doe</p>
                  <p className='text-xs text-gray-400'>john.doe@example.com</p>
                </div>
                <div className='py-2'>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors'>
                    <User size={18} /><span className='text-sm'>Profile</span>
                  </button>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-colors'>
                    <Settings size={18} /><span className='text-sm'>Settings</span>
                  </button>
                </div>
                <div className='border-t border-slate-700 py-2'>
                  <button className='w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors'>
                    <LogOut size={18} /><span className='text-sm'>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="p-6">
      <div className="min-h-screen w-full bg-gradient-to-b from-[#0f3c77] to-[#0a4c8a] p-10 text-white">
        <h1 className="text-xl font-bold mb-6 ml-20">User Management</h1>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold">Management User Accounts</h2>
          <p className="text-sm text-gray-200 mt-1 mb-6">Invite and manage additional user accounts for your organization</p>

          {/* Table */}
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/20 text-gray-200">
                <th className="py-2">Name</th>
                <th className="py-2">Login Email</th>
                <th className="py-2">Joined</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className="py-3 flex items-center gap-2">
                    {u.name}{u.role && <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-md">{u.role}</span>}
                  </td>
                  <td className="py-3 text-blue-300 underline cursor-pointer">{u.email}</td>
                  <td className="py-3 text-gray-200">{u.joined}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-md text-xs font-medium ${u.status === "Active" ? "bg-green-500" : "bg-red-500"}`}>{u.status}</span>
                  </td>
                  <td className="py-3">
                    <button
                      className="px-3 py-1 bg-white text-black text-xs rounded-md shadow hover:bg-blue-400"
                      onClick={() => { setEditIndex(index); setOpenEdit(true); }}
                    >View/Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invite user button */}
          <button
            className="mt-6 px-4 py-2 bg-white text-black font-medium text-sm rounded-md shadow hover:bg-yellow-300"
            onClick={() => setOpenAdd(true)}
          >Invite user</button>
        </div>
      </div>

      {/* Add User Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-[#102A43] via-[#0D3C73] to-[#102A43] rounded-xl p-6 w-full max-w-md shadow-xl text-[#DAA520]">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input type="text" className="text-white w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 bg-[#0D3C73]" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter full name" /></div>
              <div><label className="text-sm font-medium">Email</label><input type="email" className="text-white w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 bg-[#0D3C73]" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email" /></div>
              <div><label className="text-sm font-medium ">Role</label><select className=" text-gray-300 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 bg-[#0D3C73]" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}><option value="Admin">Admin</option><option value="User">User</option><option value="Editor">Editor</option></select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpenAdd(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
{openEdit && editIndex !== null && (

  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-[#102A43] via-[#0D3C73] to-[#102A43] rounded-xl p-6 w-full max-w-md shadow-xl text-[#DAA520]">
      <h2 className="text-lg font-semibold mb-4">Edit User</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#DAA520]">Name</label>
          <input
            type="text"
            className="text-gray-500 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 bg-[#0D3C73]"
            value={users[editIndex].name}
            onChange={e => handleEditUser(editIndex, "name", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#DAA520]">Status</label>
          <select
            className="text-gray-500 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-200 bg-[#0D3C73]"
            value={users[editIndex].status}
            onChange={e => handleEditUser(editIndex, "status", e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Button delete User */}
      <div className="flex justify-between gap-3 mt-6">
        {/* Close Button */}
            <button
              onClick={() => setOpenEdit(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
              Close
            </button>

        {/* Delete Button */}
            <button
              onClick={() => {
               const updatedUsers = [...users];
               updatedUsers.splice(editIndex, 1);
               setUsers(updatedUsers);
               setOpenEdit(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete User
           </button>
      </div>
    </div>

  </div>
)}

    </main>
  </div>

{/* Search User Name and Email // Edite user Active & Inactive in table Userpage */}
{isSidebarOpen && <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden pointer-events-none' />}
</div>


);
};

export default UserPage;