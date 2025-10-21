
import React from 'react';

export const Avatar5: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
        <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
        </mask>
        <g mask="url(#mask__beam)">
            <rect width="36" height="36" fill="#405457"></rect>
            <rect x="0" y="0" width="36" height="36" transform="translate(2 6) rotate(140 18 18) scale(1)" fill="#f0db59" rx="36"></rect>
            <g transform="translate(-6 0) rotate(10 18 18)">
                <path d="M15 21c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path>
                <rect x="11" y="14" width="3.5" height="3.5" rx="1" fill="#000000"></rect>
                <rect x="21" y="14" width="3.5" height="3.5" rx="1" fill="#000000"></rect>
            </g>
        </g>
    </svg>
);
