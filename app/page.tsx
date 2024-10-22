"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod"; // 引入 zod
import { zodResolver } from "@hookform/resolvers/zod"; // 用來解決 zod 與 react-hook-form 之間的整合
import { Button } from "@/components/ui/button";
import WelcomePage from "@/components/form/page1";
import TeamSizePage from "@/components/form/page2";
import TeamMembersPage from "@/components/form/page3";
import AccompanyingPersonsPage from "@/components/form/page4";
import ExhibitorsPage from "@/components/form/page5";

export const emergencyContactSchema = z.object({
  name: z.string().min(1, "緊急聯絡人姓名必填"),
  relationship: z.string().min(1, "關係必填"),
  phone: z
    .string()
    .length(10, "電話號碼必須為 10 碼")
    .refine((val) => val.startsWith("09"), "電話號碼必須以 09 開頭"),
});

export const accompanyingPersonSchema = z.object({
  name: z.string().min(1, "姓名必填"),
  email: z.string().email("Email 格式不正確"),
  phone: z
    .string()
    .length(10, "電話號碼必須為 10 碼")
    .refine((val) => val.startsWith("09"), "電話號碼必須以 09 開頭"),
});

export const teamMemberSchema = z.object({
  isRepresentative: z.boolean(),
  name: z.string().min(1, "姓名必填"),
  gender: z.enum(["男", "女", "其他"]),
  school: z.string().min(1, "學校必填"),
  grade: z.enum(["一", "二", "三"]),
  identityNumber: z.string().length(10, "身份字號必須為 10 碼"),
  birthday: z.string().min(1, "生日必填"),
  email: z.string().email("Email 格式不正確"),
  phone: z
    .string()
    .length(10, "手機號碼必須為 10 碼")
    .refine((val) => val.startsWith("09"), "手機號碼必須以 09 開頭"),
  emergencyContacts: z
    .array(emergencyContactSchema)
    .min(1, "至少需要一位緊急聯絡人"),
  allergies: z.string().optional(),
  specialDiseases: z.string().optional(),
  remarks: z.string().optional(),
});

export const exhibitorSchema = z.object({
  name: z.string().min(1, "姓名必填"),
  email: z.string()
    .min(1, "Email 必填")
    .email("Email 格式不正確"), // 確保 email 格式正確
});

export const formSchema = z.object({
  teamName: z
    .string()
    .min(2, "團隊名稱至少 2 個字")
    .max(30, "團隊名稱最多 30 個字"),
  teamMembers: z.array(teamMemberSchema).min(1, "至少需要一位團隊成員"),
  accompanyingPersons: z
    .array(accompanyingPersonSchema)
    .max(2, "最多 2 位陪伴人"),
  exhibitors: z
    .array(exhibitorSchema) // 使用 exhibitorSchema 限制參展人的結構
    .optional(),
});

// 使用 zod 的驗證類型
export type FormData = z.infer<typeof formSchema>;

const StepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema), // 使用 zod 驗證
    defaultValues: {
      teamName: "",
      teamMembers: [],
      accompanyingPersons: [],
      exhibitors: [],
    },
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data); // 最終提交表單數據
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="min-h-screen flex flex-col justify-center items-center bg-gray-100"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
          {step === 1 && <WelcomePage onNext={nextStep} />}
          {step === 2 && <TeamSizePage onNext={nextStep} onPrev={prevStep} />}
          {step === 3 && <TeamMembersPage onNext={nextStep} onPrev={prevStep} />}
          {step === 4 && <AccompanyingPersonsPage onNext={nextStep} onPrev={prevStep} />} {/* 新增這一行 */}
          {step === 5 && <ExhibitorsPage onNext={nextStep} onPrev={prevStep} />} {/* 新增這一行 */}
          {step === 6 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">表單提交完成</h2>
              <Button type="submit" className="w-full">
                提交表單
              </Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default StepForm;
