import "./LikesList.css";
import LikesItem from "./LikesItem";

export default function LikesList({ items }) {
    return (
        <div className="likes-grid">
            {items.map((item) => (
                <LikesItem key={item.id} item={item} />
            ))}
        </div>
    );
}
