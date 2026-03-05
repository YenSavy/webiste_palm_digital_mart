import React, { useState } from "react";
import { User, Receipt, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";
import ProfileInfor from "../../components/settings/Billing";
import Billing from "../../components/settings/Profileinfor";
import Security from "../../components/settings/Security";

type TabKey = "profile" | "billing" | "security";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const SettingPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const tabs: Tab[] = [
    {
      key: "profile",
      label: "Profile Info",
      icon: <User size={15} />,
      component: <ProfileInfor />,
    },
    {
      key: "billing",
      label: "Billing",
      icon: <Receipt size={15} />,
      component: <Billing />,
    },
    {
      key: "security",
      label: "Security",
      icon: <ShieldCheck size={15} />,
      component: <Security />,
    },
  ];

  const activeTabData = tabs.find((t) => t.key === activeTab);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`
        )}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className={cn("text-2xl font-bold", theme.text)}>Settings</h1>
            <p className={cn("mt-1 text-sm", theme.textSecondary)}>
              Manage your profile, billing, and security preferences.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-5 flex items-center gap-1 border-b" style={{ borderColor: `${theme.accent}22` }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px"
                )}
                style={{
                  borderBottomColor: isActive ? theme.accent : "transparent",
                  color: isActive ? theme.accent : undefined,
                }}
              >
                <span
                  style={{ color: isActive ? theme.accent : undefined }}
                  className={cn(!isActive && theme.textSecondary)}
                >
                  {tab.icon}
                </span>
                <span className={cn(!isActive && theme.textSecondary)}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab Content */}
      <section>{activeTabData?.component}</section>
    </div>
  );
};

export default SettingPage;