import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SearchSection from './SearchSection';
import WelcomeSection from './WelcomeSection';
import RecipeList from './RecipeList';
import { 
  FadeIn, 
  SlideIn, 
  StaggerContainer, 
  MorphIn, 
  AdvancedParallax, 
  FloatingElements,
  AdvancedStagger 
} from './Animations';

const Home = ({ 
  searchQuery,
  setSearchQuery,
  recipes,
  loading,
  handleSearch,
  user,
  darkMode,
  favorites,
  onToggleFavorite
}) => {
  return (
    <>
      <main className="main-content">
        {/* Hero Section with Advanced Morphing Animation */}
        <MorphIn morphType="elastic" delay={0.2}>
          <HeroSection 
            darkMode={darkMode}
          />
        </MorphIn>
        
        {/* Welcome Section with Parallax Background */}
        <AdvancedParallax speed={0.3}>
          <SlideIn direction="up" delay={0.4} duration={0.8}>
            <WelcomeSection 
              darkMode={darkMode}
            />
          </SlideIn>
        </AdvancedParallax>
        
        {/* Features Section with Advanced Stagger */}
        <AdvancedStagger 
          staggerDelay={0.15} 
          animationType="flip"
        >
          <FeaturesSection 
            darkMode={darkMode}
          />
        </AdvancedStagger>
        
        {/* Search Section with Floating Effect */}
        <FloatingElements intensity={0.5}>
          <MorphIn morphType="bounce" delay={0.6}>
            <SearchSection 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              darkMode={darkMode}
              saveRecipe={onToggleFavorite}
            />
          </MorphIn>
        </FloatingElements>
        
        {/* Recipe List with Advanced Parallax */}
        <AdvancedParallax speed={0.1}>
          <AdvancedStagger 
            staggerDelay={0.1} 
            animationType="scale"
          >
            <RecipeList 
              recipes={recipes}
              loading={loading}
              user={user}
              darkMode={darkMode}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </AdvancedStagger>
        </AdvancedParallax>
      </main>
    </>
  );
};

export default Home;
