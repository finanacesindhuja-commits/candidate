import React, { useState } from 'react';
import QRCodeModal from './QRCodeModal';

/* ── inline styles for animations (no extra CSS file needed) ── */
const styles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes fadeInScale {
  0%   { opacity: 0; transform: scale(0.7); }
  60%  { opacity: 1; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes bounceIn {
  0%   { opacity: 0; transform: translateY(40px); }
  60%  { opacity: 1; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes checkDraw {
  to { stroke-dashoffset: 0; }
}
@keyframes ripple {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}
@keyframes confettiFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120px) rotate(720deg); opacity: 0; }
}
.spinner-ring {
  width: 56px; height: 56px;
  border: 5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.success-card {
  animation: fadeInScale 0.5s cubic-bezier(.34,1.56,.64,1) forwards;
}
.bounce-in {
  animation: bounceIn 0.6s cubic-bezier(.34,1.56,.64,1) forwards;
}
.check-path {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: checkDraw 0.5s 0.3s ease forwards;
}
.ripple {
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 3px solid #6366f1;
  animation: ripple 1.2s ease-out infinite;
}
`;

const SubmittingOverlay = () => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'linear-gradient(135deg, #4f46e5cc, #7c3aedcc)',
    backdropFilter: 'blur(6px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '20px'
  }}>
    <div className="spinner-ring" />
    <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', letterSpacing: '0.5px' }}>
      Submitting your application…
    </p>
    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
      Please wait a moment ✨
    </p>
  </div>
);

const SuccessScreen = ({ name, onReset }) => {
  const confetti = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 5.5) % 100}%`,
    color: ['#6366f1','#a855f7','#ec4899','#f59e0b','#10b981','#3b82f6'][i % 6],
    delay: `${(i * 0.12).toFixed(2)}s`,
    size: `${8 + (i % 5) * 3}px`,
  }));

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* confetti */}
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', top: '-20px', left: c.left,
          width: c.size, height: c.size, borderRadius: '3px',
          background: c.color, opacity: 0,
          animation: `confettiFall 1.8s ${c.delay} ease-out forwards`
        }} />
      ))}

      <div className="success-card" style={{
        maxWidth: '420px', width: '100%',
        background: '#fff', borderRadius: '28px',
        boxShadow: '0 25px 60px rgba(99,102,241,0.18)',
        padding: '48px 36px', textAlign: 'center',
        position: 'relative'
      }}>
        {/* check circle */}
        <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 28px' }}>
          <div className="ripple" />
          <div className="ripple" style={{ animationDelay: '0.4s' }} />
          <div style={{
            position: 'relative', zIndex: 1,
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)'
          }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path
                className="check-path"
                d="M10 23 L19 32 L34 14"
                stroke="white" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Good Day text */}
        <div className="bounce-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <p style={{
            fontSize: '13px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#a855f7', marginBottom: '8px'
          }}>Application Submitted</p>
          <h1 style={{
            fontSize: '42px', fontWeight: 900, lineHeight: 1.1,
            background: 'linear-gradient(135deg, #4f46e5, #a855f7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>Good Day!</h1>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
            {name ? `Thank you, ${name}! 🎉` : 'Thank you! 🎉'}
          </p>
          <p style={{
            fontSize: '14px', color: '#6b7280', lineHeight: 1.7,
            marginBottom: '32px'
          }}>
            Your application has been received successfully.<br />
            Our HR team will contact you soon. Best of luck!
          </p>

          <div style={{
            background: 'linear-gradient(135deg, #f0f4ff, #faf5ff)',
            borderRadius: '16px', padding: '16px', marginBottom: '28px',
            border: '1.5px solid #e0e7ff'
          }}>
            <p style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, marginBottom: '4px' }}>
              📧 Check your email
            </p>
            <p style={{ fontSize: '13px', color: '#4b5563' }}>
              A confirmation email has been sent to you.
            </p>
          </div>

          <button
            onClick={onReset}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 700, fontSize: '15px',
              border: 'none', borderRadius: '14px', cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Apply Again
          </button>
        </div>
      </div>
    </div>
  );
};


const ApplyForm = () => {
    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [submittedName, setSubmittedName] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fathers_name: '',
        mothers_name: '',
        mobile: '',
        alternative_mobile: '',
        area: '',
        degree: '',
        experience: '',
        role: ''
    });
    const [files, setFiles] = useState({
        image: null,
        cert_10th: null,
        cert_12th: null,
        cert_degree: null
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const nextStep = (e) => {
        e.preventDefault();
        const { name, email, fathers_name, mobile, area, degree, experience } = formData;
        if (!name || !email || !fathers_name || !mobile || !area || !degree || !experience) {
            setStatus({ type: 'error', message: 'Please fill all fields in Step 1' });
            return;
        }
        setStatus({ type: '', message: '' });
        setStep(2);
    };

    const prevStep = () => {
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.role) {
            setStatus({ type: 'error', message: 'Please select a role' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (files.image) data.append('image', files.image);
        if (files.cert_10th) data.append('cert_10th', files.cert_10th);
        if (files.cert_12th) data.append('cert_12th', files.cert_12th);
        if (files.cert_degree) data.append('cert_degree', files.cert_degree);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/apply`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            console.log('Server Response:', result);

            if (response.ok) {
                const name = formData.name;
                setFormData({
                    name: '', email: '', fathers_name: '', mothers_name: '',
                    mobile: '', alternative_mobile: '', area: '',
                    degree: '', experience: '', role: ''
                });
                setFiles({ image: null, cert_10th: null, cert_12th: null, cert_degree: null });
                setStep(1);
                setSubmittedName(name);
                setSubmitted(true);
            } else {
                setStatus({ type: 'error', message: result.error || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to the server' });
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join sindhuja.fin',
                    text: 'Apply for a staff position at sindhuja.fin',
                    url: window.location.origin,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.origin);
                setStatus({ type: 'success', message: 'Link copied to clipboard!' });
                setTimeout(() => setStatus({ type: '', message: '' }), 3000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    /* ── render ── */
    if (submitted) {
        return (
            <>
                <style>{styles}</style>
                <SuccessScreen
                    name={submittedName}
                    onReset={() => setSubmitted(false)}
                />
            </>
        );
    }

    return (
        <>
            <style>{styles}</style>

            {/* Spinner overlay */}
            {loading && <SubmittingOverlay />}

            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all relative">
                <QRCodeModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                    url={window.location.href}
                />

                <div className="flex justify-between items-center mb-8">
                    <h2
                        className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent select-none cursor-default"
                        onDoubleClick={() => setIsQRModalOpen(true)}
                        title=""
                    >
                        sindhuja.fin | Join Our Team
                    </h2>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">Progress</span>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Step {step}/2</span>
                    </div>
                </div>

                {status.message && (
                    <div className={`mb-6 p-4 rounded-xl text-center text-sm font-medium animate-fade-in ${status.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={step === 1 ? nextStep : handleSubmit} className="space-y-6">
                    {step === 1 ? (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Email ID</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Father's Name</label>
                                    <input type="text" name="fathers_name" value={formData.fathers_name} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Mother's Name</label>
                                    <input type="text" name="mothers_name" value={formData.mothers_name} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Mobile</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Alternative Number</label>
                                    <input type="tel" name="alternative_mobile" value={formData.alternative_mobile} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Degree / Qualification</label>
                                <input type="text" name="degree" value={formData.degree} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Experience</label>
                                <input type="text" name="experience" value={formData.experience} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Full Address</label>
                                <textarea name="area" value={formData.area} onChange={handleChange} required rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium resize-none" />
                            </div>

                            <button type="submit"
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform transition-all mt-4">
                                Next Step
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Select Your Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 shadow-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-600">
                                    <option value="">-- Choose a Role --</option>
                                    <option value="Relationship Officer">Relationship Officer</option>
                                    <option value="Verifier">Verifier</option>
                                    <option value="Manager">Manager</option>
                                    <option value="HR">HR</option>
                                    <option value="Area Manager">Area Manager</option>
                                    <option value="Disbursement Officer">Disbursement Officer</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">1. Candidate Photo</label>
                                    <input type="file" name="image" accept="image/*" onChange={handleFileChange}
                                        className="w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">2. 10th Marksheet</label>
                                        <input type="file" name="cert_10th" accept="image/*,.pdf" onChange={handleFileChange}
                                            className="w-full text-xs text-gray-800 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">3. 12th Marksheet</label>
                                        <input type="file" name="cert_12th" accept="image/*,.pdf" onChange={handleFileChange}
                                            className="w-full text-xs text-gray-800 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">4. Degree Certificate</label>
                                        <input type="file" name="cert_degree" accept="image/*,.pdf" onChange={handleFileChange}
                                            className="w-full text-xs text-gray-800 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-8">
                                <button type="button" onClick={prevStep}
                                    className="flex-1 py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all">
                                    Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-[2] py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                                    Submit Application
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default ApplyForm;
