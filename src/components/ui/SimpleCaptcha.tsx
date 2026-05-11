import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onVerify }) => {
  const [captchaCode, setCaptchaCode] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserInput('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setUserInput(val);
    onVerify(val === captchaCode);
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">Human Verification</label>
        <button 
          type="button"
          onClick={generateCaptcha}
          className="text-sky-900 hover:rotate-180 transition-transform duration-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex gap-4">
        <div className="flex-1 bg-white border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center py-3 select-none">
          <span className="text-xl font-black tracking-[0.5em] text-slate-400 italic line-through decoration-sky-900/30">
            {captchaCode}
          </span>
        </div>
        <input 
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Enter code"
          maxLength={6}
          className="w-32 px-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-sky-300 transition-all font-bold text-center uppercase tracking-widest placeholder:text-[10px] placeholder:tracking-normal"
        />
      </div>
      <p className="text-[10px] text-slate-400 font-medium">Please type the characters you see in the box.</p>
    </div>
  );
};

export default SimpleCaptcha;
