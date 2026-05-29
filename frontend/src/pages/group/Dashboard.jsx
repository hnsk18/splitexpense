import React, { useState } from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import { Spline } from 'lucide-react'
import SplitExpense from './SplitExpense'

function Dashboard() {
    const [splitPanelActive, setSplitPanelActive] = useState(false);
    return (
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:min-h-screen">
            <LeftPanel setSplitPanelActive={setSplitPanelActive} />
            {!splitPanelActive && <RightPanel />}
            {splitPanelActive && <SplitExpense setSplitPanelActive={setSplitPanelActive} />}
        </div>
    )
}

export default Dashboard