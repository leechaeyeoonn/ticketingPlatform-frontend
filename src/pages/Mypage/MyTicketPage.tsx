// src/pages/MyPage/MyTicketPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Ticket } from 'lucide-react'; // 아이콘 (설치 안됐으면 글자로 대체됨)

interface TicketData {
  reservationId: number;
  title: string;
  date: string;
  time: string;
  seat: string;
  grade: string;
  price: number;
  poster: string;
}

export default function MyTicketPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketData[]>([]);

  // 1. 화면 켜지면 localStorage에서 데이터 꺼내오기
  useEffect(() => {
    const saved = localStorage.getItem('myTickets');
    if (saved) {
      setTickets(JSON.parse(saved));
    }
  }, []);

  // 2. 예매 취소 핸들러
  const handleCancel = (targetId: number) => {
    if (!window.confirm('정말 예매를 취소하시겠습니까?')) return;

    // 선택한 것만 뺀 나머지를 남김 (filter)
    const updatedTickets = tickets.filter(t => t.reservationId !== targetId);
    
    // 상태 업데이트 & localStorage 갱신
    setTickets(updatedTickets);
    localStorage.setItem('myTickets', JSON.stringify(updatedTickets));

    alert('예매가 취소되었습니다.');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Ticket className="text-indigo-500" />
          내 예매 내역
        </h1>

        {tickets.length === 0 ? (
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
            {tickets.map((ticket) => (
              <div 
                key={ticket.reservationId} 
                className="bg-stone-900 rounded-2xl border border-stone-800 p-6 flex flex-col md:flex-row gap-6 hover:border-indigo-500/50 transition-all shadow-lg"
              >
                {/* 포스터 이미지 */}
                <div className="w-full md:w-32 h-40 bg-stone-800 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={ticket.poster} alt={ticket.title} className="w-full h-full object-cover" />
                </div>

                {/* 티켓 정보 */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded">
                      예약번호 {ticket.reservationId}
                    </span>
                    <button 
                      onClick={() => handleCancel(ticket.reservationId)}
                      className="text-stone-500 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> 예매 취소
                    </button>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-stone-300">
                    <div>
                      <p className="text-stone-500 text-xs">관람일시</p>
                      <p className="font-bold">{ticket.date} {ticket.time}</p>
                    </div>
                    <div>
                      <p className="text-stone-500 text-xs">좌석</p>
                      <p className="font-bold text-white">{ticket.grade}석 {ticket.seat}번</p>
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
      </div>
    </div>
  );
}