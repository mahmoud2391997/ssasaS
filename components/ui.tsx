import React, { useEffect, useRef } from 'react';

// Spinner Component
export const Spinner: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
    <div className={`animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 ${className}`} role="status">
        <span className="sr-only">Loading...</span>
    </div>
);

// Icon Components
export const RoomsIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M12.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

export const ReservationsIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" />
    </svg>
);

export const LogoutIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const logoDataUri = "data:image/png;base64,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o/9Z/zP/mf9Z/yX/Jf+5/yX/ev91/7r/sf+5/4L/gv/Hf8H/rv8F/2H/Wf9Z/1n/sf99/33/df+6/33/uv99/3P/c/9z/13/uv9Z/1n/If8l/13/gv+K/zP/If8Z/xP/C/8T/xn/gv+s/4z/jP+s/7z/gv+s/7T/ov+c/5j/ov/D/2P/Y/8T/x//Y/8T/1n/Gf8T/zn/S/85/5j/vP+c/4L/vP/E/8j/yH/P/6H/sv/D/5L/xP+h/1//Wf9Z/zn/h/8T/zn/ev/D/6H/Q/8F/xP/gv8F/5L/If8F/0v/Wf8T/zP/Wf8T/yX/ev99/3X/If8l/zn/S/9T/zn/Of+5/13/Sf85/zn/df9T/5L/Wf8T/5L/kv+s/zP/Sf9T/2n/Sf95/3X/ef9r/2n/a/95/0X/uv/D/9r/uv/D/7r/ov+K/5L/vP+K/7r/y3/J/6L/Q/+H/xn/S/+H/wf/S/8Z/zH/kv+C/zH/kv9Z/3X/Wf8F/3n/Bf9Z/4L/Of+S/4L/kv+s/wL/uv+S/x3/Wf9Z/yH/df8h/yX/Jf8Z/xH/If85/4L/Sf/5/1n/Of/p/yP/+f+x/zP/If+x/zn/O//J/+t/7//2/+H/9v/B//n/+v/wf/b/4//w/+//+f+n/6H/+f/F/+H/2P/T//T/5v/d/+T/5H/v/zP/Of9Z/yH/Gf+6/67/sf+x/zP/gv/P/83/6n/2/7b/tv/p/+//0//w/7D/2P/s/8n/yf/V/8P/wf/R/9//w//L/zP/gv+K/yX/gv8l/2n/gv9d/wL/Yf/7/x//h/9j/4L/sv+H/xP/Wf8l/zP/sv+K/xH/Wf8F/yX/Ff/n/2H/Wf+x/1n/Ev374X+1uR8Rj3UAAAAASUVORK5CYII=";

export const Logo: React.FC<{ className?: string }> = (props) => (
    <img src={logoDataUri} alt="GuestPortal.io Logo" {...props} />
);

// QR Code Generator Component
declare global {
  interface Window {
    QRCode: any;
  }
}

export const QRCodeGenerator: React.FC<{ text: string, size?: number }> = ({ text, size=128 }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (qrRef.current && text) {
            qrRef.current.innerHTML = ''; // Clear previous QR code
            new window.QRCode(qrRef.current, {
                text: text,
                width: size,
                height: size,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: window.QRCode.CorrectLevel.H
            });
        }
    }, [text, size]);

    return <div ref={qrRef} className="flex items-center justify-center p-2 bg-white rounded-lg shadow-inner"></div>;
};