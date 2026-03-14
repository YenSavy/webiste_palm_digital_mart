import React from "react";
import { CheckCircle2, X, Zap } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import type { TrialStep } from "../../types/subscription";

interface TrialDialogProps {
  open: boolean;
  trialStep: TrialStep;
  progress: number;
  businessName: string;
  onClose: () => void;
  onAccessNow: () => void;
  onNotNow: () => void;
}

const TrialDialog: React.FC<TrialDialogProps> = ({
  open,
  trialStep,
  progress,
  businessName,
  onClose,
  onAccessNow,
  onNotNow,
}) => {
  const theme = useThemeStore((state) => state.getTheme());

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>

        {trialStep === "progress" ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Please wait while creating business
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Preparing your business data ...
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: theme.accent }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {progress}%
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your business is ready
            </h2>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              "{businessName}"
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              You can access to this business now
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onAccessNow}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme.accent }}
              >
                <Zap size={14} />
                Access Now
              </button>
              <button
                onClick={onNotNow}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Not now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialDialog;