import React from 'react'
import StepsToUseSystem from '../components/shared/dashboard/StepsToUseSystem'
import ChartsSection from '../components/shared/dashboard/ChartsSection'
import ActivitiesTable from '../components/shared/dashboard/ActivitiesTable'



const DashboardPage: React.FC = () => {
  return (
    <div>
      <StepsToUseSystem />
      <ChartsSection />
      <ActivitiesTable />
    </div>
  )
}

export default DashboardPage