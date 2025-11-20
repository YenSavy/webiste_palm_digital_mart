import React from "react";
import { useTranslation } from "react-i18next";
import { Check, HandCoins } from "lucide-react";
import TextTitle from "../../TextTitle";
import useLangSwitch from "../../../hooks/useLangSwitch";
import useArrayTranslated from "../../../hooks/useArrayTranslated";

export type TPricingProps = {
  id: string;
  name: string;
  price: string;
  billing_cycle_en: string;
  billing_cycle_kh: string;
  billing_cycle_ch: string;
  billing_type_en: string;
  billing_type_kh: string;
  billing_type_ch: string;
  vat_note_en: string;
  vat_note_kh: string;
  vat_note_ch: string;
  best_for_en: string;
  best_for_kh: string;
  best_for_ch: string;
  features_en: string[];
  features_kh: string[];
  features_ch: string[];
};

const Pricing: React.FC<{ plans: TPricingProps[] }> = ({ plans }) => {
  const { t } = useTranslation("header");

  return (
    <section
      id="pricing"
      className="mt-8 flex flex-col items-center px-4 sm:px-6 lg:px-12"
    >
      <TextTitle title={t("header:pricing")} icon={<HandCoins size={34} />} />

      <article
        className="
        mt-10 grid grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        gap-6 w-full max-w-7xl
        justify-items-center
      "
      >
        {plans?.map((plan, i) => (
          <Card key={plan.id} {...plan} mostFamous={i === 1} />
        ))}
      </article>
    </section>
  );
};
export default Pricing;

const Card: React.FC<TPricingProps & { onClick?: () => void; mostFamous: boolean }> = ({
  id,
  name,
  price,
  best_for_ch,
  best_for_en, best_for_kh,
  billing_cycle_ch,
  billing_cycle_en,
  billing_cycle_kh,
  features_ch,
  features_en,
  features_kh,
  mostFamous,
  onClick,
}) => {
  const { t } = useTranslation("common");
  const active = id === "1"
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px]
        border p-6 bg-gradient-to-br from-slate-700/40 to-slate-800/40 hover:scale-105 rounded-xl cursor-pointer shadow-2xl shadow-white/10
        transition-all duration-200 flex flex-col justify-between
        ${active ? "border-transparent bg-primary/10" : "hover:bg-primary/10 border-transparent"}
        ${mostFamous ? "ring-4 ring-secondary shadow-secondary min-h-[480px]" : "min-h-[440px]"}
      `}
    >
      {mostFamous && (
        <span className="absolute top-0 -translate-y-1/2 bg-secondary  text-sm text-white  px-4 py-1.5 rounded-full left-1/2 -translate-x-1/2 z-40">
          {t("common:most_popular")}
        </span>
      )}

      <div>
        <h2 className="font-semibold text-lg text-gray-200">{name}</h2>
        {best_for_ch && <h4 className="text-sm text-gray-400">{useLangSwitch(best_for_en, best_for_kh, best_for_ch)}</h4>}
        <p className="text-xl font-semibold mt-4 bg-gradient-to-r from-secondary via-slate-50 to-[#8f7c15] bg-clip-text text-transparent">
          ${price}/{useLangSwitch(billing_cycle_en, billing_cycle_kh, billing_cycle_ch)}
        </p>
        <hr className="my-4 border-gray-500/40" />

        <ul className="flex flex-col gap-2">
          {useArrayTranslated(features_en, features_kh, features_ch).map((feature, index) => {
            return <li key={index} className="text-sm flex items-center gap-2 text-gray-100">
              <span className="p-[2px] bg-secondary rounded-full flex items-center justify-center">
                <Check className="text-white" size={16} />
              </span>
              {feature}
            </li>
          })}
        </ul>
      </div>

      <button
        className={`
          mt-6 py-2.5 text-sm font-semibold rounded-full w-full
          transition-colors duration-150 
          ${mostFamous
            ? "bg-secondary text-white"
            : "border border-white text-white hover:bg-white/10"
          }
        `}
      >
        {t("common:select_plan")}
      </button>
    </div>
  );
};
