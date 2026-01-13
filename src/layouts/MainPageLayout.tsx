import React from 'react'
import { useTranslation } from "react-i18next";

import MainBackground from '../components/shared/MainBackground'
import MainHeader, { type THeaderProps } from '../components/shared/MainHeader'
import { Outlet } from 'react-router';
import Footer from '../components/shared/home/Footer';



const MainPageLayout: React.FC = () => {
    const { t } = useTranslation("common");
     const Company: THeaderProps = {
        company: {
            logo: "./palm technology.png",
            name: t("company"),
        },
    };
    return (
        <MainBackground>
            <MainHeader company={Company.company} />
            <main className=" px-5 md:px-16 lg:px-32 translate-y-[6rem]">
                <Outlet />
            </main>
            <Footer />
        </MainBackground>
    )
}

export default MainPageLayout