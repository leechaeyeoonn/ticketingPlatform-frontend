# Toy Ticket — 공연 티켓 예매 플랫폼

React + TypeScript + Zustand로 구현한 공연 티켓 예매 플랫폼입니다.

공연 탐색 → 일정 선택 → 좌석 선택 → 결제로 이어지는 단계별 예매 플로우와,
구매한 티켓을 2차 거래할 수 있는 티켓 마켓 기능을 포함합니다.

---

##  주요 기능

###  메인 페이지
- 공연 목록 카드 그리드 (카테고리별 탭 필터링 + 실시간 키워드 검색)
- 검색 결과 없음 상태 처리 (Empty State UI)
- 로딩 스피너 및 에러 상태 처리

###  단계별 예매 플로우
- **Step 1** 일정(날짜/시간) 선택
- **Step 2** 좌석 선택 — 다중 선택 지원, 최대 4매 제한, 이미 예약된 좌석 클릭 방지
- **Step 3** 결제 및 예매 확정

###  인증 
- JWT 기반 로그인 / 로그아웃
- `AuthGuard` — 비인증 사용자 접근 차단 및 로그인 후 원래 경로 복귀
- `PublicOnlyRoute` — 로그인 상태에서 로그인 페이지 접근 방지
- Zustand `persist` 미들웨어로 새로고침 후에도 로그인 상태 유지 (sessionStorage)
- 회원 등급 시스템 (BRONZE / SILVER / GOLD / VIP)

### 티켓 마켓 (2차 거래)
- 내 티켓 기반 판매 등록
- 판매중 / 거래중 / 판매완료 상태 관리
- 키워드 + 가격 범위 + 판매중 필터 동시 적용

### 공통 컴포넌트
- `Modal` — `createPortal` 기반, ESC 키 닫기, 배경 클릭 닫기
- `Toast` — success / error / info 타입, 3초 자동 소멸
- `CategoryTabs` — 카테고리 탭 + 검색창 통합

---

##  기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| 상태 관리 | Zustand (persist 미들웨어) |
| 라우팅 | React Router v7 |
| 스타일 | Tailwind CSS, 다크모드 지원 |
| HTTP | Axios (인터셉터, 401 자동 처리) |
| API Mocking | MSW v2 |
| 빌드 | Vite |

---

## 📁 폴더 구조

```
src/
├── api/           # axios 인스턴스 및 도메인별 API 함수
├── auth/          # AuthGuard, 토큰 유틸
├── components/
│   ├── common/    # Modal, Toast, CategoryTabs 등 공통 컴포넌트
│   └── ticket/    # 공연 카드, 결제 타이머 등 도메인 컴포넌트
├── hooks/         # useReservation, useToast, useAuth, useTimer
├── mocks/         # MSW 핸들러 및 더미 데이터
├── pages/         # 페이지 컴포넌트 (도메인별 폴더 분리)
├── routes/        # 라우터 설정
├── store/         # Zustand 스토어 (auth / reservation / market / myTicket / toast)
└── types/         # TypeScript 타입 정의
```

---

##  실행 방법

```bash
# Node.js 18 이상 필요
corepack enable
yarn install
yarn dev
```

> MSW가 활성화되어 있어 별도 백엔드 없이 실행 가능합니다.
