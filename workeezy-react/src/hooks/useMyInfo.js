import {useState, useEffect} from "react";
import {getMyInfoApi, updatePasswordApi, updatePhoneApi} from "../api/userApi.js";

export default function useMyInfo() {
    const [myInfo, setMyInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        const {data} = await getMyInfoApi();
        setMyInfo(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const updatePhone = async (phone) => {
        await updatePhoneApi(phone);
        await load(); // 수정 후 최신 정보 다시 반영
    };

    const updatePassword = async (
        currentPassword,
        newPassword,
        newPasswordCheck
    ) => {
        await updatePasswordApi(
            currentPassword,
            newPassword,
            newPasswordCheck
        );
    };

    return {
        myInfo,
        loading,
        reload: load,
        updatePhone,
        updatePassword,
    };
}