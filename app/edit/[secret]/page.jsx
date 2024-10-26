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
  studentCardFront: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, "學生證正面大小必須小於 10MB"), // 檔案大小限制
  studentCardBack: z
    .instanceof(File)
    .refine((file) => file.size < 10000000, "學生證背面大小必須小於 10MB"), // 檔案大小限制
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


          // 將處理過的資料設置到表單
          methods.reset({
            ...data,
          });
  
          methods.setValue("teamSize", String(data.teamMembers.length));
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
    setLoading(true);
    setSubmitSuccess(false);
    setSubmitError(false);
  
    // 创建一个新的数据对象来存储 Base64 编码的文件
    const base64Data = { ...data };
  
    // 使用 Promise.all 来等待所有文件读取完成
    const readImageAsBase64 = async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // 返回 Base64 字符串
        };
        reader.readAsDataURL(file);
      });
    };
  
    // 存储所有的文件读取 Promise
    const fileReaders = [];
  
    // 遍历每个团队成员
    for (let i = 0; i < base64Data.teamMembers.length; i++) {
      const member = base64Data.teamMembers[i];
      if (member.studentCardFront instanceof File) {
        fileReaders.push(
          readImageAsBase64(member.studentCardFront).then((base64) => {
            base64Data.teamMembers[i].studentCardFront = base64;
          })
        );
      } else if (typeof member.studentCardFront === "string" && member.studentCardFront.startsWith("data:image")) {
        // 如果已經是 Base64 字符串，直接使用
        base64Data.teamMembers[i].studentCardFront = member.studentCardFront;
      }
    
      // 如果 studentCardBack 是 File，才進行轉換
      if (member.studentCardBack instanceof File) {
        fileReaders.push(
          readImageAsBase64(member.studentCardBack).then((base64) => {
            base64Data.teamMembers[i].studentCardBack = base64;
          })
        );
      } else if (typeof member.studentCardBack === "string" && member.studentCardBack.startsWith("data:image")) {
        // 如果已經是 Base64 字符串，直接使用
        base64Data.teamMembers[i].studentCardBack = member.studentCardBack;
      }
    }
  
    try {
      // 等待所有文件读取完成
      await Promise.all(fileReaders);
  
      const response = await fetch(API_END_POINT + "users/team/update/" + params.secret, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 将请求内容类型设置为 JSON
        },
        body: JSON.stringify(base64Data), // 将包含 Base64 数据的对象作为请求主体
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const responseData = await response.json();
      console.log("成功提交數據:", responseData);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("提交失敗:", error);
      setSubmitError(true);
    } finally {
      setLoading(false);
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
