import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';

interface DecodedToken {
    name: string;
    email: string;
    picture: string;
    sub: string;
    iss?: string;
    aud?: string;
    exp?: number;
    iat?: number;
}



function GoogleAuthComponent() {

    const { isAuthenticated, setToken, setUser } = useAuthStore()

    const decodeJWT = (token: string): DecodedToken | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as DecodedToken;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const handleSuccess = (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            console.error('No credential in response');
            return;
        }
        const token = credentialResponse.credential
        setToken(token)

        const decoded = decodeJWT(credentialResponse.credential);
        if (decoded) {

            setUser({
                name: decoded.name,
                email: decoded.email,
                avatar_image: decoded.picture,
                full_name: decoded.name,
                phone: "",
            })
        }
    };

    const handleError = () => {
        console.log('Login Failed');
        alert('Google login failed. Please try again.');
    };



    return (
        <div>


            {!isAuthenticated && (
                <div className="">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                    />
                </div>
            )}
        </div>
    );
}

export default function GoogleAuth() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
            <GoogleAuthComponent />
        </GoogleOAuthProvider>
    );
}