import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h1>회원가입</h1>

      <div style={{ marginTop: 16 }}>
        <input placeholder="이름" />
      </div>

      <div style={{ marginTop: 8 }}>
        <input placeholder="이메일" />
      </div>

      <div style={{ marginTop: 8 }}>
        <input type="password" placeholder="비밀번호" />
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => {
            alert('회원가입 완료(임시)');
            navigate('/login');
          }}
        >
          가입하기
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate('/login')}>로그인으로 돌아가기</button>
      </div>
    </div>
  );
}
