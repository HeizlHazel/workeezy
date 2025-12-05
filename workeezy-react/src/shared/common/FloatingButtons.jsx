import "./FloatingButtons.css";
import {FaChevronUp, FaRegComment, FaRegCommentAlt} from "react-icons/fa";
import {SiKakaotalk} from "react-icons/si";
import {useEffect, useState} from "react";

const openKakaoChat = () => {
    window.open("https://pf.kakao.com/_TShYn/chat", "_blank");
};
export default function FloatingButtons() {



    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return <div className="floating-btns">

        <button className="scroll-top" onClick={scrollToTop}>
            <FaChevronUp size={22}/>
        </button>

        <button className="chat" onClick={openKakaoChat}>
            <div className="chatButton">
                <FaRegCommentAlt size={22} color="#FFFFFF"/></div>
        </button>
    </div>
}
