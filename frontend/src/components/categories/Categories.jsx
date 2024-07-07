import React from 'react';
import './categories.css';

const Categories = ({ categories }) => {
    const categoryKeys = Object.keys(categories);

    return (
        <div className="categoriesContainer">
            <h1 className="categoriesTitle">Categories</h1>
            <div className="categoriesWrapper">
                {categoryKeys.map((key, index) => (
                    <div className="categoryBox" key={index}>
                        <div className="categoryTitle">{categories[key].name}</div>
                        <div className="categoryScore">{categories[key].score}</div>
                        <div className="categoryPopularity">{categories[key].popularity.toFixed(1)}% popularity</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
