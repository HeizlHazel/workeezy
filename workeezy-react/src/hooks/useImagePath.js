export default function useImagePath() {
    const S3_BASE = import.meta.env.VITE_S3_BASE_URL ?? "";

    const fixPath = (path) => {
        if (!path) return null;

        // 이미 절대 URL이면 그대로 사용
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        // public/... 형태 → S3에서 가져오기
        if (path.startsWith("public/")) {
            return S3_BASE + path;
        }

        // 혹시 앞에 /가 붙어있는 경우
        if (path.startsWith("/public/")) {
            return S3_BASE + path.slice(1);
        }

        // 그 외는 그대로 (예외 안전)
        return path;
    };

    return { fixPath };
}
