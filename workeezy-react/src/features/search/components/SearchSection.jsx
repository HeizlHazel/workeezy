import SectionHeader from "../../../shared/common/SectionHeader.jsx";

export default function SearchSection({ children }) {
    return (
        <section className="search-page">
            <SectionHeader icon="fas fa-search" title="Search" />
            {children}
        </section>
    );
}
