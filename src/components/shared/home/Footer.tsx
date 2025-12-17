import React, { useEffect, useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Youtube,
  Palmtree,
  ArrowUp,
  Send,
  Music2
} from 'lucide-react'
import { useFooter } from '../../../lib/queries'
import useLangSwitch from '../../../hooks/useLangSwitch';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../lib/api';
import type { ApiResponse } from '../../../types';
import appStore from "/app_store.svg"
import playStore from "/play_store.svg"

export type TFooter = {
  id: string;
  work_day_en: string;
  work_day_kh: string;
  work_day_ch: string;
  phone: string;
  email: string;
  address_en: string;
  address_kh: string;
  address_ch: string;
  facebook_url: string;
  telegram_url: string;
  youtube_url: string;
  tiktok_url: string;
}

type TFooterResponse = {
  id: string;
  title_en: string;
  title_kh: string;
  title_ch: string;
  description_en: string;
  description_kh: string;
  description_ch: string;
  app_store_url: string;
  play_store_url: string;
  qr_code_image: string;
}

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const { t } = useTranslation("common")
  const [isLoading, setIsloading] = useState<boolean>(false)
  const [footerData, setFooterData] = useState<TFooterResponse | null>(null)
  const footers = useFooter().data

  useEffect(() => {
    getFooter();
  }, [])

  const getFooter = async () => {
    try {
      setIsloading(true)
      const res = await axiosInstance.get<ApiResponse<TFooterResponse[]>>("/get-app_footer/" + import.meta.env.VITE_COMPANY_ID);
      setFooterData(res.data.data[0])
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  const GetTranslatedText = (en: string, kh: string, ch: string): string => {
    return useLangSwitch(en, kh, ch)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <footer id='contact' className='relative mt-[150px]'>
      <div className='bg-gradient-secondary border-t-2 border-[#DAA520]/30'>
        <div className='max-w-7xl mx-auto px-5 md:px-16 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-lg flex items-center justify-center'>
                  <Palmtree size={28} className='text-slate-900' />
                </div>
                <div>
                  <h3 className='text-[#DAA520] font-bold text-xl'>Palm Biz</h3>
                  <p className='text-xs text-gray-400'>Digital Solutions</p>
                </div>
              </div>
              <p className='text-gray-400 text-sm leading-relaxed'>
                {t("common:footer.quote")}
              </p>
              <div>
                <h4 className='text-white font-semibold mb-3 text-sm'>{t("common:footer.follow_us")}</h4>
                <div className='flex gap-3'>
                  {/* Social Media Icons */}
                  <a href={footers?.data[0].facebook_url} target='_blank' rel='noopener noreferrer'>
                    <Facebook size={18} />
                  </a>
                  <a href={footers?.data[0].telegram_url} target='_blank' rel='noopener noreferrer'>
                    <Send size={18} />
                  </a>
                  <a href={footers?.data[0].tiktok_url} target='_blank' rel='noopener noreferrer'>
                    <Music2 size={18} />
                  </a>
                  <a href={footers?.data[0].youtube_url} target='_blank' rel='noopener noreferrer'>
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <h3 className='text-white font-bold mb-4 text-lg flex items-center gap-2'>
                  <span className='w-1 h-6 bg-[#DAA520] rounded'></span>
                  {t("common:footer.operaton_hour")}
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center gap-3 text-sm'>
                    <Clock size={18} className='text-[#DAA520]' />
                    <div>
                      <p className='text-white font-medium'>{GetTranslatedText(footers?.data[0].work_day_en as string, footers?.data[0].work_day_kh as string, footers?.data[0].work_day_ch as string)}</p>
                      <p className='text-gray-400'>8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3 text-sm pl-9'>
                    <div>
                      <p className='text-white font-medium'>{t("common:footer.day.sat")} & {t("common:footer.day.sun")}</p>
                      <p className='text-red-400'>Closed</p>
                    </div>
                  </div>
                  <div className='mt-4 pt-4 border-t border-slate-700'>
                    <p className='text-xs text-gray-500'>
                      * Public holidays may vary
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className='text-white font-bold mb-4 text-lg flex items-center gap-2'>
                <span className='w-1 h-6 bg-[#DAA520] rounded'></span>
                {t("common:footer.contact_us")}
              </h3>
              <ul className='space-y-4'>
                <li className='flex items-start gap-3 text-gray-400 text-sm'>
                  <MapPin size={18} className='text-[#DAA520] flex-shrink-0'/>
                  <span className='flex flex-wra'>{GetTranslatedText(footers?.data[0].address_en as string, footers?.data[0].address_kh as string, footers?.data[0].address_ch as string)}</span>
                </li>
                <li className='flex items-center gap-3 text-gray-400 text-sm'>
                  <Phone size={18} className='text-[#DAA520] flex-shrink-0' />
                  <a href={`tel:${footers?.data[0].phone}`}>{footers?.data[0].phone}</a>
                </li>
                <li className='flex items-center gap-3 text-gray-400 text-sm'>
                  <Mail size={18} className='text-[#DAA520] flex-shrink-0' />
                  <a href={`mailto:${footers?.data[0].email}`}>{footers?.data[0].email}</a>
                </li>
              </ul>
            </div>

            <div className="lg:flex lg:flex-col justify-between">
              <h3 className='text-white font-bold mb-4 text-lg'>
                {GetTranslatedText(footerData?.title_en as string, footerData?.title_kh as string, footerData?.title_ch as string)}
              </h3>
              <p className='text-gray-400'>{GetTranslatedText(footerData?.description_en as string, footerData?.description_kh as string, footerData?.description_ch as string)}</p>

              <div className='flex gap-1 mt-4 items-center'>
                <a href={footerData?.app_store_url} target="_blank" rel="noopener noreferrer" className='w-[350px]'>
                  <img src={appStore} alt='app-store' className='h-[35px] object-cover' />
                </a>
                <a href={footerData?.play_store_url} target="_blank" rel="noopener noreferrer" className='w-[350px]'>
                  <img src={playStore} alt='play-store' className='h-[35px] object-cover' />
                </a>
              </div>
              <div className='mt-4 flex items-center gap-4'>
                <img src={footerData?.qr_code_image} alt="QR Code" className="w-32 h-32" />


              </div>

            </div>

          </div>
        </div>



        <div className='border-t border-slate-700/50'>
          <div className='max-w-7xl mx-auto px-5 md:px-16 lg:px-32 py-6'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
              <p className='text-gray-400 text-sm text-center md:text-left'>
                &copy; {new Date().getFullYear()} Palm Biz Digital Solutions. All rights reserved.
              </p>
              <div className='flex gap-6 text-sm'>
                <a href='#privacy' className='text-gray-400 hover:text-[#DAA520] transition-colors'>
                  Privacy Policy
                </a>
                <a href='#terms' className='text-gray-400 hover:text-[#DAA520] transition-colors'>
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className='fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-br from-[#DAA520] to-[#8f7c15] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(218,165,32,0.6)] transition-all duration-300 hover:scale-110 z-50 group'
        aria-label='Scroll to top'
      >
        <ArrowUp size={20} className='text-slate-900 group-hover:animate-bounce' />
      </button>
    </footer>
  )
}

export default Footer;
