import React, { useMemo, useState } from "react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import { useCreateUserProfileMutation, useCreateUserMutation, useDeleteUserMutation } from "../../lib/mutations";
import type { TCreateUserInput, TCreateUserProfileInput } from "../../lib/apis/dashboard/userApi";
import { useGetUserQuery } from "../../lib/queries";
import useMainStore from "../../store/mainStore";

const UserPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());

  const search = useMainStore(state => state.search)

  const { data, isLoading: isFetchingUsers } = useGetUserQuery()

  const filteredUser = useMemo(() => {
    if (!data?.data) return []

    if (!search) return data.data

    return data.data.filter(d =>
      d.name?.trim().toLowerCase().includes(search.toLowerCase()) 
      || d.email?.trim().toLowerCase().includes(search.toLowerCase()) 
    )
  }, [data?.data, search])

  const { mutate: createUserProfile } = useCreateUserProfileMutation();
  const { mutate: createUser } = useCreateUserMutation();
  const { mutate: deleteUser } = useDeleteUserMutation();

  const [profile, setProfile] = useState<TCreateUserProfileInput>({
    gender: "Male",
    first_name: "",
    last_name: "",
    nick_name: "",
    email: "",
    telephone: "",
    village: "",
    facebook: "",
    twitter: "",
    link: "",
    position: 1,
    date_of_employment: "",
    branch: 1,
    company: 1,
    project: 1,
    profile_type: 2
  });

  const [user, setUser] = useState<TCreateUserInput>({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    profile: "",
  });

  const [openProfileModal, setOpenProfileModal] = useState<boolean>(false);
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null)

  const handleCreateProfile = () => {
    createUserProfile(profile, {
      onError: (error) => {
        setMessage(error.message)
        console.log(error)
      },
      onSuccess: (data) => {
        setMessage(data.message as string)
        console.log(data)
      }
    })
  };
  console.log(message)
  const handleCreateUser = () => {
    if (user.password !== user.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    createUser(user, {
      onError: (error) => {
        setMessage(error.message)
        console.log(error)
      },
      onSuccess: (data) => {
        setMessage(data.message as string)
        console.log(data)
      }
    })
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id, {
      onError: (error) => {
        setMessage(error.message)
        console.log(error)
      },
      onSuccess: (data) => {
        setMessage(data.message as string)
        console.log(data)
      }
    })
  };

  return (
    <main>
      <div className={cn("min-h-screen w-full text-white", theme.gradient)}>
        <h1 className={cn("text-xl font-bold mb-6 ml-20", theme.text)}>User Management</h1>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl max-w-5xl mx-auto">
          <h2 className={cn("text-lg font-semibold", theme.text)}>
            Management User Accounts
          </h2>
          <p className={cn("text-sm text-gray-200 mt-1 mb-6", theme.textSecondary)}>
            Invite and manage additional user accounts for your organization
          </p>

          {isFetchingUsers ? <span className={cn("text-sm text-gray-200 mt-1 mb-6", theme.textSecondary)}>Loading User...</span> : <table className="w-full text-left text-sm">
            <thead>
              <tr className={cn("border-b border-white/20", theme.text)}>
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser?.map((user, index) => (
                <tr key={index} className="border-b border-white/10">
                  <td className={cn("py-3", theme.text)}>
                    {user.id}
                  </td>
                  <td className={cn("py-3", theme.text)}>
                    {user.name}
                  </td>
                  <td className={cn("py-3 text-blue-300 underline cursor-pointer", theme.textSecondary)}>
                    {user.email}
                  </td>
                  <td className="py-3 text-gray-500">{user.role}</td>
                  <td className="py-3">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium",
                      user.status === "1"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    )}>
                      {user.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      className="px-3 py-1 bg-white text-black text-xs rounded-md shadow hover:bg-blue-400"
                      onClick={() => alert("View/Edit user")}
                    >
                      View/Edit
                    </button>
                    <button
                      className="ml-2 px-3 py-1 bg-red-500 text-white text-xs rounded-md shadow hover:bg-red-400"
                      onClick={() => handleDeleteUser(user.id.toString())}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}

          <div className="block">
            <button
              className="mt-6 px-4 py-2 bg-white text-black font-medium text-sm rounded-md shadow hover:bg-yellow-300"
              onClick={() => setOpenProfileModal(true)}
            >
              Create New User Profile
            </button>
            <button
              className="mt-6 px-4 py-2 bg-white text-black font-medium text-sm rounded-md shadow hover:bg-yellow-300"
              onClick={() => setOpenUserModal(true)}
            >
              Create New User
            </button>
          </div>
        </div>
      </div>

      {openProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div
            className={cn(
              "bg-gradient-to-br rounded-xl p-6 w-full max-w-2xl shadow-xl overflow-auto", // Ensure modal is responsive and scrollable
              theme.primary,
              theme.text
            )}
          >
            <h2 className="text-lg font-semibold mb-4">Create User Profile</h2>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto"> {/* Scrollable container with max height */}
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nick Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.nick_name}
                  onChange={(e) =>
                    setProfile({ ...profile, nick_name: e.target.value })
                  }
                  placeholder="Enter nick name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telephone</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.telephone}
                  onChange={(e) =>
                    setProfile({ ...profile, telephone: e.target.value })
                  }
                  placeholder="Enter telephone"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Village</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.village}
                  onChange={(e) =>
                    setProfile({ ...profile, village: e.target.value })
                  }
                  placeholder="Enter village"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Facebook</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.facebook}
                  onChange={(e) =>
                    setProfile({ ...profile, facebook: e.target.value })
                  }
                  placeholder="Enter Facebook URL"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Twitter</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.twitter}
                  onChange={(e) =>
                    setProfile({ ...profile, twitter: e.target.value })
                  }
                  placeholder="Enter Twitter URL"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Link</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.link}
                  onChange={(e) =>
                    setProfile({ ...profile, link: e.target.value })
                  }
                  placeholder="Enter any relevant link"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Position</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({ ...profile, position: e.target.value })
                  }
                  placeholder="Enter position"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Employment</label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.date_of_employment}
                  onChange={(e) =>
                    setProfile({ ...profile, date_of_employment: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Branch</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.branch}
                  onChange={(e) =>
                    setProfile({ ...profile, branch: e.target.value })
                  }
                  placeholder="Enter branch"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Company</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                  placeholder="Enter company"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Project</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.project}
                  onChange={(e) =>
                    setProfile({ ...profile, project: e.target.value })
                  }
                  placeholder="Enter project"
                />
              </div>

              {/* Profile Type */}
              <div>
                <label className="text-sm font-medium">Profile Type</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={profile.profile_type}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      profile_type: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="1">Type 1</option>
                  <option value="2">Type 2</option>
                  <option value="3">Type 3</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenProfileModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProfile}
                className={`px-4 py-2 rounded-md bg-gradient-to-br ${theme.text} ${theme.primary} border `}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}



      {openUserModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={cn("bg-gradient-to-br rounded-xl p-6 w-full max-w-md shadow-xl", theme.primary, theme.text)}>
            <h2 className="text-lg font-semibold mb-4">Create User</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={user.confirm_password}
                  onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                  placeholder="Confirm password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
                  value={user.profile}
                  onChange={(e) => setUser({ ...user, profile: e.target.value })}
                  placeholder="Choose user profile"
                />
              </div>'
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenUserModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className={`px-4 py-2 rounded-md bg-gradient-to-br ${theme.text} ${theme.primary} border `}
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserPage;
