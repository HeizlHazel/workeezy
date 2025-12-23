export default function useImagePath() {
    const fixPath = (img) => {
        if (!img) return null;

        if (img.startsWith("public/")) {
            return "/" + img.replace("public/", "");
        }

        // 파일명만 들어온 경우
        if (!img.includes("/")) {
            return "/" + img;
        }

        return img;
    };

    return { fixPath };
}
