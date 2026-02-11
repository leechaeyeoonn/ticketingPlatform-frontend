// src/pages/Reservation/components/Step1Schedule.tsx
import type { Schedule } from '@/types/ticket';

interface Step1ScheduleProps {
  schedules: Schedule[];
  onSelectSchedule: (schedule: Schedule) => void;
}

export default function Step1Schedule({ schedules, onSelectSchedule }: Step1ScheduleProps) {
  return (
    <div className="w-full max-w-lg space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-center">관람하실 회차를 선택해주세요</h3>
      {schedules.map((sch) => (
        <button
          key={sch.id}
          onClick={() => onSelectSchedule(sch)}
          className="w-full p-5 flex justify-between items-center bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all hover:border-indigo-500 group"
        >
          <div className="text-left">
            <p className="font-bold text-lg group-hover:text-indigo-400">{sch.date}</p>
            <p className="text-stone-500">{sch.time}</p>
          </div>
          <div className="px-4 py-2 bg-stone-950 rounded-lg text-sm text-stone-400">선택 가능</div>
        </button>
      ))}
    </div>
  );
}
