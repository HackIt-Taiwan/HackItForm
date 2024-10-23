"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod"; // 引入 zod
import { zodResolver } from "@hookform/resolvers/zod"; // 用來解決 zod 與 react-hook-form 之間的整合
import { Button } from "@/components/ui/button";
import WelcomePage from "@/components/form/page1";
import TeamSizePageForUpdate from "@/components/form/page2-update";
import TeamMembersPage from "@/components/form/page3";
import AccompanyingPersonsPage from "@/components/form/page4";
import ExhibitorsPage from "@/components/form/page5";
import { API_END_POINT } from "@/lib/variable";
import { useParams } from "next/navigation"; // 使用 useRouter 來取得 [id]
import { ClipLoader } from "react-spinners"; // 引入 react-spinners

// Zod schema 定義
 const emergencyContactSchema = z.object({
  name: z.string().min(1, "緊急聯絡人姓名必填"),
  relationship: z.string().min(1, "關係必填"),
  phone: z
    .string()
    .length(10, "電話號碼必須為 10 碼")
    .refine((val) => val.startsWith("09"), "電話號碼必須以 09 開頭"),
});

 const accompanyingPersonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "姓名必填"),
  email: z.string().email("Email 格式不正確"),
  phone: z
    .string()
    .length(10, "電話號碼必須為 10 碼")
    .refine((val) => val.startsWith("09"), "電話號碼必須以 09 開頭"),
});

 const teamMemberSchema = z.object({
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
  tShirtSize: z.enum(["S", "M", "L", "XL", "2L", "3L", "4L"]),
});

 const exhibitorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "姓名必填"),
  email: z.string().min(1, "Email 必填").email("Email 格式不正確"), // 確保 email 格式正確
});

 const formSchema = z.object({
  teamName: z
    .string()
    .min(2, "團隊名稱至少 2 個字")
    .max(30, "團隊名稱最多 30 個字"),
  teamSize: z.string().min(1, "請選擇參賽團隊人數"),
  teamMembers: z.array(teamMemberSchema).min(1, "至少需要一位團隊成員"),
  accompanyingPersons: z
    .array(accompanyingPersonSchema)
    .max(2, "最多 2 位陪伴人"),
  exhibitors: z
    .array(exhibitorSchema) // 使用 exhibitorSchema 限制參展人的結構
    .max(50, "最多 50 位參展人"),
});

// 使用 zod 的驗證類型
const StepForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false); // 控制提交成功提示
  const [submitError, setSubmitError] = useState(false); // 控制提交錯誤提示
  const [showButtons, setShowButtons] = useState(true); // 控制按鈕的顯示

  const params = useParams();

  const methods = useForm({
    resolver: zodResolver(formSchema), // 使用 zod 驗證
    defaultValues: {
      teamName: "",
      teamMembers: [],
      accompanyingPersons: [],
      exhibitors: [],
    },
  });

  useEffect(() => {
    const fetchFormData = async () => {
      if (params.secret) {
        try {
          const response = await fetch(
            `${API_END_POINT}users/team/edit/${params.secret}`
          );
          if (!response.ok) {
            setNotFound(true);
            return;
          }

          const data = await response.json();
          // 根據取得的資料更新表單的預設值
          methods.reset(data);
          methods.setValue("teamSize", String(data.teamMembers.length)); // 將選擇的團隊人數設置到表單中
          if (!data.accompanyingPersons) {
            methods.setValue("accompanyingPersons", []);
          }
          if (!data.exhibitors) {
            methods.setValue("exhibitors", []);
          }
        } catch (error) {
          console.error("Error fetching form data:", error);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [params.secret, methods]);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true); // 開始loading
    setSubmitSuccess(false); // 清除之前的成功提示
    setSubmitError(false); // 清除之前的錯誤提示
    setShowButtons(false); // 提交後隱藏按鈕

    try {
      const response = await fetch(
        API_END_POINT + `users/team/update/${params.secret}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("成功提交數據:", responseData);
      setSubmitSuccess(true); // 提交成功，顯示成功消息
    } catch (error) {
      console.error("提交失敗:", error);
      setSubmitError(true); // 出現錯誤，顯示錯誤消息
      setShowButtons(true); // 如果出現錯誤，顯示按鈕
    } finally {
      setLoading(false); // 結束loading
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" loading={loading} size={50} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">無效的請求</h1>
          <p className="text-lg">
            我們找不到您要的表單，請確認您的連結是否正確。
          </p>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
          {step === 1 && <WelcomePage onNext={nextStep} />}
          {step === 2 && (
            <TeamSizePageForUpdate onNext={nextStep} onPrev={prevStep} />
          )}
          {step === 3 && (
            <TeamMembersPage onNext={nextStep} onPrev={prevStep} />
          )}
          {step === 4 && (
            <AccompanyingPersonsPage onNext={nextStep} onPrev={prevStep} />
          )}
          {step === 5 && <ExhibitorsPage onNext={nextStep} onPrev={prevStep} />}
          {step === 6 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                恭喜你完成表單的更改，請點選下面的按鈕進行發送
              </h2>
              {showButtons && (
                <>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <ClipLoader size={20} color="#fff" /> : "提交表單"}
                  </Button>
                  <button
                    type="button"
                    onClick={prevStep}
                    className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    上一頁
                  </button>
                </>
              )}
              {submitSuccess && (
                <p className="text-green-500 mt-4">
                  更改成功!如有更新電子郵件請重新驗證!
                </p>
              )}
              {submitError && (
                <p className="text-red-500 mt-4">
                  出現未知的錯誤，請稍後再試一次
                </p>
              )}
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default StepForm;
