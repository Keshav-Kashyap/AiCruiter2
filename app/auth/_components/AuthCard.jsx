import React from 'react';

const AuthCard = ({ children }) => {
    return (
        <div className='flex flex-col items-center border border-white/10 rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-lg w-full shadow-2xl'>
            <div className='flex items-center flex-col w-full'>
                {children}
            </div>
        </div>
    );
};

export default AuthCard;