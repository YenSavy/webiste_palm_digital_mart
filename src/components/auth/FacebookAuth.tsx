import FacebookLogin, {
    type FailResponse,
    type ProfileSuccessResponse,
    type SuccessResponse
} from '@greatsumini/react-facebook-login';
import { useAuthStore } from '../../store/authStore';
import { useSocialLoginMutation } from '../../lib/mutations';
import type { Dispatch, FC, SetStateAction } from 'react';


type Props = {
    setMessage: Dispatch<SetStateAction<string | null>>
    setIsError: Dispatch<SetStateAction<boolean>>
}


const FacebookAuth: FC<Props> = ({setMessage, setIsError})  => {
    const { setUser, setToken } = useAuthStore()
    const { mutate: socialLogin, isPending } = useSocialLoginMutation()
    // const handleSuccess = (response: SuccessResponse) => {
    //     return socialLogin({
    //         social_type: "facebook",
    //         token: response?.accessToken
    //     }, {
    //         onError: (err) => {
    //             console.log(err)
    //         },
    //         onSuccess: (data) => {
    //             console.log(data)
    //             setToken(response?.accessToken)
    //         }
    //     })
    // };

     const handleSuccess = (response: SuccessResponse) => {
        if (response?.accessToken) {
            return socialLogin(
                {
                    social_type: 'facebook',
                    token: response.accessToken
                },
                {
                    onError: (err) => {
                        setIsError(true)
                        setMessage(err.message)
                    },
                    onSuccess: (data) => {
                        setIsError(false)
                        setMessage(data.message)
                        setToken(response.accessToken);
                    }
                }
            );
        }
    };

    const handleProfileSuccess = (response: ProfileSuccessResponse) => {
        setUser({
            email: response.email as string,
            full_name: response.name as string,
            name: response.name as string,
            phone: "",
            avatar_image: response.picture?.data.url
        })
    };
    const handleError = (error: FailResponse) => {
        console.log('Login Failed:', error);
    };


    return (
        <>
            <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                onSuccess={handleSuccess}
                onFail={handleError}
                onProfileSuccess={handleProfileSuccess}
                fields="name,picture"
                scope="public_profile"
                render={({ onClick }) => (
                    <button
                        onClick={onClick}
                        type='button'
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-sm transition duration-200 flex items-center justify-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>{isPending ? "Logging in" : "Continue with Facebook"}</span>
                    </button>
                )}
            />
        </>
    )
}

export default FacebookAuth