
import React, { useMemo, useState } from "react";
import { useThemeStore } from "../../store/themeStore";
import { cn } from "../../lib/utils";
import useMainStore from "../../store/mainStore";


const UserPage: React.FC = () => {

  const { search } = useMainStore()

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

  const filteredUsers = useMemo(() => (users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )), [search, users])
  const theme = useThemeStore(state => state.getTheme());

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

  return (
    <main className="">
      <div className={cn("min-h-screen w-full text-white", theme.gradient)}>
        <h1 className={cn("text-xl font-bold mb-6 ml-20", theme.text)} >User Management</h1>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl max-w-5xl mx-auto">
          <h2 className={cn("text-lg font-semibold", theme.text)}>Management User Accounts</h2>
          <p className={cn("text-sm text-gray-200 mt-1 mb-6", theme.textSecondary)}>Invite and manage additional user accounts for your organization</p>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className={cn("border-b border-white/20", theme.text)}>
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
                  <td className={cn("py-3 flex items-center gap-2", theme.text)}>
                    {u.name}{u.role && <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-md">{u.role}</span>}
                  </td>
                  <td className={cn("py-3 text-blue-300 underline cursor-pointer", theme.textSecondary)}>{u.email}</td>
                  <td className="py-3 text-gray-500">{u.joined}</td>
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

          <button
            className="mt-6 px-4 py-2 bg-white text-black font-medium text-sm rounded-md shadow hover:bg-yellow-300"
            onClick={() => setOpenAdd(true)}
          >Invite user</button>
        </div>
      </div>

      {openAdd && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={cn("bg-gradient-to-br rounded-xl p-6 w-full max-w-md shadow-xl", theme.primary, theme.textSecondary)}>
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input type="text" className="text-white w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 " value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter full name" /></div>
              <div><label className="text-sm font-medium">Email</label><input type="email" className="text-white w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 " value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Enter email" /></div>
              <div><label className="text-sm font-medium ">Role</label><select className=" text-gray-300 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 " value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}><option value="Admin">Admin</option><option value="User">User</option><option value="Editor">Editor</option></select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpenAdd(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleAddUser} className={`px-4 py-2  rounded-md bg-gradient-to-br ${theme.text} ${theme.primary}  border `}>Add</button>
            </div>
          </div>
        </div>
      )}

      {openEdit && editIndex !== null && (

        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={cn("rounded-xl p-6 w-full max-w-md shadow-xl bg-gradient-to-tr", theme.primary, theme.textSecondary)}>
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className={cn("text-gray-500 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300 bg-gradient-to-tr", theme.cardBg)}
                  value={users[editIndex].name}
                  onChange={e => handleEditUser(editIndex, "name", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className={cn("text-gray-500 w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-200 bg-gradient-to-tr", theme.cardBg)}
                  value={users[editIndex].status}
                  onChange={e => handleEditUser(editIndex, "status", e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={() => setOpenEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                Close
              </button>
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

  );
};

export default UserPage;