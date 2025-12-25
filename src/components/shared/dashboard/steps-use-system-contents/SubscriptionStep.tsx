import { type FC, useState } from "react";
import { usePlan } from "../../../../lib/queries";
import { useThemeStore } from "../../../../store/themeStore";
import { getLangSwitch } from "../../../../hooks/useLangSwitch";

const SubscriptionStep: FC = () => {
    const { data: plans, isLoading } = usePlan();
    const theme = useThemeStore(state => state.getTheme());  // Get current theme from the store
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    console.log(selectedPlan);

    if (isLoading) return <div className="text-center py-6">Loading...</div>;

    const handlePlanSelection = (planId: string) => {
        setSelectedPlan(planId);
    };

    return (
        <div className={`${theme.text} p-6 max-w-3xl mx-auto`}>
            <h2 className={`text-3xl font-bold ${theme.text}`} style={{ color: theme.primary }}>
                Select a Plan
            </h2>
            <div className="plans-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {plans?.data.map((f) => {
                    const isSelected = selectedPlan === f.id;
                    return (
                        <div
                            key={f.id}
                            className={`transition-all duration-300 ease-in-out transform ${theme.textSecondary} ${isSelected ? 'shadow-lg scale-105' : 'shadow-md'} p-5 rounded-xl border ${theme.border} cursor-pointer`}
                            onClick={() => handlePlanSelection(f.id)}
                            style={{
                                backgroundColor: isSelected ? theme.cardBg : '#fff',
                                padding: '20px',
                                marginBottom: '15px',
                                transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <h3 className={`text-xl font-semibold ${theme.text}`}>{f.name}</h3>
                            <p className={`mt-2 text-lg font-medium ${theme.textSecondary} my-3`}>${f.price} /{getLangSwitch(f?.billing_cycle_en, f.billing_cycle_kh, f.billing_cycle_ch)}</p>

                            <p className={'text-gray-500 text-sm'}>{getLangSwitch(f?.best_for_en, f.best_for_kh, f.best_for_ch)}</p>
                            
                            <div className={`mt-4 text-center py-2 rounded-lg ${isSelected ? theme.primaryHover : 'border border-gray-300'} transition-all duration-200 ease-in-out`}>
                                {isSelected ? "Selected" : "Select Plan"}
                            </div>  
                        </div>
                    );
                })}
            </div>
            {selectedPlan && (
                <div className={`${theme.textSecondary} mt-8`}>
                    <h3 className={`text-2xl ${theme.text}`}>You have selected:</h3>
                    <div className={`mt-2 text-xl font-semibold ${theme.text}`}>
                        {plans?.data.find(f => f.id === selectedPlan)?.name}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionStep;
