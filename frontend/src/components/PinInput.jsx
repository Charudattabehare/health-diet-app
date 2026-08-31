import React, { useRef } from 'react';

export default function PinInput({ pin, setPin, label = "6-Digit Password PIN" }) {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) {
      const newPin = pin.substring(0, index) + pin.substring(index + 1);
      setPin(newPin);
      return;
    }

    const digit = value[value.length - 1];
    const pinArray = pin.padEnd(6, ' ').split('');
    pinArray[index] = digit;
    const newPin = pinArray.join('').trim();
    setPin(newPin);

    if (index < 5 && digit) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setPin(pasted);
      const nextIndex = Math.min(pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="pin-input-group">
      <label className="pin-input-label">{label}</label>
      <div className="pin-boxes-container" onPaste={handlePaste}>
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const char = pin[idx] || '';
          return (
            <input
              key={idx}
              ref={(el) => (inputsRef.current[idx] = el)}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`pin-box ${char ? 'filled' : ''}`}
              placeholder="•"
            />
          );
        })}
      </div>
      <div className="pin-helper-text">
        <span>Password condition: Exactly 6 numerical digits</span>
        <span className={`pin-count ${pin.length === 6 ? 'valid' : ''}`}>
          {pin.length}/6
        </span>
      </div>
    </div>
  );
}
