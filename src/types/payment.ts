// src/types/payment.ts

export interface MyCard {
  id: string;          // 고유 ID (UUID)
  cardName: string;    // 카드 별칭 (예: 내 월급통장)
  cardNumber: string;  // 카드 번호 (마스킹 된 번호)
  expiry: string;      // 유효기간 (MM/YY)
  cvc: string;         // CVC 번호
}