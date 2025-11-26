import React, { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import { useAuthStore } from '../store/authStore';
import { loginSocialMedia } from '../services/authService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const SocialLogin: React.FC = () => {
  const { t } = useTranslation();
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setAuthCookie = (token: string, maxAgeSeconds?: number) => {
    if (maxAgeSeconds) {
      document.cookie = `auth_token=${token}; max-age=${maxAgeSeconds}; path=/`;
    } else {
      document.cookie = `auth_token=${token}; path=/`;
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError(t('google_login_failed') || 'មិនអាចទទួលបាន credential ពី Google');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginSocialMedia('google', credentialResponse.credential);

      if (response.success && response.data) {
        const user = {
          ...response.data.user,
          provider: 'google' as const
        };
        
        setToken(response.data.token, user);
        setAuthCookie(response.data.token, 7 * 24 * 60 * 60);
        
        console.log('Google login success:', user);
        navigate('/dashboard');
      } else {
        setError(response.message || t('login_failed') || 'មានបញ្ហាក្នុងការចូល');
      }
    } catch (err: any) {
      const errorMessage = err.message || t('google_login_error') || 'មានបញ្ហាក្នុងការចូលជាមួយ Google';
      setError(errorMessage);
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(t('google_login_failed') || 'Google login បរាជ័យ');
  };

  const handleFacebookResponse = async (response: any) => {
    if (!response.accessToken) {
      setError(t('facebook_login_failed') || 'មានបញ្ហាក្នុងការចូលជាមួយ Facebook');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiResponse = await loginSocialMedia('facebook', response.accessToken);

      if (apiResponse.success && apiResponse.data) {
        const user = {
          ...apiResponse.data.user,
          provider: 'facebook' as const
        };
        
        setToken(apiResponse.data.token, user);
        setAuthCookie(apiResponse.data.token, 7 * 24 * 60 * 60);
        
        console.log('Facebook login success:', user);
        navigate('/dashboard');
      } else {
        setError(apiResponse.message || t('login_failed') || 'មានបញ្ហាក្នុងការចូល');
      }
    } catch (err: any) {
      const errorMessage = err.message || t('facebook_login_error') || 'មានបញ្ហាក្នុងការចូលជាមួយ Facebook';
      setError(errorMessage);
      console.error('Facebook login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      {error && (
        <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded">
          {t('loading') || 'កំពុងដំណើរការ...'}
        </div>
      )}

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-primary/5 text-gray-500">
            {t('or_continue_with') || 'ឬបន្តជាមួយ'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%"
        />

        <FacebookLogin
          appId={import.meta.env.VITE_FACEBOOK_APP_ID!}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          cssClass="facebook-login-button"
          textButton={t('sign_in_with_facebook') || 'ចូលជាមួយ Facebook'}
          icon="fa-facebook"
        />
      </div>
    </div>
  );
};

export default SocialLogin;