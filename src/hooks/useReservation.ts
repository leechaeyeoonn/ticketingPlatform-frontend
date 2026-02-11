import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchedules, getSeats, reserveSeat } from '@/api/ticket';
import type { Schedule, Seat } from '@/types/ticket';

export function useReservation(performanceId: string | undefined, title: string, poster: string) {
  const navigate = useNavigate();

  // 상태 관리
  const [step, setStep] = useState<1 | 2>(1);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // [STEP 1] 스케줄(날짜) 불러오기
  useEffect(() => {
    if (performanceId) {
      getSchedules(performanceId)
        .then((data) => setSchedules(data || []))
        .catch((err) => console.error('스케줄 로딩 실패:', err));
    }
  }, [performanceId]);

  // 날짜 선택 핸들러 -> 좌석 불러오기
  const handleScheduleClick = async (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    try {
      const seatData = await getSeats(schedule.id);
      setSeats(seatData);
      setStep(2); // 다음 단계(좌석 선택)로 이동
    } catch (error) {
      alert('좌석 정보를 불러오는데 실패했습니다.');
    }
  };

  // 좌석 선택 핸들러
  const handleSeatClick = (seat: Seat) => {
    if (seat.isReserved) return; // 이미 예약된 좌석은 클릭 금지
    setSelectedSeat(seat);
  };

  // 예매(결제) 요청 핸들러
  const handleReservation = async () => {
    if (!selectedSeat || !selectedSchedule) {
      alert('날짜와 좌석을 모두 선택해주세요.');
      return;
    }

    const userStr = sessionStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : 1;

    try {
      const response = await reserveSeat(userId, selectedSeat.id);

      if (response && response.status === 'SUCCESS') {
        const newTicket = {
          reservationId: response.reservationId,
          title, // ✅ 인자로 받은 title 사용
          date: selectedSchedule.date,
          time: selectedSchedule.time,
          seat: selectedSeat.seatNumber,
          grade: selectedSeat.grade,
          price: selectedSeat.price,
          poster, // ✅ 인자로 받은 poster 사용
        };

        const existing = JSON.parse(localStorage.getItem('myTickets') || '[]');
        localStorage.setItem('myTickets', JSON.stringify([...existing, newTicket]));

        // ✅ alert 대신 state로 메시지를 담아 마이페이지로 이동
        navigate('/mypage', {
          state: { successMessage: `🎉 예매 성공! (예약번호: ${response.reservationId})` },
        });
      }
    } catch (error) {
      console.error(error);
      alert('❌ 예매 실패: 이미 선택된 좌석이거나 오류가 발생했습니다.');
    }
  };

  return {
    step,
    setStep,
    schedules,
    selectedSchedule,
    seats,
    selectedSeat,
    handleScheduleClick,
    handleSeatClick,
    handleReservation,
  };
}
