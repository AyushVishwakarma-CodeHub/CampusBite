import React, { useEffect, useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, Wallet, SmartphoneNfc } from 'lucide-react';

const CampusPayModal = ({ amount, onSuccess, onCancel }) => {
    const [step, setStep] = useState(0);

    // Simulated Payment Flow Automation
    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 1200); // Connect to Bank
        const timer2 = setTimeout(() => setStep(2), 2800); // Processing Data
        const timer3 = setTimeout(() => setStep(3), 4500); // Success!
        const timer4 = setTimeout(() => onSuccess(), 5800); // Fire callback

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onSuccess]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
            animation: 'fadeIn 0.3s ease-out'
        }}>
            <div className="card" style={{
                background: 'white', padding: '3rem 2rem', width: '90%', maxWidth: '420px',
                textAlign: 'center', borderRadius: 'var(--radius-xl)', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
                <button 
                    onClick={onCancel} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--gray)' }}
                >
                    ✕
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(255, 90, 95, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Wallet size={40} color="var(--primary)" />
                    </div>
                </div>

                <h2 className="heading-3" style={{ marginBottom: '0.5rem' }}>CampusPay Checkout</h2>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)' }}>₹{amount}</h1>
                
                <div style={{ background: 'var(--light)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem' }}>
                    
                    {step === 0 && (
                        <div className="animate-fade-in flex flex-col items-center gap-3">
                            <Loader2 size={28} className="spin-animation" color="var(--primary)" />
                            <p className="font-semibold text-muted">Initializing Secure Gateway...</p>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-fade-in flex flex-col items-center gap-3">
                            <ShieldCheck size={28} color="var(--primary)" />
                            <p className="font-semibold text-muted">Verifying Identity Token...</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in flex flex-col items-center gap-3">
                            <SmartphoneNfc size={28} className="pulse-animation" color="var(--primary)" />
                            <p className="font-semibold text-primary">Awaiting UPI Confirmation...</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in flex flex-col items-center gap-3">
                            <CheckCircle2 size={36} color="var(--success)" />
                            <p className="font-bold text-success" style={{ fontSize: '1.1rem' }}>Payment Successful!</p>
                            <p className="text-xs text-muted">Redirecting to kitchen...</p>
                        </div>
                    )}
                </div>

                <style>{`
                    .spin-animation { animation: spin 1.5s linear infinite; }
                    .pulse-animation { animation: pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.1); } }
                `}</style>
            </div>
        </div>
    );
};

export default CampusPayModal;
