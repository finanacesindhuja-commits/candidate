import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeModal = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 transform transition-all scale-100 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="text-center space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">Scan to Apply</h3>
                        <p className="text-gray-500 text-sm mt-2">Scan this QR code to open the application form on another device.</p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl inline-block border-2 border-dashed border-gray-200">
                        <QRCodeSVG 
                            value={url || window.location.href}
                            size={200}
                            level="H"
                            includeMargin={true}
                            imageSettings={{
                                src: "https://api.dicebear.com/7.x/initials/svg?seed=SF&backgroundColor=6366f1",
                                x: undefined,
                                y: undefined,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(url || window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            <span>Copy Link</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
