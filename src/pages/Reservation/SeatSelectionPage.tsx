import { useParams } from 'react-router-dom';

export default function SeatSelectionPage() {
  const { scheduleId } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">좌석 선택 페이지</h1>
      <p className="mt-2">일정 ID: {scheduleId}</p>
    </div>
  );
}
