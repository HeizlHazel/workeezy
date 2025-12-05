import "./FloatingButtons.css";
import {FaChevronUp, FaRegComment} from "react-icons/fa";
import {SiKakaotalk} from "react-icons/si";

export default function FloatingButtons() {
    return <div className="floating-btns">
        <button className="scroll-top"><FaChevronUp size={22} color="#FFFFFF" /></button>
        <button className="chat">
            <SiKakaotalk size={32} color="#FFFFFF" /></button>
    </div>
}
