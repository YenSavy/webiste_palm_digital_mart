import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import { useThemeStore } from "../../store/themeStore";

interface StepHeaderProps {
  step: 1 | 2;
}

const StepHeader: React.FC<StepHeaderProps> = ({ step }) => {
  const theme = useThemeStore((state) => state.getTheme());

  return (
    <section
      className={cn(
        `bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-2xl p-6`
      )}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className={cn("text-2xl font-bold", theme.text)}>Subscription</h1>
          <p className={cn("mt-1 text-sm", theme.textSecondary)}>
            Choose your plan, then complete payment option.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor: `${theme.accent}55`, backgroundColor: `${theme.accent}12` }}
        >
          <Sparkles size={16} style={{ color: theme.accent }} />
          <span className={cn("text-sm font-medium", theme.text)}>2-Step Checkout</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{
            backgroundColor: step === 1 ? theme.accent : `${theme.accent}1f`,
            color: step === 1 ? "#fff" : theme.accent,
          }}
        >
          1
        </div>
        <span className={cn("text-sm font-medium", step === 1 ? theme.text : theme.textSecondary)}>
          Choose Plan
        </span>
        <div className={`h-[1px] w-10 ${theme.border}`} />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          style={{
            backgroundColor: step === 2 ? theme.accent : `${theme.accent}1f`,
            color: step === 2 ? "#fff" : theme.accent,
          }}
        >
          2
        </div>
        <span className={cn("text-sm font-medium", step === 2 ? theme.text : theme.textSecondary)}>
          Payment Option
        </span>
      </div>
    </section>
  );
};

export default StepHeader;