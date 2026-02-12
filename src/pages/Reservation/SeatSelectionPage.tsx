import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Step1Schedule from './components/Step1Schedule';
import Step2SeatMap from './components/Step2SeatMap';
import { useReservation } from '@/hooks/useReservation';
import PaymentTimer from '@/components/ticket/PaymentTimer'; // 타이머 import
import { useReservationStore } from '@/store/useReservationStore';

// 👇 컴포넌트 이름을 파일명과 똑같이 SeatSelectionPage로 변경!
export default function SeatSelectionPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 이전 페이지(상세 페이지)에서 넘겨준 state 받기 (없을 경우 대비해 기본값 설정)
  const { title = '공연 정보 없음', poster = '' } = location.state || {};

  // ✅ 커스텀 훅 사용: 로직은 여기서 다 가져옵니다!
  const {
    step,
    schedules,
    selectedSchedule,
    seats,
    handleScheduleClick,
    handleReservation,
    handleSeatClick,
  } = useReservation(scheduleId, title, poster);

  // ✅ Store에서 직접 상태와 액션을 가져옵니다. (다중 선택 지원을 위해)
  const { selectedSeats, toggleSeat, setStep } = useReservationStore();

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      {/* 헤더 */}
      <header className="h-16 border-b border-stone-800 flex items-center px-4 bg-stone-900 justify-between">
        <div className="flex items-center">
          <button
            onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="p-2 hover:bg-stone-800 rounded-full"
          >
            <ChevronLeft />
          </button>
          <span className="ml-2 font-bold text-lg">{step === 1 ? '날짜 선택' : '좌석 선택'}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* 왼쪽: 정보 패널 (항상 보임) */}
        <div className="w-full md:w-80 bg-stone-900 border-r border-stone-800 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-indigo-400 mb-6">예매 정보</h2>

            {/* ⏱️ 좌석 선택 시 타이머 표시 */}
            {selectedSeats.length > 0 && (
              <div className="mb-6">
                <PaymentTimer
                  seconds={300}
                  onExpire={() => alert('결제 시간이 만료되었습니다! 다시 선택해주세요.')}
                />
              </div>
            )}

            {selectedSchedule && (
              <div className="mb-4 p-4 bg-stone-800 rounded-lg">
                <p className="text-stone-400 text-sm">일시</p>
                <p className="font-bold text-lg">
                  {selectedSchedule.date} {selectedSchedule.time}
                </p>
                <p className="text-stone-500 text-sm">{selectedSchedule.round}회차</p>
              </div>
            )}
            {selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="mb-4 p-4 bg-stone-800 rounded-lg border border-indigo-500/50 animate-pulse"
              >
                <p className="text-stone-400 text-sm">선택 좌석</p>
                <p className="font-bold text-xl">{seat.grade}석</p>
                <p className="text-lg">{seat.seatNumber}번</p>
                <p className="text-indigo-400 font-bold mt-2 text-xl">
                  {seat.price.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>

          {/* 결제 버튼 (Step 2에서만 활성화) */}
          {step === 2 && (
            <button
              onClick={handleReservation}
              disabled={selectedSeats.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all"
            >
              {selectedSeats.length > 0
                ? `${selectedSeats.length}석 결제하기`
                : '좌석을 선택하세요'}
            </button>
          )}
        </div>

        {/* 오른쪽: 메인 스테이지 */}
        <div className="flex-1 overflow-y-auto bg-stone-950 p-6 flex justify-center">
          {/* STEP 1: 스케줄 목록 */}
          {step === 1 && (
            <Step1Schedule schedules={schedules} onSelectSchedule={handleScheduleClick} />
          )}

          {/* STEP 2: 좌석 배치도 */}
          {step === 2 && (
            <Step2SeatMap
              seats={seats}
              selectedSeats={selectedSeats}
              onSelectSeat={handleSeatClick} // ✅ 예약된 좌석 체크 로직이 포함된 핸들러 사용
            />
          )}
        </div>
      </div>
    </div>
  );
}
