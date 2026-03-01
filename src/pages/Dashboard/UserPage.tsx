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
      <div className={cn("min-h-screen w-full", theme.gradient)}>
        <div className="max-w-7xl mx-auto space-y-6">
          <section
            className={cn(
              `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`,
            )}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className={cn("text-2xl font-bold", theme.text)}>User Management</h1>
                <p className={cn("mt-1 text-sm", theme.textSecondary)}>
                  Invite and manage additional user accounts for your organization.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: theme.accent }}
                  onClick={() => setOpenProfileModal(true)}
                >
                  Create User Profile
                </button>
                <button
                  className={cn("px-4 py-2 rounded-lg text-sm font-semibold border", theme.text)}
                  style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
                  onClick={() => setOpenUserModal(true)}
                >
                  Create User
                </button>
              </div>
            </div>
          </section>

          <section
            className={cn(
              `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`,
            )}
          >
            {isFetchingUsers ? (
              <span className={cn("text-sm", theme.textSecondary)}>Loading users...</span>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className={cn("border-b", theme.border, theme.text)}>
                      <th className="py-3">ID</th>
                      <th className="py-3">Name</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Status</th>
                      <th className="py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUser?.map((user, index) => (
                      <tr key={index} className={cn("border-b", theme.border)}>
                        <td className={cn("py-3", theme.text)}>{user.id}</td>
                        <td className={cn("py-3 font-medium", theme.text)}>{user.name}</td>
                        <td className={cn("py-3", theme.textSecondary)}>
                          <span className="underline decoration-dotted cursor-pointer">{user.email}</span>
                        </td>
                        <td className={cn("py-3", theme.textSecondary)}>{user.role}</td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "px-2 py-1 text-xs rounded-full font-semibold inline-flex items-center",
                              user.status === "1"
                                ? "text-green-600"
                                : "text-red-500",
                            )}
                            style={{
                              backgroundColor:
                                user.status === "1"
                                  ? "rgba(34,197,94,0.12)"
                                  : "rgba(239,68,68,0.12)",
                            }}
                          >
                            {user.status === "1" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold border",
                              theme.text,
                            )}
                            style={{
                              borderColor: `${theme.accent}55`,
                              backgroundColor: `${theme.accent}10`,
                            }}
                            onClick={() => alert("View/Edit user")}
                          >
                            View/Edit
                          </button>
                          <button
                            className="ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                            style={{ backgroundColor: "#EF4444" }}
                            onClick={() => handleDeleteUser(user.id.toString())}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {openProfileModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div
            className={cn(
              `bg-gradient-to-br ${theme.cardBg} border ${theme.border} rounded-2xl p-6 w-full max-w-2xl shadow-xl overflow-auto`,
            )}
          >
            <h2 className={cn("text-lg font-semibold mb-4", theme.text)}>Create User Profile</h2>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>First Name</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.first_name}
                  onChange={(e) =>
                    setProfile({ ...profile, first_name: e.target.value })
                  }
                  placeholder="Enter first name"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Last Name</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.last_name}
                  onChange={(e) =>
                    setProfile({ ...profile, last_name: e.target.value })
                  }
                  placeholder="Enter last name"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Nick Name</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.nick_name}
                  onChange={(e) =>
                    setProfile({ ...profile, nick_name: e.target.value })
                  }
                  placeholder="Enter nick name"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Email</label>
                <input
                  type="email"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="Enter email"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Telephone</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.telephone}
                  onChange={(e) =>
                    setProfile({ ...profile, telephone: e.target.value })
                  }
                  placeholder="Enter telephone"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Village</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.village}
                  onChange={(e) =>
                    setProfile({ ...profile, village: e.target.value })
                  }
                  placeholder="Enter village"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Facebook</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.facebook}
                  onChange={(e) =>
                    setProfile({ ...profile, facebook: e.target.value })
                  }
                  placeholder="Enter Facebook URL"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Twitter</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.twitter}
                  onChange={(e) =>
                    setProfile({ ...profile, twitter: e.target.value })
                  }
                  placeholder="Enter Twitter URL"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Link</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.link}
                  onChange={(e) =>
                    setProfile({ ...profile, link: e.target.value })
                  }
                  placeholder="Enter any relevant link"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Position</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({ ...profile, position: e.target.value })
                  }
                  placeholder="Enter position"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Date of Employment</label>
                <input
                  type="date"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.date_of_employment}
                  onChange={(e) =>
                    setProfile({ ...profile, date_of_employment: e.target.value })
                  }
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Branch</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.branch}
                  onChange={(e) =>
                    setProfile({ ...profile, branch: e.target.value })
                  }
                  placeholder="Enter branch"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Company</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                  placeholder="Enter company"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Project</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.project}
                  onChange={(e) =>
                    setProfile({ ...profile, project: e.target.value })
                  }
                  placeholder="Enter project"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>

              {/* Profile Type */}
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Profile Type</label>
                <select
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={profile.profile_type}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      profile_type: parseInt(e.target.value),
                    })
                  }
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
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
                className={cn("px-4 py-2 rounded-lg text-sm font-semibold border", theme.text)}
                style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProfile}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: theme.accent }}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      )}



      {openUserModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className={cn(`bg-gradient-to-br ${theme.cardBg} border ${theme.border} rounded-2xl p-6 w-full max-w-md shadow-xl`)}>
            <h2 className={cn("text-lg font-semibold mb-4", theme.text)}>Create User</h2>
            <div className="space-y-4">
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Name</label>
                <input
                  type="text"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder="Enter full name"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Email</label>
                <input
                  type="email"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Enter email"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Password</label>
                <input
                  type="password"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Enter password"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>Confirm Password</label>
                <input
                  type="password"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={user.confirm_password}
                  onChange={(e) => setUser({ ...user, confirm_password: e.target.value })}
                  placeholder="Confirm password"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div>
                <label className={cn("text-sm font-medium", theme.textSecondary)}>User Profile</label>
                <input
                  type="password"
                  className={cn("w-full mt-1 px-3 py-2 rounded-lg border", theme.text)}
                  value={user.profile}
                  onChange={(e) => setUser({ ...user, profile: e.target.value })}
                  placeholder="Choose user profile"
                  style={{ borderColor: `${theme.accent}33`, backgroundColor: `${theme.accent}08` }}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setOpenUserModal(false)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-semibold border", theme.text)}
                  style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}10` }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: theme.accent }}
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
