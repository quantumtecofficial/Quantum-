
import React from 'react';

export const Avatar3: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" {...props}>
        <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
        </mask>
        <g mask="url(#mask__beam)">
            <rect width="36" height="36" fill="#c20d0d"></rect>
            <rect x="0" y="0" width="36" height="36" transform="translate(5 -5) rotate(220 18 18) scale(1.2)" fill="#ffffff" rx="36"></rect>
            <g transform="translate(-5 -5) rotate(0 18 18)">
                <path d="M13,21 a1,1 0 0,0 10,0" fill="#000000"></path>
                <rect x="12" y="14" width="3.5" height="3.5" rx="1" fill="#000000"></rect>
                <rect x="20" y="14" width="3.5" height="3.5" rx="1" fill="#000000"></rect>
            </g>
        </g>
    </svg>
);
