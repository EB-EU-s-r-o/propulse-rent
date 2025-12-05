import { useEffect, useState } from 'react';

interface WelcomeScreenProps {
    isLoading: boolean;
}

const WelcomeScreen = ({ isLoading }: WelcomeScreenProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            // Wait for the fade-out transition to finish before removing from DOM
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 500); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] bg-white flex items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <img
                className="logo relative max-w-1/2 max-h-8 w-auto md:max-h-8 xl:max-h-12 xl:max-w-auto xl:w-auto xl:max-w-full animate-pulse"
                src="https://agentplus-s3.s3.eu-west-2.amazonaws.com/roof21/logos/2024/12/16/bfd63c6d-ba7c-4870-9097-08ac8b78470c.png"
                alt="ROOF21 Logo"
                loading="eager"
            />
        </div>
    );
};

export default WelcomeScreen;
