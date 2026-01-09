import "./ErrorLayout.css";

export default function ErrorLayout({code, title, message, children}) {
    return (
        <div className="error-container">
            <h1 className="error-code">{code}</h1>
            <h2 className="error-title">{title}</h2>
            <p className="error-message">{message}</p>

            {children}
        </div>
    );
}