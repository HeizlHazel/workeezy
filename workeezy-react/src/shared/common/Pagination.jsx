import "./Pagination.css";

export default function Pagination() {
    return (
        <div className="pagination">
            <span className="disabled">← Previous</span>
            <span className="page active">1</span>
            <span className="page">2</span>
            <span className="page">3</span>
            <span className="page">4</span>
            <span className="page">5</span>
            <span className="next">Next →</span>
        </div>
    );
}
