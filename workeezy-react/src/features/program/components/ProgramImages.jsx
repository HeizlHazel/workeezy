import "./ProgramImages.css";

export default function ProgramImages({main, subs}) {
    return (
        <div className="pd-images">
            <img src={main} className="pd-main-img"/>
            <div className="pd-sub-imgs">
                {subs.map((src, i) => <img key={i} src={src} className="pd-sub-img"/>)}
            </div>
        </div>
    );
}
