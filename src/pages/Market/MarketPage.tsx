import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ShoppingCart,
  Tag,
  Ticket as TicketIcon,
  DollarSign,
  Check,
} from 'lucide-react';
import { useMarketStore } from '@/store/useMarketStore';
import { useMyTicketStore } from '@/store/useMyTicketStore';
import { useAuthStore } from '@/store/useAuthStore';
import Modal from '@/components/common/Modal'; // ✅ 기존 Modal 컴포넌트 재사용

export default function MarketPage() {
  // 1. Store 상태 가져오기
  const {
    listings,
    filters,
    isLoading,
    error,
    fetchListings,
    setFilter,
    purchaseTicket,
    registerItem,
  } = useMarketStore();

  const { myTickets, loadMyData } = useMyTicketStore();
  const { user, isAuthenticated } = useAuthStore();

  // 2. 모달 및 폼 상태 관리 (별도 파일 대신 여기서 관리)
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [resalePrice, setResalePrice] = useState<string>('');

  // 3. 데이터 로드
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // 4. 필터링 로직
  const filteredListings = listings.filter((item) => {
    const matchesKeyword =
      item.performanceTitle.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      item.seatInfo.toLowerCase().includes(filters.keyword.toLowerCase());
    const matchesPrice =
      item.resalePrice >= filters.minPrice && item.resalePrice <= filters.maxPrice;
    const matchesAvailability = filters.onlyAvailable ? item.status === 'AVAILABLE' : true;

    return matchesKeyword && matchesPrice && matchesAvailability;
  });

  // 5. 핸들러: 판매 버튼 클릭
  const handleSellClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    loadMyData(); // 내 티켓 정보 최신화
    setIsSellModalOpen(true);
    setSelectedTicketId(null);
    setResalePrice('');
  };

  // 6. 핸들러: 판매 등록 제출
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !resalePrice) return;

    const ticket = myTickets.find((t) => t.reservationId === selectedTicketId);
    if (!ticket) return;

    await registerItem({
      originalPrice: ticket.price,
      resalePrice: parseInt(resalePrice, 10),
      performanceTitle: ticket.title,
      seatInfo: `${ticket.grade}석 ${ticket.seat}번`,
      sellerId: user?.id || 999,
      date: ticket.date,
    });

    setIsSellModalOpen(false);
    alert('판매 등록이 완료되었습니다!');
  };

  // 7. 핸들러: 구매 버튼 클릭
  const handlePurchase = async (id: number) => {
    if (!isAuthenticated) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }
    if (window.confirm('정말 이 티켓을 구매하시겠습니까?')) {
      await purchaseTicket(id);
      alert('구매 요청이 완료되었습니다!');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* --- 헤더 영역 --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingCart className="text-indigo-500" /> 티켓 마켓
            </h1>
            <p className="text-stone-400 mt-2">안전하고 빠른 티켓 양도 거래</p>
          </div>
          <button
            onClick={handleSellClick}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-bold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> 티켓 판매하기
          </button>
        </div>

        {/* --- 필터 영역 --- */}
        <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
              <input
                type="text"
                placeholder="공연명, 좌석 정보 검색"
                value={filters.keyword}
                onChange={(e) => setFilter('keyword', e.target.value)}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="최소 가격"
                value={filters.minPrice || ''}
                onChange={(e) => setFilter('minPrice', Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <span className="text-stone-600">~</span>
              <input
                type="number"
                placeholder="최대 가격"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={filters.onlyAvailable}
                  onChange={(e) => setFilter('onlyAvailable', e.target.checked)}
                  className="w-5 h-5 rounded border-stone-700 bg-stone-900 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-stone-300">판매중만 보기</span>
              </label>
            </div>
          </div>
        </div>

        {/* --- 리스트 영역 --- */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-stone-500">티켓 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400 bg-red-900/10 rounded-2xl border border-red-900/20">
            {error}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/30 rounded-2xl border border-stone-800/50 border-dashed">
            <Filter className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <p className="text-stone-500 text-lg">조건에 맞는 티켓이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className={`bg-stone-900 rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${
                  item.status === 'AVAILABLE'
                    ? 'border-stone-800 hover:border-indigo-500/50'
                    : 'border-stone-800 opacity-60 grayscale-[0.5]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold ${
                      item.status === 'AVAILABLE'
                        ? 'bg-green-500/20 text-green-400'
                        : item.status === 'RESERVED'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-stone-700 text-stone-400'
                    }`}
                  >
                    {item.status === 'AVAILABLE'
                      ? '판매중'
                      : item.status === 'RESERVED'
                        ? '거래중'
                        : '판매완료'}
                  </span>
                  <span className="text-xs text-stone-500">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 truncate">{item.performanceTitle}</h3>
                <div className="flex items-center gap-2 text-stone-400 text-sm mb-6">
                  <Tag className="w-4 h-4" />
                  <span>{item.seatInfo}</span>
                </div>
                <div className="flex justify-between items-end border-t border-stone-800 pt-4">
                  <div>
                    <p className="text-xs text-stone-500 line-through">
                      {item.originalPrice.toLocaleString()}원
                    </p>
                    <p className="text-lg font-bold text-indigo-400">
                      {item.resalePrice.toLocaleString()}원
                    </p>
                  </div>
                  {item.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handlePurchase(item.id)}
                      className="px-4 py-2 bg-stone-800 hover:bg-indigo-600 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                      구매하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal 컴포넌트 직접 사용 (SellModal.tsx 생성 안 함) */}
      <Modal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        title="티켓 판매 등록"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          {/* 티켓 선택 */}
          <div>
            <label className="block text-sm font-medium text-stone-400 mb-2">
              판매할 티켓 선택
            </label>
            {myTickets.length === 0 ? (
              <div className="text-center p-4 bg-stone-800 rounded-lg text-stone-500 text-sm">
                판매 가능한 티켓이 없습니다.
              </div>
            ) : (
              <div className="grid gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {myTickets.map((ticket) => (
                  <div
                    key={ticket.reservationId}
                    onClick={() => setSelectedTicketId(ticket.reservationId)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      selectedTicketId === ticket.reservationId
                        ? 'bg-indigo-900/30 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-stone-800 border-stone-700 hover:bg-stone-750'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-stone-900 rounded-full">
                        <TicketIcon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{ticket.title}</p>
                        <p className="text-xs text-stone-400">
                          {ticket.date} | {ticket.grade}석 {ticket.seat}번
                        </p>
                      </div>
                    </div>
                    {selectedTicketId === ticket.reservationId && (
                      <Check className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 가격 입력 */}
          <div>
            <label className="block text-sm font-medium text-stone-400 mb-2">판매 희망 가격</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-stone-500" />
              </div>
              <input
                type="number"
                required
                min="0"
                value={resalePrice}
                onChange={(e) => setResalePrice(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 bg-stone-950 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="0"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-stone-500 sm:text-sm">원</span>
              </div>
            </div>
            {selectedTicketId && (
              <p className="mt-2 text-xs text-stone-500 text-right">
                정가:{' '}
                {myTickets
                  .find((t) => t.reservationId === selectedTicketId)
                  ?.price.toLocaleString()}
                원
              </p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 justify-end pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setIsSellModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!selectedTicketId || !resalePrice}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              판매 등록하기
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
