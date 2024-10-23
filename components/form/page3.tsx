import { FC, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Form component for each team member
const TeamMemberForm: FC<{ index: number }> = ({ index }) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const {
    fields: emergencyContacts,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({
    name: `teamMembers.${index}.emergencyContacts`,
  });

  const addEmergencyContact = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (emergencyContacts.length < 2) {
      appendEmergencyContact({ name: "", relationship: "", phone: "" });
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-semibold">
        {index === 0 ? " 隊長/團隊代表人" : "團隊成員" + index}
      </h3>

      {/* Name input with error message */}
      <Input
        {...register(`teamMembers.${index}.name`, {
          required: "姓名是必填欄位",
        })}
        placeholder="姓名"
        aria-invalid={errors?.teamMembers?.[index]?.name ? "true" : "false"}
      />
      {errors?.teamMembers?.[index]?.name && (
        <p className="text-red-600">{errors.teamMembers[index].name.message}</p>
      )}

      {/* Radio Group for Gender */}
      <RadioGroup
        defaultValue="男"
        onValueChange={(value) =>
          setValue(`teamMembers.${index}.gender`, value)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="男" id={`male-${index}`} />
          <Label htmlFor={`male-${index}`}>男</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="女" id={`female-${index}`} />
          <Label htmlFor={`female-${index}`}>女</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="其他" id={`other-${index}`} />
          <Label htmlFor={`other-${index}`}>其他</Label>
        </div>
      </RadioGroup>

      {/* School input with error message */}
      <Input
        {...register(`teamMembers.${index}.school`, {
          required: "學校是必填欄位",
        })}
        placeholder="學校"
        aria-invalid={errors?.teamMembers?.[index]?.school ? "true" : "false"}
      />
      {errors?.teamMembers?.[index]?.school && (
        <p className="text-red-600">
          {errors.teamMembers[index].school.message}
        </p>
      )}

      {/* Radio Group for Grade */}
      <RadioGroup
        defaultValue="一"
        onValueChange={(value) => setValue(`teamMembers.${index}.grade`, value)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="一" id={`grade-one-${index}`} />
          <Label htmlFor={`grade-one-${index}`}>高中職一</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="二" id={`grade-two-${index}`} />
          <Label htmlFor={`grade-two-${index}`}>高中職二</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="三" id={`grade-three-${index}`} />
          <Label htmlFor={`grade-three-${index}`}>高中職三</Label>
        </div>
      </RadioGroup>
      {errors?.teamMembers?.[index]?.grade && (
        <p className="text-red-600">
          {errors.teamMembers[index].grade.message}
        </p>
      )}

      {/* Identity Number with error message */}
      <Input
        {...register(`teamMembers.${index}.identityNumber`, {
          required: "身份字號是必填欄位",
          minLength: { value: 10, message: "身份字號至少需要10個字元" },
        })}
        placeholder="身份字號"
        aria-invalid={
          errors?.teamMembers?.[index]?.identityNumber ? "true" : "false"
        }
      />
      {errors?.teamMembers?.[index]?.identityNumber && (
        <p className="text-red-600">
          {errors.teamMembers[index].identityNumber.message}
        </p>
      )}

      {/* 生日输入框及错误信息 */}
      <Input
        type="date" // 设置输入框为日期类型
        {...register(`teamMembers.${index}.birthday`, {
          required: "生日是必填欄位",
        })}
        placeholder="生日格式為 yyyy/mm/dd (年/月/日)"
        aria-invalid={errors?.teamMembers?.[index]?.birthday ? "true" : "false"}
      />
      {errors?.teamMembers?.[index]?.birthday && (
        <p className="text-red-600">
          {errors.teamMembers[index].birthday.message}
        </p>
      )}

      {/* Email with error message */}
      <Input
        {...register(`teamMembers.${index}.email`, {
          required: "Email 是必填欄位",
          pattern: { value: /^\S+@\S+$/i, message: "請輸入有效的電子郵件地址" },
        })}
        placeholder="Email"
        aria-invalid={errors?.teamMembers?.[index]?.email ? "true" : "false"}
      />
      {errors?.teamMembers?.[index]?.email && (
        <p className="text-red-600">
          {errors.teamMembers[index].email.message}
        </p>
      )}

      {/* Phone with error message */}
      <Input
        {...register(`teamMembers.${index}.phone`, {
          required: "手機是必填欄位",
          pattern: { value: /^\d{10}$/, message: "請輸入10位數字的手機號碼" },
        })}
        placeholder="手機"
        aria-invalid={errors?.teamMembers?.[index]?.phone ? "true" : "false"}
      />
      {errors?.teamMembers?.[index]?.phone && (
        <p className="text-red-600">
          {errors.teamMembers[index].phone.message}
        </p>
      )}

      {/* Additional fields */}
      <Input
        {...register(`teamMembers.${index}.allergies`)}
        placeholder="過敏原 / 素食選擇"
      />
      <Input
        {...register(`teamMembers.${index}.specialDiseases`)}
        placeholder="特殊疾病"
      />
      <Textarea
        {...register(`teamMembers.${index}.remarks`)}
        placeholder="備註"
      />

      {/* Emergency Contacts */}
      <div className="space-y-2">
        <h4 className="font-semibold">緊急聯絡人</h4>
        {emergencyContacts.map((contact, contactIndex) => (
          <div key={contactIndex} className="space-y-2">
            <Label>{`緊急聯絡人 ${contactIndex + 1}`}</Label>
            <Input
              {...register(
                `teamMembers.${index}.emergencyContacts.${contactIndex}.name`,
                { required: "姓名是必填欄位" }
              )}
              placeholder="姓名"
              aria-invalid={
                errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
                  ?.name
                  ? "true"
                  : "false"
              }
            />
            {errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
              ?.name && (
              <p className="text-red-600">
                {
                  errors.teamMembers[index].emergencyContacts[contactIndex].name
                    .message
                }
              </p>
            )}
            <Input
              {...register(
                `teamMembers.${index}.emergencyContacts.${contactIndex}.relationship`,
                { required: "關係是必填欄位" }
              )}
              placeholder="關係"
              aria-invalid={
                errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
                  ?.relationship
                  ? "true"
                  : "false"
              }
            />
            {errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
              ?.relationship && (
              <p className="text-red-600">
                {
                  errors.teamMembers[index].emergencyContacts[contactIndex]
                    .relationship.message
                }
              </p>
            )}
            <Input
              {...register(
                `teamMembers.${index}.emergencyContacts.${contactIndex}.phone`,
                {
                  required: "電話是必填欄位",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "請輸入10位數字的電話號碼",
                  },
                }
              )}
              placeholder="電話"
              aria-invalid={
                errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
                  ?.phone
                  ? "true"
                  : "false"
              }
            />
            {errors?.teamMembers?.[index]?.emergencyContacts?.[contactIndex]
              ?.phone && (
              <p className="text-red-600">
                {
                  errors.teamMembers[index].emergencyContacts[contactIndex]
                    .phone.message
                }
              </p>
            )}

            {emergencyContacts.length > 1 && (
              <Button
                variant="destructive"
                onClick={() => removeEmergencyContact(contactIndex)}
              >
                移除聯絡人
              </Button>
            )}
          </div>
        ))}
        {/* 新增緊急聯絡人按鈕 */}
        <Button
          onClick={addEmergencyContact}
          variant="outline"
          disabled={emergencyContacts.length >= 2} // 禁用條件
        >
          新增緊急聯絡人
        </Button>
      </div>
    </div>
  );
};

const TeamMembersPage: FC<{ onNext: () => void; onPrev: () => void }> = ({
  onNext,
  onPrev,
}) => {
  const { control, watch, handleSubmit } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "teamMembers",
  });
  const teamSize = parseInt(watch("teamSize"), 10);
  const isInitialRender = useRef(true);

  // 自動添加成員
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!isNaN(teamSize)) {
      const diff = teamSize - fields.length;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          append({
            isRepresentative: false,
            name: "",
            gender: "男",
            school: "",
            grade: "一",
            identityNumber: "",
            birthday: "",
            email: "",
            phone: "",
            allergies: "",
            specialDiseases: "",
            remarks: "",
            emergencyContacts: [{ name: "", relationship: "", phone: "" }],
          });
        }
      }
    }
  }, [teamSize, fields.length, append]);

  // 提交處理邏輯
  const onSubmit = (data: FormData) => {
    console.log(data); // 這裡會輸出表單的數據
    onNext(); // 驗證通過後進行下一步
  };

  const onSubmitUp = (data: FormData) => {
    console.log(data); // 這裡會輸出表單的數據
    onPrev(); // 驗證通過後進行下一步
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">參賽團隊成員資料</h2>
      {fields.map((field, index) => (
        <TeamMemberForm key={field.id} index={index} />
      ))}
      <div className="flex justify-between">
        <Button onClick={handleSubmit(onSubmitUp)}>上一步</Button>
        {/* 使用 handleSubmit 包裹 onSubmit 函數 */}
        <Button onClick={handleSubmit(onSubmit)}>下一步</Button>
      </div>
    </div>
  );
};

export default TeamMembersPage;
