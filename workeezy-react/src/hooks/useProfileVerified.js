import {useState} from "react";

export default function useProfileVerified() {
    const [verified, setVerified] = useState(
        localStorage.getItem("profileVerified") === "true"
    );

    const verify = () => {
        localStorage.setItem("profileVerified", "true");
        setVerified(true);
    };

    const reset = () => {
        localStorage.removeItem("profileVerified");
        setVerified(false);
    };

    return {
        verified,
        verify,
        reset,
    };
}