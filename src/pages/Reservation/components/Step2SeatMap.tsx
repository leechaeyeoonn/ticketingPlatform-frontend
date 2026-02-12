// src/pages/Reservation/components/Step2SeatMap.tsx
import type { Seat } from '@/types/ticket';
import { X } from 'lucide-react';

// ✅ 좌석 등급별 스타일 정의 (확장성 고려)
const GRADE_STYLES: Record<string, string> = {
  VIP: 'bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60',
  Regular: 'bg-blue-900/40 text-blue-200 border border-blue-500/30 hover:bg-blue-800/60',
};

interface Step2SeatMapProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSelectSeat: (seat: Seat) => void;
}

export default function Step2SeatMap({ seats, selectedSeats, onSelectSeat }: Step2SeatMapProps) {
  return (
    <div className="flex flex-col items-center">
      {/* STAGE */}
      <div className="w-64 h-16 bg-gradient-to-b from-stone-800 to-stone-900 mb-12 rounded-b-3xl flex items-center justify-center shadow-2xl border-b border-stone-700">
        <span className="text-2xl font-black text-stone-600 tracking-[0.5em]">STAGE</span>
      </div>

      {/* 좌석 그리드 */}
      <div className="grid grid-cols-5 gap-3 p-8 bg-stone-900/30 rounded-3xl border border-stone-800">
        {seats.map((seat) => {
          const isSelected = selectedSeats.some((s) => s.id === seat.id);

          // 스타일 로직
          let baseStyle =
            'w-12 h-12 rounded-lg text-lg font-bold transition-all flex items-center justify-center ';

          if (seat.isReserved) {
            // ✅ 예약된 좌석: hover 효과를 완전히 배제하고 고정 스타일만 부여
            baseStyle +=
              'bg-stone-800 text-xl text-stone-600 pointer-events-none cursor-not-allowed border border-stone-700';
          } else {
            // ✅ 예약 가능 좌석: 여기서만 hover 및 선택 스타일 부여
            baseStyle += 'hover:scale-105 ';
            if (isSelected) {
              // 선택되었을 때
              baseStyle += 'bg-indigo-600 text-white ring-4 ring-indigo-500/30 z-10 scale-110';
            } else {
              // 선택되지 않았을 때만 등급별 보라색/파란색 스타일 적용
              baseStyle += GRADE_STYLES[seat.grade] || GRADE_STYLES.Regular;
            }
          }
          return (
            <button
              key={seat.id}
              disabled={seat.isReserved}
              onClick={() => onSelectSeat(seat)}
              className={baseStyle}
              title={seat.isReserved ? '이미 예매된 좌석' : ''}
            >
              {seat.isReserved ? (
                <X className="w-full h-full p-1 text-stone-700" strokeWidth={3} />
              ) : (
                seat.seatNumber
              )}
            </button>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="flex gap-4 mt-8 text-xs text-stone-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-900/40 border border-purple-500/30 rounded"></div> VIP석
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-900/40 border border-blue-500/30 rounded"></div> Regular석
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-stone-800 border border-stone-700 rounded flex items-center justify-center">
            <X className="w-2 h-2 text-stone-600" />
          </div>{' '}
          예매완료
        </div>
      </div>
    </div>
  );
}
