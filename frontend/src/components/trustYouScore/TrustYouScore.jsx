import React from 'react';
import './trustYouScore.css';

const TrustYouScore = ({ overall, kaligo, solo, couple, family, business }) => {
    return (
        <div className="trustYouContainer">
            <div className="trustYouWrapper">
                <h1 className="trustYouTitle">TrustYou Score</h1>
                <div className="trustYouSection">
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Overall</div>
                        <div className="trustYouScore">{overall}</div>
                        <div className="trustYouScoreSubtitle">out of 100</div>
                    </div>
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Kaligo Overall</div>
                        <div className="trustYouScore">{kaligo}</div>
                        <div className="trustYouScoreSubtitle">out of 5</div>
                    </div>
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Solo</div>
                        <div className="trustYouScore">{solo}</div>
                        <div className="trustYouScoreSubtitle">out of 100</div>
                    </div>
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Couple</div>
                        <div className="trustYouScore">{couple}</div>
                        <div className="trustYouScoreSubtitle">out of 100</div>
                    </div>
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Family</div>
                        <div className="trustYouScore">{family}</div>
                        <div className="trustYouScoreSubtitle">out of 100</div>
                    </div>
                    <div className="trustYouCategory">
                        <div className="trustYouCategoryTitle">Business</div>
                        <div className="trustYouScore">{business}</div>
                        <div className="trustYouScoreSubtitle">out of 100</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustYouScore;
