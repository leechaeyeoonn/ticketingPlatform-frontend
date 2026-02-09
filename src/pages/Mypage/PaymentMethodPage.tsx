import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, Trash2, ChevronLeft, ShieldCheck } from 'lucide-react';

// 👇 아까 만든 타입 파일에서 import 해옵니다!
import type { MyCard } from '@/types/payment'; 

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  
  // 상태 관리
  const [cards, setCards] = useState<MyCard[]>([]);
  const [isAdding, setIsAdding] = useState(false); // 입력창 열기/닫기 상태
  
  // 입력 폼 상태
  const [form, setForm] = useState({ 
    name: '', 
    number: '', 
    expiry: '', 
    cvc: '' 
  });

  // ✅ 1. 화면 켜지면 localStorage에서 'myCards' 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('myCards');
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  // ✅ 2. 카드 추가하기 (localStorage에 저장)
  const handleAddCard = () => {
    // 빈 값 체크
    if (!form.name || !form.number || !form.expiry || !form.cvc) {
      alert('카드 정보를 모두 입력해주세요.');
      return;
    }

    // 카드 번호 마스킹 (보안 흉내: 1234123412341234 -> **** **** **** 1234)
    // 숫자가 아닌 문자 제거 후 처리
    const cleanNumber = form.number.replace(/[^0-9]/g, '');
    const maskedNumber = cleanNumber.length > 4 
      ? `**** **** **** ${cleanNumber.slice(-4)}` 
      : cleanNumber;

    const newCard: MyCard = {
      id: crypto.randomUUID(), // 랜덤 ID 생성
      cardName: form.name,
      cardNumber: maskedNumber,
      expiry: form.expiry,
      cvc: form.cvc
    };

    // 기존 목록에 새 카드 추가
    const updatedCards = [...cards, newCard];
    
    // 상태 업데이트 & localStorage 영구 저장
    setCards(updatedCards);
    localStorage.setItem('myCards', JSON.stringify(updatedCards));

    // 입력창 초기화 및 닫기
    setIsAdding(false);
    setForm({ name: '', number: '', expiry: '', cvc: '' });
    alert('새로운 카드가 안전하게 등록되었습니다!');
  };

  // ✅ 3. 카드 삭제하기 (localStorage 업데이트)
  const handleDelete = (id: string) => {
    if (!window.confirm('정말 이 카드를 삭제하시겠습니까?')) return;
    
    // 선택한 ID 빼고 나머지만 남김
    const updatedCards = cards.filter(c => c.id !== id);
    
    // 상태 업데이트 & localStorage 저장
    setCards(updatedCards);
    localStorage.setItem('myCards', JSON.stringify(updatedCards));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        
        {/* 헤더: 뒤로가기 & 제목 */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-800 rounded-full transition-colors">
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-indigo-500" />
            결제 수단 관리
          </h1>
        </div>

        {/* 카드 추가 버튼 영역 */}
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="w-full py-5 mb-8 border-2 border-dashed border-stone-800 rounded-2xl text-stone-500 hover:border-indigo-500 hover:text-indigo-400 hover:bg-stone-900/50 flex justify-center items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" /> 새 카드 등록하기
          </button>
        ) : (
          <div className="bg-stone-900 p-6 rounded-2xl border border-stone-700 mb-8 animate-in fade-in slide-in-from-top-4 shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400"/> 카드 정보 입력
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-stone-500 ml-1 mb-1 block">카드 별칭</label>
                <input 
                  placeholder="예: 내 월급통장 카드" 
                  className="w-full bg-stone-950 border border-stone-700 p-3 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs text-stone-500 ml-1 mb-1 block">카드 번호</label>
                <input 
                  type="text"
                  placeholder="숫자만 입력하세요" 
                  maxLength={19}
                  className="w-full bg-stone-950 border border-stone-700 p-3 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors font-mono"
                  value={form.number}
                  onChange={e => setForm({...form, number: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs text-stone-500 ml-1 mb-1 block">유효기간</label>
                  <input 
                    placeholder="MM/YY" 
                    maxLength={5}
                    className="w-full bg-stone-950 border border-stone-700 p-3 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors text-center"
                    value={form.expiry}
                    onChange={e => setForm({...form, expiry: e.target.value})}
                  />
                </div>
                <div className="w-1/2">
                  <label className="text-xs text-stone-500 ml-1 mb-1 block">CVC</label>
                  <input 
                    placeholder="***" 
                    maxLength={3}
                    type="password"
                    className="w-full bg-stone-950 border border-stone-700 p-3 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors text-center"
                    value={form.cvc}
                    onChange={e => setForm({...form, cvc: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setIsAdding(false)} 
                className="px-5 py-2.5 text-stone-400 hover:text-white transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleAddCard} 
                className="px-6 py-2.5 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
              >
                등록완료
              </button>
            </div>
          </div>
        )}

        {/* 등록된 카드 리스트 */}
        <div className="space-y-4">
          {cards.length === 0 && !isAdding && (
            <div className="text-center py-20 bg-stone-900/30 rounded-2xl border border-stone-800/50">
              <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-stone-600" />
              </div>
              <p className="text-stone-500">등록된 카드가 없습니다.</p>
              <p className="text-sm text-stone-600 mt-1">새 카드를 등록하여 간편하게 결제하세요.</p>
            </div>
          )}
          
          {cards.map((card) => (
            <div key={card.id} className="relative bg-gradient-to-br from-stone-800 to-stone-900 p-6 rounded-2xl border border-stone-700 shadow-xl overflow-hidden group hover:border-indigo-500/30 transition-all">
              {/* 카드 배경 데코레이션 */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-indigo-500/20 rounded-md border border-indigo-500/30 flex items-center justify-center">
                    <div className="w-6 h-4 bg-indigo-400/20 rounded-sm"></div>
                  </div>
                  <div>
                    <span className="font-bold text-lg block leading-none">{card.cardName}</span>
                    <span className="text-xs text-stone-500">개인카드</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(card.id)}
                  className="text-stone-600 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                  title="카드 삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="relative z-10">
                <p className="font-mono text-xl md:text-2xl tracking-widest text-stone-300 mb-6 drop-shadow-md">
                  {card.cardNumber}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Valid Thru</p>
                    <p className="font-mono text-stone-300">{card.expiry}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs bg-black/20 px-3 py-1 rounded-full border border-white/5">
                    <ShieldCheck className="w-3 h-3 text-green-500" /> 
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}