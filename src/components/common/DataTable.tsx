import React from 'react';

// 1. 컬럼 하나하나가 어떻게 생겼는지 정의하는 설계도 타입
export interface Column<T> {
  header: string; // 표 상단 제목 (예: '상품명')
  key: keyof T | 'actions'; // 데이터의 키 (예: 'name', 'price') 또는 버튼용 'actions'
  render?: (value: any, item: T) => React.ReactNode; // 데이터를 특별하게 보여주고 싶을 때 쓰는 함수
}

// 2. DataTable이 부모로부터 받을 데이터들
interface DataTableProps<T> {
  columns: Column<T>[]; // 위에서 만든 설계도 리스트
  data: T[]; // 실제 뿌려줄 데이터 배열 (products 등)
}

// T extends { id?: any }는 "데이터에 id가 있을 수도 있다"는 뜻의 제네릭입니다.
const DataTable = <T extends { id?: any }>({ columns, data }: DataTableProps<T>) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        {/* 테이블 헤더 (설계도대로 제목을 뿌림) */}
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-semibold text-gray-700">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* 테이블 본문 (데이터를 한 줄씩 뿌림) */}
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={item.id || rowIndex} className="hover:bg-gray-50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {/* ⭐️ 여기가 핵심! render 함수가 있으면 그걸 쓰고, 없으면 그냥 글자를 찍음 */}
                    {col.render
                      ? col.render(item[col.key as keyof T], item)
                      : (item[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-20 text-center text-gray-500">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
