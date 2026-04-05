import React from 'react';
import {FaStar, FaStarHalf, FaRegStar, FaStarHalfAlt} from "react-icons/fa";

function Rating({ value, text}) {
    return (
        <div className="flex-row flex">
            <span className="rating flex flex-row">
                { value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalfAlt/>:<FaRegStar/> }
                { value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalfAlt/>:<FaRegStar/> }
                { value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalfAlt/>:<FaRegStar/> }
                { value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalfAlt/>:<FaRegStar/> }
                { value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalfAlt/>:<FaRegStar/> }
            </span>
            <span className="rating-text"> { text }</span>
        </div>
    );
}

export default Rating;