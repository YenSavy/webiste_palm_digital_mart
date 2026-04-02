import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { cn } from '../../lib/utils';
import CreateCompany from '../../components/shared/dashboard/company-profile/CreateCompany';
import { useCompanyStatus } from '../../hooks/useCompanyStatus';

const DashboardPage: React.FC = () => {
  const theme = useThemeStore((state) => state.getTheme());
  const navigate = useNavigate();
  const { hasCompany, isLoading } = useCompanyStatus();

  // Existing users who already have a company should never land here
  useEffect(() => {
    if (!isLoading && hasCompany) {
      navigate('/dashboard/subscription', { replace: true });
    }
  }, [hasCompany, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  // Returning null while the redirect above fires
  if (hasCompany) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section
        className={cn(
          `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`
        )}
      >
        <h1 className={cn('text-2xl font-bold', theme.text)}>Create Company</h1>
        <p className={cn('mt-1 text-sm', theme.textSecondary)}>
          Set up your company profile to get started with the system.
        </p>
      </section>

      <section>
        <CreateCompany />
      </section>
    </div>
  );
};

export default DashboardPage;
