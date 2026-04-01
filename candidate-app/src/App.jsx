import React from 'react';
import ApplyForm from './components/ApplyForm';
import PullToRefresh from './components/PullToRefresh';

function App() {
  return (
    <PullToRefresh>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ApplyForm />
      </div>
    </PullToRefresh>
  );
}

export default App;
