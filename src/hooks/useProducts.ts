import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Product } from '../types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 목록 가져오기
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/admin/productList');
      setProducts(res.data);
    } catch (err) {
      console.error('불러오기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. 등록
  const addProduct = async (data: Omit<Product, 'id' | 'createdAt'>) => {
    const res = await axios.post('/api/admin/productList', data);
    setProducts((prev) => [...prev, res.data]);
    return res.data;
  };

  // 3. 수정
  const updateProduct = async (data: Product) => {
    if (!data.id) return;
    const res = await axios.patch(`/api/admin/productList/${data.id}`, data);
    setProducts((prev) => prev.map((p) => (p.id === data.id ? res.data : p)));
    return res.data;
  };

  // 4. 삭제
  const deleteProduct = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await axios.delete(`/api/admin/productList/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // 외부에서 쓸 수 있게 내보내기
  return { products, isLoading, addProduct, updateProduct, deleteProduct };
};
