import React, { useState } from 'react';

const ApplyForm = () => {
    const [step, setStep] = useState(1);
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

        // Use FormData for file uploads
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
                setStatus({ type: 'success', message: 'Application submitted successfully' });
                setFormData({
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
                setFiles({
                    image: null,
                    cert_10th: null,
                    cert_12th: null,
                    cert_degree: null
                });
                setStep(1);
            } else {
                setStatus({ type: 'error', message: result.error || 'Something went wrong' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to connect to the server' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Join Our Team
                </h2>
                <span className="text-sm font-bold text-gray-400">Step {step} of 2</span>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Father's Name</label>
                                <input
                                    type="text"
                                    name="fathers_name"
                                    value={formData.fathers_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mother's Name</label>
                                <input
                                    type="text"
                                    name="mothers_name"
                                    value={formData.mothers_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Alternative Number</label>
                                <input
                                    type="tel"
                                    name="alternative_mobile"
                                    value={formData.alternative_mobile}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Degree / Qualification</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Experience</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Address</label>
                            <textarea
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform transition-all mt-4"
                        >
                            Next Step
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Select Your Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-600"
                            >
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
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">1. Candidate Photo</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">2. 10th Marksheet</label>
                                    <input
                                        type="file"
                                        name="cert_10th"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">3. 12th Marksheet</label>
                                    <input
                                        type="file"
                                        name="cert_12th"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">4. Degree Certificate</label>
                                    <input
                                        type="file"
                                        name="cert_degree"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 py-4 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transform transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ApplyForm;
