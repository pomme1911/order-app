import { CATEGORY_LABELS, MENU_CATEGORIES } from '../../utils/constants';
import './CategoryFilter.css';

/**
 * 카테고리 필터 컴포넌트
 */
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
    const categories = Object.values(MENU_CATEGORIES);

    return (
        <div className="category-filter">
            {categories.map((category) => (
                <button
                    key={category}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => onCategoryChange(category)}
                >
                    {CATEGORY_LABELS[category]}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
