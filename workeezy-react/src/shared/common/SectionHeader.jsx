import "./SectionHeader.css";

export default function SectionHeader({icon, title}) {
    return (
        <div className="section-header">
            <p className="section-title">
                {icon && <i className={icon}></i>}ㅤ{title}
            </p>
        </div>
    );
}