import PageLayout from "../../../layout/PageLayout.jsx";
import { SearchProvider } from "../context/SearchContext.jsx";
import SearchContent from "../components/SearchContent.jsx";
import SearchSection from "../components/SearchSection.jsx";
import SearchViewTabs from "../components/SearchViewTabs.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import RecommendedCarousel from "../components/RecommendedCarousel.jsx";
import SearchBarConnected from "../components/SearchBarConnected.jsx";

export default function SearchPage() {
    return (
        <PageLayout>
            <SearchProvider>
                <SearchSection>
                    <SearchBarConnected />
                    <SearchViewTabs />
                    <CategoryFilter />
                    <SearchContent />
                    <RecommendedCarousel />
                </SearchSection>
            </SearchProvider>
        </PageLayout>
    );
}
