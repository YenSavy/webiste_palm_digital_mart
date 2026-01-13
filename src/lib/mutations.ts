import { useMutation } from "@tanstack/react-query";
import {
  login,
  signUp,
  socialLogin,
  type SignInData,
  type SignUpData,
  type TSocialLoginInput,
} from "./apis/auth/authApi";
import {
  createBranch,
  createCurrency,
  createPosition,
  createWarehouse,
  saveCompanyInfo,
  subscribePlan,
  unsubscribePlan,
  type TCreateBranchInput,
  type TCreateCurrencyInput,
  type TCreatePositionInput,
  type TCreateWarehouseInput,
  type TPlanSubscriptionInput,
} from "./apis/dashboard/companyApi";
import {
  createUser,
  createUserProfile,
  deleteUser,
  deleteUserProfile,
  type TCreateUserInput,
  type TCreateUserProfileInput,
} from "./apis/dashboard/userApi";

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["register", "user", "users"],
    mutationFn: (formData: SignUpData) => signUp(formData),
  });
};
export const useLogin = () => {
  return useMutation({
    mutationKey: ["login", "user", "users"],
    mutationFn: (formData: SignInData) => login(formData),
  });
};


export const useSocialLoginMutation = () => {
  return useMutation({
    mutationKey: ["login", "user", "users"],
    mutationFn: (payload: TSocialLoginInput) => socialLogin(payload)
  })
}


export const useCreateCompanyMutation = () => {
  return useMutation({
    mutationKey: ["create", "company", "companies"],
    mutationFn: ({
      company_name_en,
      village,
    }: {
      company_name_en: string;
      village: string;
    }) => saveCompanyInfo(company_name_en, village),
  });
};

export const useCreateBranchMutation = () => {
  return useMutation({
    mutationKey: ["create", "company", "branch"],
    mutationFn: (payload: TCreateBranchInput) => createBranch(payload),
  });
};
export const useCreateWarehouseMutation = () => {
  return useMutation({
    mutationKey: ["create", "company", "warehouse"],
    mutationFn: (payload: TCreateWarehouseInput) => createWarehouse(payload),
  });
};
export const useCreatePositionMutation = () => {
  return useMutation({
    mutationKey: ["create", "company", "position"],
    mutationFn: (payload: TCreatePositionInput) => createPosition(payload),
  });
};
export const useCreateCurrencyMutation = () => {
  return useMutation({
    mutationKey: ["create", "company", "currency"],
    mutationFn: (payload: TCreateCurrencyInput) => createCurrency(payload),
  });
};
//subscription

export const useSubscribePlanMutation = () => {
  return useMutation({
    mutationKey: ["company"],
    mutationFn: (payload: TPlanSubscriptionInput) => subscribePlan(payload),
  });
};
export const useUnsubscribePlanMutation = () => {
  return useMutation({
    mutationKey: ["company"],
    mutationFn: (payload: TPlanSubscriptionInput) => unsubscribePlan(payload),
  });
};



//user page -dashboard

export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: ["company", "user", "system-user"],
    mutationFn: (payload: TCreateUserInput) => createUser(payload),
  });
};

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: ["company", "user", "system-user"],
    mutationFn: (id: string) => deleteUser(id),
  });
};

export const useCreateUserProfileMutation = () => {
  return useMutation({
    mutationKey: ["company", "user", "system-user", "profile-user"],
    mutationFn: (payload: TCreateUserProfileInput) =>
      createUserProfile(payload),
  });
};

export const useDeleteUserProfileMutation = () => {
  return useMutation({
    mutationKey: ["company", "user", "system-user", "profile-user"],
    mutationFn: (id: string) => deleteUserProfile(id),
  });
};
