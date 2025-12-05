import "./ProgramImages.css";

export default function ProgramImages({ mainImage, subImages = [] }) {

    const fixPath = (img) => {
        if (!img) return null;

        if (img.startsWith("public/")) {
            return "/" + img.replace("public/", "");
        }

        // 파일명만 들어온 경우 → public/파일명으로 매핑
        if (!img.includes("/")) {
            return "/" + img;
        }

        return img;
    };

    const fixedMain = fixPath(mainImage);
    const fixedSubs = subImages.map(fixPath);

    return (
        <div className="pd-images">
            <img src={fixedMain} className="pd-main-img" />

            <div className="pd-sub-imgs">
                {fixedSubs.map((src, i) => (
                    src
                        ? <img key={i} src={src} className="pd-sub-img" />
                        : null
                ))}
            </div>
        </div>
    );
}

