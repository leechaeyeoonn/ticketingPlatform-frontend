import { useState, useEffect } from 'react';
import type { Product } from '../types/product';

// 장바구니에 담긴 상품은 기존 상품 정보에 '수량(quantity)'이 추가됩니다.
export interface CartItem extends Product {
  quantity: number;
}

export const useCart = () => {
  // 1. 로컬 스토리지에서 기존 장바구니 데이터를 가져와 초기값 설정
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. 장바구니 데이터가 변할 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. 상품 추가 로직
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      // 이미 장바구니에 있는지 확인
      const isExist = prev.find((item) => item.id === product.id);

      if (isExist) {
        // 이미 있다면 수량만 +1
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      // 없다면 새로 추가 (수량 1개)
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 4. 장바구니에서 삭제
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 5. 장바구니 비우기
  const clearCart = () => setCartItems([]);

  return { cartItems, addToCart, removeFromCart, clearCart };
};
