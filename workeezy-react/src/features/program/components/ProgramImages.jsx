import "./ProgramImages.css";
import { useProgramDetail } from "../context/ProgramDetailContext.jsx";
import useImagePath from "../hooks/useImagePath.js";

export default function ProgramImages() {
    const { mainImage, subImages } = useProgramDetail();
    const { fixPath } = useImagePath();

    const fixedMain = fixPath(mainImage);
    const fixedSubs = (subImages ?? []).map(fixPath);

    return (
        <div className="pd-images">
            {fixedMain && <img src={fixedMain} className="pd-main-img" />}

            <div className="pd-sub-imgs">
                {fixedSubs.map((src, i) =>
                    src ? <img key={i} src={src} className="pd-sub-img" /> : null
                )}
            </div>
        </div>
    );
}
