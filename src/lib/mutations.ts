import { useMutation } from "@tanstack/react-query"
import { login, signUp, type SignInData, type SignUpData } from "./apis/auth/authApi"

export const useSignUp = () => {
    return useMutation({
        mutationKey: ["register", "user", "users"],
        mutationFn: (formData: SignUpData) => signUp(formData)
    })

}
export const useLogin = () => {
    return useMutation({
            mutationKey: ["login", "user", "users"],
            mutationFn: (formData: SignInData) => login(formData)
    })
}