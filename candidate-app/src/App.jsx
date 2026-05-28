import React from 'react';
import ApplyForm from './components/ApplyForm';
import PullToRefresh from './components/PullToRefresh';
import QRCodeModal from './components/QRCodeModal';

function App() {
  const path = window.location.pathname;

  if (path === '/qr') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <QRCodeModal 
          isOpen={true} 
          onClose={() => window.location.href = '/'} 
          url={window.location.origin} 
        />
      </div>
    );
  }

  return (
    <PullToRefresh>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ApplyForm />
      </div>
    </PullToRefresh>
  );
}

export default App;
