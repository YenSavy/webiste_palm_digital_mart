import React from 'react'
import { useTranslation } from 'react-i18next'
import TextTitle from '../../TextTitle'
import { Sparkles, Settings, Users, Shield, Rocket } from 'lucide-react'
import { useWhyUs } from '../../../lib/queries'
import useLangSwitch from '../../../hooks/useLangSwitch'

export type TWhyUS = {
  id:string;
  icon: string;
  title_en: string;
  title_kh:string
  title_ch: string;
  description_en: string
  description_kh: string
  description_ch: string
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Settings: Settings,
  Users: Users,
  Shield: Shield,
  Rocket: Rocket
}

const WhyUs: React.FC = () => {
  const { t } = useTranslation("common")
  const {data: whyUs} = useWhyUs()
  return (
    <section className='flex flex-col items-center mt-12 px-4 py-8'>
      <div className='mb-12'>
        <TextTitle title={t("common:why_us")} icon={<Sparkles size={34} />} />
      </div>

      <article className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl w-full'>
        {whyUs?.data.map((item) => {
          const IconComponent = iconMap[item.icon] || Settings
          return (
            <div
              key={item.id}
              className='group relative bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 hover:border-[#DAA520]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.3)] hover:-translate-y-2'
            >
              <div className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#DAA520]/10 to-transparent rounded-tr-2xl'></div>

              <span className='flex items-center gap-3'><div className='relative z-10 mb-4 inline-flex p-3 bg-gradient-to-br from-[#DAA520]/20 to-[#8f7c15]/20 rounded-xl group-hover:scale-110 transition-transform duration-300'>
                <div style={{ color: '#DAA520' }} className='drop-shadow-[0_0_8px_rgba(218,165,32,0.6)]'>
                  <IconComponent size={32} />
                </div>
              </div>

                <h3 className='text-lg font-semibold mb-3 text-white group-hover:text-[#DAA520] transition-colors duration-300'>
                  {useLangSwitch(item.title_en, item.title_kh, item.title_ch)}
                </h3></span>

              <p className='text-gray-300 text-sm leading-relaxed'>
                {useLangSwitch(item.description_en, item.description_kh, item.description_ch)}
              </p>

              <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl'></div>
            </div>
          )
        })}
      </article>

      <div className='absolute top-20 left-10 w-2 h-2 rounded-full bg-[#DAA520]/40 animate-pulse'></div>
      <div className='absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-[#DAA520]/30 animate-pulse' style={{ animationDelay: '1s' }}></div>
      <div className='absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-[#DAA520]/40 animate-pulse' style={{ animationDelay: '2s' }}></div>
    </section>
  )
}

export default WhyUs