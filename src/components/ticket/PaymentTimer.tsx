import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface PaymentTimerProps {
  seconds: number;
  onExpire: () => void;
}

export default function PaymentTimer({ seconds, onExpire }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onExpire]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-red-400 font-bold bg-red-950/30 px-4 py-2 rounded-lg border border-red-900/50 animate-pulse">
      <Timer className="w-4 h-4" />
      <span>남은 결제 시간: {formatTime(timeLeft)}</span>
    </div>
  );
}
