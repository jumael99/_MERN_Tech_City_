import React from 'react';

const Title = ({ children }) => {
    return (
        <h1 className="text-3xl font-bold my-4">
            {children}
        </h1>
    );
};

export default Title;
