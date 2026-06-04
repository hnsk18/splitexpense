import React, { useState, useEffect } from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import { Spline } from 'lucide-react'
import SplitExpense from './SplitExpense'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiFetch } from '../../services/api'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
function Dashboard() {
    const [splitPanelActive, setSplitPanelActive] = useState(false);
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("gc");
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState(null);
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await apiFetch(`/group/${groupId}`, "GET", null, true);
                if (response.status) {
                    const grp = response.group;
                    console.log(grp);
                    setGroupData(grp);
                    const found = grp?.members?.find(member => member.upi === user?.upi) || null;
                    setUserData(found);
                    const mems = grp?.members?.map(m => ({ upi: m.upi, name: m.name })) || [];
                    setMembers(mems);
                    console.log(mems);
                    setLoading(false);
                } else {
                    toast.error(response.message);
                    navigate("/me");
                }
            } catch (error) {
                console.error("Error fetching group data:", error);
                toast.error("Error fetching group data");
                navigate("/me");
            }
        };

        if (groupId?.length === 6) {
            fetchGroupData();
        } else {
            toast.error("Invalid group code");
            navigate("/me");
        }
    }, [groupId, user, navigate]);
    return loading ? (
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:min-h-screen">Loading...</div>
    ) : (
        <div className="flex flex-col gap-2 xl:flex-row xl:items-stretch xl:min-h-screen">
            <LeftPanel
                setSplitPanelActive={setSplitPanelActive}
                grpname={groupData?.name}
                grpcode={groupData?.code}
                members={groupData?.members?.length || 1}
            />
            {!splitPanelActive && <RightPanel
                grpname={groupData?.name}
                userData={userData}
            />}
            {splitPanelActive && <SplitExpense
                setSplitPanelActive={setSplitPanelActive}
                membersData={members}
                grpcode={groupData?.code}
            />}
        </div>
    )
}

export default Dashboard