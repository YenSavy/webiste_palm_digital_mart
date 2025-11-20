import React from 'react'

const Banner: React.FC = () => {
    return (
        <article className="relative mt-6  ">
            <hr className="w-full border border-secondary animate-pulse" />
            <p className="text-center text-[--var(--primary-color)] my-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam dicta consequatur nam inventore saepe aspernatur nostrum.
            </p>
            <hr className="w-full border border-secondary animate-pulse" />

        </article>
    )
}

export default Banner