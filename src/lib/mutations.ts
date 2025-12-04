import { useMutation } from "@tanstack/react-query"
import { login, signUp, type SignInData, type SignUpData } from "./apis/auth/authApi"
import { saveCompanyInfo } from "./apis/dashboard/companyApi"

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

export const useCreateCompanyMutation = () => {
    return useMutation({
        mutationKey: ["create", "company", "companies"],
        mutationFn: ({ company_name_en, village }: { company_name_en: string; village: string }) => saveCompanyInfo(company_name_en, village)
    })
}