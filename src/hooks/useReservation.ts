import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchedules, getSeats, reserveSeat } from '@/api/ticket';
import type { Schedule, Seat } from '@/types/ticket';
import { useReservationStore } from '@/store/useReservationStore';
import { useAuthStore } from '@/store/useAuthStore';

export function useReservation(performanceId: string | undefined, title: string, poster: string) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Zustand Store 사용
  const { step, scheduleId, selectedSeats, startReservation, setSchedule, toggleSeat } =
    useReservationStore();

  // 상태 관리
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  // scheduleId를 기반으로 현재 선택된 스케줄 객체 찾기 (파생 상태)
  const selectedSchedule = schedules.find((s) => s.id === scheduleId) || null;

  // [STEP 1] 스케줄(날짜) 불러오기
  useEffect(() => {
    if (performanceId) {
      // 컴포넌트 마운트 시 예매 시작 액션 호출 (기존 상태 초기화 등)
      startReservation(performanceId);

      getSchedules(performanceId)
        .then((data) => setSchedules(data || []))
        .catch((err) => console.error('스케줄 로딩 실패:', err));
    }
  }, [performanceId, startReservation]);

  // 날짜 선택 핸들러 -> 좌석 불러오기
  const handleScheduleClick = async (schedule: Schedule) => {
    setSchedule(schedule.id); // Store에 스케줄 ID 저장 및 step 변경
    try {
      const seatData = await getSeats(schedule.id);
      setSeats(seatData);
    } catch (error) {
      alert('좌석 정보를 불러오는데 실패했습니다.');
    }
  };

  // 좌석 선택 핸들러
  const handleSeatClick = (seat: Seat) => {
    if (seat.isReserved) return; // 이미 예약된 좌석은 클릭 금지
    toggleSeat(seat); // Store의 토글 액션 호출
  };

  // 예매(결제) 요청 핸들러
  const handleReservation = async () => {
    if (selectedSeats.length === 0 || !selectedSchedule) {
      alert('날짜와 좌석을 모두 선택해주세요.');
      return;
    }

    const userId = user?.id || 1;

    try {
      // 다중 좌석 예매 처리 (API가 단건 예매만 지원한다고 가정하고 반복 호출)
      // 실제로는 백엔드에서 배열을 받는 API를 만들어 한 번에 처리하는 것이 좋습니다.
      const results = [];
      for (const seat of selectedSeats) {
        const response = await reserveSeat(userId, seat.id);
        if (response && response.status === 'SUCCESS') {
          results.push({ seat, response });
        }
      }

      if (results.length > 0) {
        // 성공한 티켓들을 로컬 스토리지에 저장
        const newTickets = results.map(({ seat, response }) => ({
          reservationId: response.reservationId, // 각 예약 번호
          title, // ✅ 인자로 받은 title 사용
          date: selectedSchedule.date,
          time: selectedSchedule.time,
          seat: seat.seatNumber,
          grade: seat.grade,
          price: seat.price,
          poster, // ✅ 인자로 받은 poster 사용
        }));

        const existing = JSON.parse(localStorage.getItem('myTickets') || '[]');
        localStorage.setItem('myTickets', JSON.stringify([...existing, ...newTickets]));

        // ✅ alert 대신 state로 메시지를 담아 마이페이지로 이동
        navigate('/mypage', {
          state: { successMessage: `🎉 총 ${results.length}매 예매 성공!` },
        });
      }
    } catch (error) {
      console.error(error);
      alert('❌ 예매 실패: 이미 선택된 좌석이거나 오류가 발생했습니다.');
    }
  };

  return {
    step,
    schedules,
    selectedSchedule,
    seats,
    selectedSeats, // 단일 좌석(selectedSeat) 대신 배열 반환
    handleScheduleClick,
    handleSeatClick,
    handleReservation,
  };
}
