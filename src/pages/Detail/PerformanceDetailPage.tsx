import { useParams } from 'react-router-dom';

export default function PerformanceDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">공연 상세 페이지</h1>
      <p className="mt-2">공연 ID: {id}</p>
    </div>
  );
}
