import React from 'react'
import Hero from '../components/shared/home/Hero'
import Banner from '../components/shared/home/Banner'
import Pricing, { type TPricingProps } from '../components/shared/home/Pricing'
import Advertising, { type TVideoType } from '../components/shared/home/Advertising'
import WhyUs from '../components/shared/home/WhyUs'
import SlideShow from '../components/shared/home/SlideShow'
import { useAdverts, usePlan, usePodcast } from '../lib/queries'
import ClientSay from '../components/shared/home/ClientSay'
import Podcasting from '../components/shared/home/Podcating'
// import SocialLogin from '../components/SocialLogin'



const HomePage: React.FC = () => {
  const {data: plans} = usePlan()
  const {data} = useAdverts()
  const {data: podcastings} = usePodcast()
  return (
    <>
      {/* <SocialLogin /> */}
      <Hero />
      <Banner />
      <SlideShow />
      <WhyUs  />
      <Pricing
        plans={plans?.data as TPricingProps[]}
      />
      <ClientSay />
      <Podcasting videos={podcastings?.data.data} defaultLatestVideo={podcastings?.data.data[0] as TVideoType}/>
      <Advertising videos={data?.data.data} defaultLatestVideo={data?.data.data[0] as TVideoType}/>
    </>
  )
}

export default HomePage