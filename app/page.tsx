"use client";

import { useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"; // 引入 react-hook-form
import { Button } from "@/components/ui/button";  
import WelcomePage from "@/components/form/page1";
import TeamSizePage from "@/components/form/page2";
import TeamMembersPage from "@/components/form/page3";

export type TeamMember = {
  isRepresentative: boolean; // 布林值: 是, 否（只能有一個為是）
  name: string; // 姓名
  gender: '男' | '女' | '其他'; // 性別選擇
  school: string; // 學校
  grade: '一' | '二' | '三'; // 高幾（包含大專）
  identityNumber: string; // 身份字號
  birthday: string; // 生日（可使用日曆選單或格式輸入）
  email: string; // email（包含格式檢查）
  phone: string; // 手機（10碼）
  allergies: string; // 過敏原 / 素食選擇
  specialDiseases: string; // 特殊疾病
  remarks: string; // 備註
};

export type EmergencyContact = {
  name: string; // 姓名
  relationship: string; // 關係
  phone: string; // 電話
};

export type AccompanyingPerson = {
  name: string; // 姓名
  email: string; // Email
  phone: string; // 電話
};

export type FormData = {
  teamName: string; // 團隊名稱（2~30個字元，超出系統自動裁切）
  source: string; // 消息來源
  teamMembers: TeamMember[]; // 參賽團隊成員資料（陣列）
  emergencyContacts: EmergencyContact[]; // 緊急聯絡人（最少1個，可+/-）
  mediaAuthorization: boolean; // 媒體授權
  copyrightAgreement: boolean; // 無侵權切結書
  parentalConsent: boolean; // 家長同意書
  accompanyingPersons: AccompanyingPerson[]; // 陪伴人（最多2個）
  exhibitors: string[]; // 參展人（系統自動帶入陪伴人，但不歸類於參展人，無限制）
};

const StepForm: React.FC = () => {
  const [step, setStep] = useState(1);
  // 初始化 react-hook-form
  const methods = useForm<FormData>({
    defaultValues: {
      teamName: "", 
      source: "", 
      teamMembers: [], 
      emergencyContacts: [], 
      mediaAuthorization: false,
      copyrightAgreement: false,
      parentalConsent: false,
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
          {step === 2 && (
            <TeamSizePage
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 3 && (
            <TeamMembersPage
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 4 && (
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
