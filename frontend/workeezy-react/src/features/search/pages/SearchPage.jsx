import PageLayout from "../../../layout/PageLayout.jsx";
import { SearchProvider } from "../context/SearchContext.jsx";
import SearchContent from "../components/SearchContent.jsx";
import SearchSection from "../components/SearchSection.jsx";
import RecommendedCarousel from "../components/RecommendedCarousel.jsx";
import SearchBarConnected from "../components/SearchBarConnected.jsx";
import CategoryFilterConnected from "../components/CategoryFilterConnected.jsx";

export default function SearchPage() {
    return (
        <PageLayout>
            <SearchProvider>
                <SearchSection>
                    <SearchBarConnected />
                    <CategoryFilterConnected />
                    <SearchContent />
                    <RecommendedCarousel />
                </SearchSection>
            </SearchProvider>
        </PageLayout>
    );
}
