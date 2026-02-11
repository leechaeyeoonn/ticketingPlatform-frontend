// src/components/auth/AuthModalManager.tsx
import Modal from '@/components/common/Modal';
import FindPasswordForm from '@/pages/Auth/components/FindPasswordForm';
import SignupForm from '@/pages/Auth/components/SignupForm';
import UserProfile from '@/components/common/UserProfile';

// ✅ 핵심: 모달 타입에 따른 "제목"과 "컴포넌트"를 딕셔너리(객체)로 정리
// 나중에 모달이 추가되면 여기만 한 줄 추가하면 끝입니다! (LoginPage 수정 X)
const MODAL_REGISTRY = {
  FIND_PW: {
    title: '비밀번호 찾기',
    component: <FindPasswordForm />,
  },
  SIGNUP: {
    title: '회원가입',
    component: <SignupForm />,
  },
  PROFILE: {
    title: '내 프로필',
    component: <UserProfile />,
  },
} as const; // as const로 타입 추론 강화

type ModalType = keyof typeof MODAL_REGISTRY;

interface AuthModalManagerProps {
  modalType: ModalType | null;
  onClose: () => void;
}

export default function AuthModalManager({ modalType, onClose }: AuthModalManagerProps) {
  // 선택된 모달 타입이 없으면 아무것도 안 그림
  if (!modalType) return null;

  const { title, component } = MODAL_REGISTRY[modalType];

  return (
    <Modal isOpen={!!modalType} onClose={onClose} title={title}>
      {component}
    </Modal>
  );
}
