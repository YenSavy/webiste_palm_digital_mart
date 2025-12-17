import { type FC, useState } from "react";
import { usePlan } from "../../../../lib/queries";
import { useThemeStore } from "../../../../store/themeStore";

const SubscriptionStep: FC = () => {
    const { data: plans, isLoading } = usePlan();
    const theme = useThemeStore(state => state.getTheme());
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null); 
console.log(selectedPlan)
    if (isLoading) return <div>Loading...</div>;

    const handlePlanSelection = (planId: string) => {
        setSelectedPlan(planId);
    };

    return (
        <div>
            <h2>Select a Plan</h2>
            <div className="plans-container">
                {plans?.data.map((f) => {
                    const isSelected = selectedPlan === f.id;
                    return (
                        <div
                            key={f.id}
                            className={`${theme.textSecondary} ${isSelected ? 'selected' : ''} plan-item`}
                            onClick={() => handlePlanSelection(f.id)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                border: '1px solid #ccc',
                                marginBottom: '10px',
                                borderRadius: '5px',
                                backgroundColor: isSelected ? '#f0f0f0' : '#fff',
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            <h3>{f.name}</h3>
                            <p>{f.billing_cycle_en}</p>
                            <p>{f.price}</p>
                        </div>
                    );
                })}
            </div>
            {selectedPlan && (
                <div>
                    <h3>You have selected:</h3>
                    <div>
                        {plans?.data.find(f => f.id === selectedPlan)?.name}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionStep;
