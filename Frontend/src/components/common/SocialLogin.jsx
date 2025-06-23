import { useGoogleLogin } from '@react-oauth/google';

const SocialLogin = ({ onLogin }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const accessToken = tokenResponse.access_token;
      try {
        const res = await fetch('/api/auth/social/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'google', access_token: accessToken })
        });
        const data = await res.json();
        if (res.ok && data.access && data.refresh) {
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          if (onLogin) onLogin(data.access);
        }
      } catch (err) {
        // handle error (optional)
      }
    },
    flow: 'implicit',
    scope: 'openid email profile https://www.googleapis.com/auth/userinfo.email'
  });

  return (
    <div className="social-login" style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
      <button className="social-button" style={{ display: 'flex', alignItems: 'center', gap: '0.81rem', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', padding: '0.75rem 2rem', borderRadius: '0.31rem', background: '#F9F8FF', border: '1px solid #D5CBFF' }}
        onClick={() => login()}>
        <img src="google.svg" alt="Google" className="social-icon" style={{ width: 24, height: 24 }} />
        Google
      </button>
    </div>
  );
};

export default SocialLogin;