
import React from 'react';

export const Avatar2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
        <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
        </mask>
        <g mask="url(#mask__beam)">
            <rect width="36" height="36" fill="#75c043"></rect>
            <rect x="0" y="0" width="36" height="36" transform="translate(-5 5) rotate(10 18 18) scale(1.1)" fill="#2d2d2d" rx="36"></rect>
            <g transform="translate(-5 0) rotate(0 18 18)">
                <path d="M15 21c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" strokeLinecap="round"></path>
                <rect x="11" y="14" width="3.5" height="3.5" rx="1" fill="#FFFFFF"></rect>
                <rect x="21" y="14" width="3.5" height="3.5" rx="1" fill="#FFFFFF"></rect>
            </g>
        </g>
    </svg>
);
