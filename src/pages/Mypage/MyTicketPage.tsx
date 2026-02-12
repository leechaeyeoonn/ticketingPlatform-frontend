// src/pages/MyPage/MyTicketPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trash2, Ticket } from 'lucide-react'; // 아이콘 (설치 안됐으면 글자로 대체됨)
import Modal from '@/components/common/Modal';
import { useToast } from '@/hooks/useToast';
import { useMyTicketStore } from '@/store/useMyTicketStore';

export default function MyTicketPage() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 전달받은 state 확인용
  const { showToast } = useToast();

  // ✅ Zustand Store 사용
  const { myTickets, loadMyData, cancelReservation } = useMyTicketStore();

  // 모달 상태 관리
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // ✅ 예매 성공 메시지가 있으면 토스트 띄우기
  useEffect(() => {
    if (location.state?.successMessage) {
      showToast(location.state.successMessage, 'success');

      // ✅ 토스트를 띄운 후 state를 초기화하여 새로고침 시 다시 뜨지 않게 함
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, showToast, navigate]);

  // 1. 화면 켜지면 Store에서 데이터 로드
  useEffect(() => {
    loadMyData();
  }, [loadMyData]);

  // 2. 예매 취소 버튼 클릭 (모달 열기)
  const handleCancelClick = (targetId: number) => {
    setSelectedTicketId(targetId);
    setIsCancelModalOpen(true);
  };

  // 3. 실제 취소 처리 (모달 확인)
  const handleConfirmCancel = () => {
    if (selectedTicketId === null) return;

    // ✅ Store 액션 호출
    cancelReservation(selectedTicketId);

    setIsCancelModalOpen(false);
    showToast('예매가 취소되었습니다.', 'info');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Ticket className="text-indigo-500" />내 예매 내역
        </h1>

        {myTickets.length === 0 ? (
          <div className="text-center py-20 bg-stone-900 rounded-2xl border border-stone-800">
            <p className="text-stone-500 text-lg mb-4">예매한 내역이 없습니다.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-indigo-600 rounded-lg font-bold hover:bg-indigo-500 transition-all"
            >
              공연 보러가기
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {myTickets.map((ticket) => (
              <div
                key={ticket.reservationId}
                className="bg-stone-900 rounded-2xl border border-stone-800 p-6 flex flex-col md:flex-row gap-6 hover:border-indigo-500/50 transition-all shadow-lg"
              >
                {/* 포스터 이미지 */}
                <div className="w-full md:w-32 h-40 bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={ticket.poster}
                    alt={ticket.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 티켓 정보 */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded">
                      예약번호 {ticket.reservationId}
                    </span>
                    <button
                      onClick={() => handleCancelClick(ticket.reservationId)}
                      className="text-stone-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> 예매 취소
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-300">
                    <div>
                      <p className="text-stone-500 text-xs">관람일시</p>
                      <p className="font-bold">
                        {ticket.date} {ticket.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">좌석</p>
                      <p className="font-bold text-white">
                        {ticket.grade}석 {ticket.seat}번
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">결제금액</p>
                      <p className="font-bold text-indigo-300">{ticket.price.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 취소 확인 모달 */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          title="예매 취소"
        >
          <div className="space-y-6">
            <p className="text-stone-300">
              정말 예매를 취소하시겠습니까?
              <br />
              취소 후에는 복구할 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors shadow-lg shadow-red-900/20"
              >
                취소하기
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
