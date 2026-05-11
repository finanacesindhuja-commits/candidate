import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeModal = ({ isOpen, onClose, url }) => {
    if (!isOpen) return null;

    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-canvas');
        if (canvas) {
            try {
                const pngUrl = canvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `sindhuja-fin-qr-${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } catch (err) {
                console.error("Error downloading QR:", err);
                alert("Could not save image. Try taking a screenshot or long-pressing the QR code.");
            }
        }
    };

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join sindhuja.fin',
                    text: 'Scan or click to apply for staff position at sindhuja.fin',
                    url: url || window.location.href,
                });
            } catch (err) {
                console.error("Error sharing link:", err);
            }
        } else {
            navigator.clipboard.writeText(url || window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const shareQRCode = async () => {
        const canvas = document.getElementById('qr-canvas');
        if (canvas && navigator.share && canvas.toBlob) {
            try {
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], "apply-qr.png", { type: "image/png" });
                    await navigator.share({
                        title: 'Join sindhuja.fin',
                        text: 'Scan to apply for staff position at sindhuja.fin',
                        files: [file],
                    });
                });
            } catch (err) {
                console.error("Error sharing QR:", err);
                downloadQRCode();
            }
        } else {
            downloadQRCode();
        }
    };


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
                        <QRCodeCanvas 
                            id="qr-canvas"
                            value={url || window.location.href}
                            size={512} // Increased resolution for better quality
                            style={{ width: '200px', height: '200px' }} // Display size remains 200px
                            level="H"
                            includeMargin={true}
                            imageSettings={{
                                src: "https://api.dicebear.com/7.x/initials/svg?seed=SF&backgroundColor=6366f1",
                                x: undefined,
                                y: undefined,
                                height: 80, // Larger logo for higher resolution
                                width: 80,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={shareQRCode}
                            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{navigator.share ? 'Share QR Image' : 'Save QR Image'}</span>
                        </button>

                        <button
                            onClick={shareLink}
                            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span>Share Link</span>
                        </button>
                        
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(url || window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="w-full py-2 px-6 text-gray-500 hover:text-indigo-600 font-medium transition-all flex items-center justify-center space-x-2 text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
