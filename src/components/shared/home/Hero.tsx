import React from 'react'
import { useHeroContent, useHeroFeature } from '../../../lib/queries';
import useLangSwitch from '../../../hooks/useLangSwitch';
import { CirclePlay } from 'lucide-react';

export type THeroContent = {
    id: string;
    main_title: string
    main_title_kh: string;
    main_title_ch: string;
    sub_title: string
    sub_title_kh: string;
    sub_title_ch: string;
    image: string;
}
export type THeroFeature = {
    id: string;
    feature_text: string
    feature_text_kh: string
    feature_text_ch: string
}

const HeroSkeleton: React.FC = () => {
    return (
        <section className='grid md:grid-cols-2 min-h-[60vh] mt-10 items-center gap-7 md:gap-0 justify-center animate-pulse'>
            <article className='flex items-start justify-start h-full p-4 flex-col gap-6'>
                <span className='w-full'>
                    <div className='h-8 bg-gray-300 rounded w-3/4 mb-2'></div>
                    <div className='h-6 bg-gray-200 rounded w-1/2'></div>
                </span>
                <ul className='ml-10 w-full space-y-3'>
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                        <li key={item} className='flex items-center gap-2'>
                            <div className='w-5 h-5 bg-gray-300 rounded-full'></div>
                            <div className='h-4 bg-gray-200 rounded w-48'></div>
                        </li>
                    ))}
                </ul>
            </article>
            <div className='h-full min-h-[400px] bg-gray-300 rounded'></div>
        </section>
    )
}

const Hero: React.FC = () => {
    const { data: contents, isLoading } = useHeroContent()
    const content = contents?.data[0]
    const mainTitle = useLangSwitch(content?.main_title || "", content?.main_title_kh || "", content?.main_title_ch || "")
    const subTitle = useLangSwitch(content?.sub_title || "", content?.sub_title_kh || "", content?.sub_title_ch || "")

    const { data: features, isLoading: isLoadingFeature } = useHeroFeature()

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [isLoading]);

    if (isLoading || isLoadingFeature) return <HeroSkeleton />

    return (
        <section className='grid md:grid-cols-2 min-h-[560px] mt-10 items-center gap-7 md:gap-0 justify-center' >
            <article className='flex items-start justify-start h-full p-4 flex-col gap-6' data-aos="fade-right">
                <span>
                    <h1 className='font-semibold text-2xl md:text-3xl lg:text-4xl'>
                        {mainTitle}
                    </h1>
                    <h3 className='mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300'>
                        {subTitle}
                    </h3>
                </span>
                <ul className='ml-6 md:ml-10 space-y-4'>
                    {features?.data.map((f) => (
                        <li key={f.id} className='flex items-start gap-3 text-sm md:text-base'>
                            <CirclePlay
                                className='text-secondary flex-shrink-0 w-5 h-5 md:w-6 md:h-6'
                            />
                            <span>
                                {useLangSwitch(
                                    f.feature_text,
                                    f.feature_text_kh,
                                    f.feature_text_ch
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </article>

            <div className='h-full flex items-center justify-center px-4 md:px-0' data-aos="fade-left">
                <img
                    src={content?.image}
                    loading='lazy'
                    className='w-full max-w-md md:max-w-lg h-auto object-contain'
                    alt='Hero'
                />
            </div>
        </section>
    )
}

export default Hero
