import React, { useRef, useState, useEffect } from 'react'
import { useClientSay } from '../../../lib/queries'
import TextTitle from '../../TextTitle'
import { Quote, ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export type TClientSay = {
  id: string;
  name: string;
  city: string;
  photo: string;
  message: string;
  position: string;
  work_place: string; 
}

const ClientSay: React.FC = () => {
  const { data: clientSay } = useClientSay()
  const { t } = useTranslation("common")

  const testimonials = clientSay?.data || []

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollButtons()
  }, [testimonials.length])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => updateScrollButtons()
    el.addEventListener('scroll', handleScroll)

    const handleResize = () => updateScrollButtons()
    window.addEventListener('resize', handleResize)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    const amount = el.clientWidth * 0.8 // scroll almost one viewport
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    })
  }

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className='py-12 px-4 relative'>
      {/* Section Title */}
      <div className='flex justify-center mb-12'>
        <TextTitle
          title={t("common:client_say") || "What Our Clients Say"}
          icon={<Quote size={34} />}
        />
      </div>

      <div className='max-w-7xl mx-auto relative'>
        {/* Carousel container */}
        <div
          ref={scrollRef}
          className='testimonial-scroll grid auto-cols-[minmax(280px,1fr)] sm:auto-cols-[minmax(320px,1fr)] lg:auto-cols-[minmax(380px,1fr)] grid-flow-col gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 px-2'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(218, 165, 32, 0.3) rgba(255, 255, 255, 0.05)',
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className='snap-start bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:border-[#DAA520]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(218,165,32,0.2)] relative overflow-hidden group'
            >
              <div className='absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity'>
                <Quote size={100} className='text-[#DAA520]' />
              </div>

              <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#DAA520]/10 to-transparent rounded-tr-2xl'></div>

              <div className='relative z-10'>
                <div className='flex gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className='text-[#DAA520] fill-[#DAA520]'
                    />
                  ))}
                </div>

                {/* Message */}
                <div className='mb-6 min-h-[120px]'>
                  <Quote size={20} className='text-[#DAA520] mb-3' />
                  <p className='text-gray-200 text-sm leading-relaxed line-clamp-5 italic'>
                    "{testimonial.message}"
                  </p>
                </div>

                {/* Client Info */}
                <div className='flex items-center gap-4 pt-4 border-t border-slate-700/50'>
                  {/* Photo */}
                  <div className='relative flex-shrink-0'>
                    <div className='w-14 h-14 rounded-full overflow-hidden border-3 border-[#DAA520]/50 shadow-lg'>
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    {/* Gold ring decoration */}
                    <div className='absolute -inset-0.5 rounded-full border border-[#DAA520]/30 group-hover:animate-pulse'></div>
                  </div>

                  {/* Name and Details */}
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-bold text-white mb-0.5 truncate'>
                      {testimonial.name}
                    </h3>
                    <p className='text-[#DAA520] text-sm font-medium truncate'>
                      {testimonial.position}
                    </p>
                    <p className='text-gray-400 text-xs truncate'>
                      {testimonial.work_place}
                    </p>
                    <div className='flex items-center gap-1 text-gray-500 text-xs mt-1'>
                      <MapPin size={12} />
                      <span className='truncate'>{testimonial.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls (show only if more than 1 item) */}
        {testimonials.length > 1 && (
          <>
            <button
              type='button'
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label='Previous testimonials'
              className={`hidden md:flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#DAA520]/40 bg-slate-900/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${
                canScrollLeft
                  ? 'opacity-100 hover:bg-[#DAA520] hover:text-slate-900'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type='button'
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label='Next testimonials'
              className={`hidden md:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#DAA520]/40 bg-slate-900/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${
                canScrollRight
                  ? 'opacity-100 hover:bg-[#DAA520] hover:text-slate-900'
                  : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .testimonial-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .testimonial-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .testimonial-scroll::-webkit-scrollbar-thumb {
          background: rgba(218, 165, 32, 0.3);
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .testimonial-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(218, 165, 32, 0.5);
        }
      `}</style>

      <div className='absolute top-20 left-10 w-2 h-2 rounded-full bg-[#DAA520]/40 animate-pulse'></div>
      <div
        className='absolute bottom-20 right-20 w-1.5 h-1.5 rounded-full bg-[#DAA520]/30 animate-pulse'
        style={{ animationDelay: '1s' }}
      ></div>
    </section>
  )
}

export default ClientSay
