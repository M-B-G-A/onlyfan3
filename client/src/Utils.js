import React, { useRef } from "react";
export function truncateMiddle(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    const ellipsis = '...';
    const truncatedLength = maxLength - ellipsis.length;
    const startLength = Math.ceil(truncatedLength / 2);
    const endLength = Math.floor(truncatedLength / 2);
    const truncatedText = text.substr(0, startLength) + ellipsis + text.substr(-endLength);
    return truncatedText;
}
export function formatValue(value) {
    return value.replace(/^0x0+/, '0x');
}
export function formatTimeAgo(timestamp) {
    const currentTime = new Date().getTime();
    const diffInMillis = currentTime - timestamp;
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    if (diffInMinutes < 1) {
        return "few seconds ago";
    }
    else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    }
    else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `${diffInHours} hours ago`;
    }
}
export const useDidMountEffect = (fn, inputs) => {
    const didMountRef = useRef(false);
    React.useEffect(() => {
        if (didMountRef.current) {
            fn();
        }
        else {
            didMountRef.current = true;
        }
    }, inputs);
};
