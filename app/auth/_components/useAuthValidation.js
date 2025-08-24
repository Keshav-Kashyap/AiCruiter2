import { useState, useEffect } from 'react';

// Validation Hook
export const useAuthValidation = () => {
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

    return {
        validateEmail,
        validatePhone
    };
};

// Timer Hook
export const useAuthTimer = () => {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return {
        timer,
        setTimer
    };
};