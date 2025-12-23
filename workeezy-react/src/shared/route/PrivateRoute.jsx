import useAuthGuard from "../../hooks/useAuthGuard.js";

export default function PrivateRoute({children}) {
    useAuthGuard({requireLogin: true});
    return children;
}