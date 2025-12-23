import {useState, useEffect} from "react";
import {
    getMyInfoApi,
    updatePasswordApi,
    updatePhoneApi,
} from "../api/userApi.js";

export default function useMyInfo() {
    const [myInfo, setMyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);

            const {data} = await getMyInfoApi();
            setMyInfo(data);

        } catch (e) {
            setError(e);      // 에러를 밖으로 전달
            setMyInfo(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const updatePhone = async (phone) => {
        await updatePhoneApi(phone);
        await load();
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
        error,     // ProfileForm에서 403 판단용
        reload: load,
        updatePhone,
        updatePassword,
    };
}