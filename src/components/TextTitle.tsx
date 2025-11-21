import { Palmtree } from 'lucide-react'
import React from 'react'

type TextTitleProps = {
    title: string
    icon: React.ReactNode
    className?: string 
}

const TextTitle: React.FC<TextTitleProps> = ({ title, icon, className="" }) => {
  return (
    <div className={`relative flex items-center justify-center text-xl gap-3 ${className} w-full`}>
      <div className="flex-shrink-0 drop-shadow-[0_0_12px_rgba(218,165,32,0.8)] text-secondary ">
        {icon}
      </div>
      
      <h2 className=" tracking-wide drop-shadow-[0_0_8px_rgba(218,165,32,0.5)] text-gradient moul-regular text-2xl" >
        {title}
      </h2>
      
      {/* <div className="flex-shrink-0 drop-shadow-[0_0_12px_rgba(218,165,32,0.8)]">
        <Palmtree size={34} strokeWidth={2.5}/>
      </div> */}
      
      <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DAA520] to-transparent opacity-80"></div>
    </div>
  )
}

export default TextTitle