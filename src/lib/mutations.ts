import { useMutation } from "@tanstack/react-query"
import { login, signUp, type SignInData, type SignUpData } from "./apis/auth/authApi"
import { createBranch, createCurrency, createPosition, createWarehouse, saveCompanyInfo, type TCreateBranchInput, type TCreateCurrencyInput, type TCreatePositionInput, type TCreateWarehouseInput } from "./apis/dashboard/companyApi"

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



export const useCreateBranchMutation = () => {
    return useMutation({
        mutationKey: ["create", "company", "branch"],
        mutationFn: (payload: TCreateBranchInput) => createBranch(payload)
    })
}
export const useCreateWarehouseMutation = () => {
    return useMutation({
        mutationKey: ["create", "company", "warehouse"],
        mutationFn: (payload: TCreateWarehouseInput) => createWarehouse(payload)
    })
}
export const useCreatePositionMutation = () => {
    return useMutation({
        mutationKey: ["create", "company", "position"],
        mutationFn: (payload: TCreatePositionInput) => createPosition(payload)
    })
}
export const useCreateCurrencyMutation = () => {
    return useMutation({
        mutationKey: ["create", "company", "currency"],
        mutationFn: (payload: TCreateCurrencyInput) => createCurrency(payload)
    })  
}