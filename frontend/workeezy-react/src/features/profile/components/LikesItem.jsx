import "./LikesItem.css";

export default function LikesItem({item}) {
    return (
        <div className="likes-card">
            <img src={item.img} alt={item.title} className="likes-card-img"/>

            <div className="likes-card-body">
                <h3 className="likes-card-title">{item.title}</h3>

                <div className="likes-card-bottom">
                    <i className="far fa-heart likes-heart"></i>
                    <span className="likes-price">{item.price}</span>
                </div>
            </div>
        </div>
    );
}