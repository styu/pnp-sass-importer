import React from "react";

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            <span>{title}</span>
            <button>Action</button>
        </header>
    );
};
