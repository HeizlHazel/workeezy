export function normalizeRole(role) {
    return (role ?? "")
        .toString()
        .toUpperCase()
        .replace(/\[|\]/g, "") // [ROLE_ADMIN] 방어
        .replace("ROLE_", "")
        .trim();
}