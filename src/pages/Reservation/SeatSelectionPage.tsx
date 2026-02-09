// src/pages/SeatSelectionPage.tsx (파일 위치에 맞게 저장하세요)
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 👇 아까 수정한 API와 타입 파일 불러오기
import { getSchedules, getSeats, reserveSeat } from '@/api/ticket';
import type { Schedule, Seat } from '@/types/ticket';
import { ChevronLeft } from 'lucide-react';

// 👇 컴포넌트 이름을 파일명과 똑같이 SeatSelectionPage로 변경!
export default function SeatSelectionPage() {
  const { scheduleId } = useParams(); 
  const id = scheduleId; // 기존 코드 호환을 위해 변수 할당

  const navigate = useNavigate();

  // 상태 관리 (Step 1: 날짜 선택 -> Step 2: 좌석 선택)
  const [step, setStep] = useState<1 | 2>(1);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // [STEP 1] 화면 들어오자마자 스케줄(날짜) 불러오기
  useEffect(() => {
  if (id) {
    getSchedules(id)
      .then((data) => {
        // 🚨 여기를 봐주세요! 데이터가 어떻게 생겼나요?
        console.log('🔥 받아온 스케줄 데이터:', data); 
        
        // 만약 data가 undefined라면? -> API 함수에서 .data를 또 쓴 게 원인
        // 만약 data가 [] (빈 배열)라면? -> MSW 주소 불일치
        
        setSchedules(data || []); // 안전장치 추가
      })
      .catch((err) => console.error("스케줄 로딩 실패:", err));
  }
}, [id]);

  // 날짜 선택 핸들러 -> 좌석 불러오기
  const handleScheduleClick = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    try {
      const seatData = await getSeats(schedule.id);
      setSeats(seatData);
      setStep(2); // 다음 단계(좌석 선택)로 이동
    } catch (error) {
      alert("좌석 정보를 불러오는데 실패했습니다.");
    }
  };

  // 좌석 선택 핸들러
  const handleSeatClick = (seat: Seat) => {
    if (seat.isReserved) return; // 이미 예약된 좌석은 클릭 금지
    setSelectedSeat(seat);
  };

  // [핵심] 예매(결제) 요청 핸들러
  const handleReservation = async () => {
    if (!selectedSeat) return;

    // ✅ 수정 코드: 스케줄(selectedSchedule)이 없으면 실행하지 마라!
    if (!selectedSeat || !selectedSchedule) {
      alert("날짜와 좌석을 모두 선택해주세요.");
      return;
    }
    
    // 로그인된 유저 ID 가져오기 (없으면 임시값 1)
    const userStr = sessionStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : 1; 

    try {
      // POST /api/reservations 호출
      const response = await reserveSeat(userId, selectedSeat.id);
      
      // 백엔드 명세서에 따르면 성공 시 status: 'SUCCESS'가 옴
      if (response && response.status === 'SUCCESS') {
         const newTicket = {
          reservationId: response.reservationId, // 예약번호
          title: '2026 싸이 흠뻑쇼', // (API에서 제목을 안 가져왔다면 일단 하드코딩 or props로 받아야 함)
          date: selectedSchedule.date,
          time: selectedSchedule.time,
          seat: selectedSeat.seatNumber,
          grade: selectedSeat.grade,
          price: selectedSeat.price,
          poster: 'https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg' // 썸네일
        };

        // 기존 예매 내역 가져오기 (없으면 빈 배열)
      const existing = JSON.parse(localStorage.getItem('myTickets') || '[]');
      
      // 새 티켓 추가해서 다시 저장
      localStorage.setItem('myTickets', JSON.stringify([...existing, newTicket]));

        alert(`🎉 예매 성공!\n예약번호: ${response.reservationId}\n좌석: ${selectedSeat.seatNumber}`);
        navigate('/mypage'); // 예매 확인 페이지로 이동
      }
    } catch (error) {
      console.error(error);
      alert("❌ 예매 실패: 이미 선택된 좌석이거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col">
      {/* 헤더 */}
      <header className="h-16 border-b border-stone-800 flex items-center px-4 bg-stone-900 justify-between">
        <div className="flex items-center">
          <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2 hover:bg-stone-800 rounded-full">
            <ChevronLeft />
          </button>
          <span className="ml-2 font-bold text-lg">
            {step === 1 ? '날짜 선택' : '좌석 선택'}
          </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        
        {/* 왼쪽: 정보 패널 (항상 보임) */}
        <div className="w-full md:w-80 bg-stone-900 border-r border-stone-800 p-6 flex flex-col justify-between">
           <div>
             <h2 className="text-xl font-bold text-indigo-400 mb-6">예매 정보</h2>
             {selectedSchedule && (
               <div className="mb-4 p-4 bg-stone-800 rounded-lg">
                 <p className="text-stone-400 text-sm">일시</p>
                 <p className="font-bold text-lg">{selectedSchedule.date} {selectedSchedule.time}</p>
                 <p className="text-stone-500 text-sm">{selectedSchedule.round}회차</p>
               </div>
             )}
             {selectedSeat && (
               <div className="mb-4 p-4 bg-stone-800 rounded-lg border border-indigo-500/50 animate-pulse">
                 <p className="text-stone-400 text-sm">선택 좌석</p>
                 <p className="font-bold text-xl">{selectedSeat.grade}석</p>
                 <p className="text-lg">{selectedSeat.seatNumber}번</p>
                 <p className="text-indigo-400 font-bold mt-2 text-xl">{selectedSeat.price.toLocaleString()}원</p>
               </div>
             )}
           </div>
           
           {/* 결제 버튼 (Step 2에서만 활성화) */}
           {step === 2 && (
             <button 
               onClick={handleReservation}
               disabled={!selectedSeat}
               className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-lg transition-all"
             >
               {selectedSeat ? '결제하기' : '좌석을 선택하세요'}
             </button>
           )}
        </div>

        {/* 오른쪽: 메인 스테이지 */}
        <div className="flex-1 overflow-y-auto bg-stone-950 p-6 flex justify-center">
          
          {/* STEP 1: 스케줄 목록 */}
          {step === 1 && (
            <div className="w-full max-w-lg space-y-4">
              <h3 className="text-2xl font-bold mb-6 text-center">관람하실 회차를 선택해주세요</h3>
              {schedules.map((sch) => (
                <button
                  key={sch.id}
                  onClick={() => handleScheduleClick(sch)}
                  className="w-full p-5 flex justify-between items-center bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl transition-all hover:border-indigo-500 group"
                >
                  <div className="text-left">
                    <p className="font-bold text-lg group-hover:text-indigo-400">{sch.date}</p>
                    <p className="text-stone-500">{sch.time}</p>
                  </div>
                  <div className="px-4 py-2 bg-stone-950 rounded-lg text-sm text-stone-400">
                    선택 가능
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: 좌석 배치도 */}
          {step === 2 && (
            <div className="flex flex-col items-center">
              {/* STAGE */}
              <div className="w-64 h-16 bg-gradient-to-b from-stone-800 to-stone-900 mb-12 rounded-b-3xl flex items-center justify-center shadow-2xl border-b border-stone-700">
                <span className="text-2xl font-black text-stone-600 tracking-[0.5em]">STAGE</span>
              </div>

              {/* 좌석 그리드 */}
              <div className="grid grid-cols-5 gap-3 p-8 bg-stone-900/30 rounded-3xl border border-stone-800">
                {seats.map((seat) => {
                  const isSelected = selectedSeat?.id === seat.id;
                  
                  // 스타일 로직
                  let baseStyle = "w-12 h-12 rounded-lg text-xs font-bold transition-all transform hover:scale-105 ";
                  
                  if (seat.isReserved) {
                    baseStyle += "bg-stone-800 text-stone-600 cursor-not-allowed border border-stone-700";
                  } else if (isSelected) {
                    baseStyle += "bg-indigo-600 text-white ring-4 ring-indigo-500/30 z-10 scale-110";
                  } else {
                    baseStyle += seat.grade === 'VIP' 
                      ? "bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60"
                      : "bg-blue-900/40 text-blue-200 border border-blue-500/30 hover:bg-blue-800/60";
                  }

                  return (
                    <button
                      key={seat.id}
                      disabled={seat.isReserved}
                      onClick={() => handleSeatClick(seat)}
                      className={baseStyle}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>

              {/* 범례 */}
              <div className="flex gap-4 mt-8 text-xs text-stone-400">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-900/40 border border-purple-500/30 rounded"></div> VIP석</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-900/40 border border-blue-500/30 rounded"></div> Regular석</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-stone-800 border border-stone-700 rounded"></div> 예매완료</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}