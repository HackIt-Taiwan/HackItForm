import { FC, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Shadcn 的 Input 元件

const AccompanyingPersonsPage: FC<{ onNext: () => void; onPrev: () => void; }> = ({ onNext, onPrev }) => {
  const { register, control, formState: { errors, isValid }, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "accompanyingPersons" // 這裡是陪伴人的數組
  });

  // 在渲染後觸發表單驗證以確保按鈕狀態正確
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">陪伴人（家人、老師、教授）最多兩個，可省略</h2>
      
      {fields.map((field, index) => (
        <div key={field.id} className="mb-4">
          <h3 className="text-lg font-semibold">陪伴人 {index + 1}</h3>

          <Input
            {...register(`accompanyingPersons.${index}.name`, {
              required: "姓名必填"
            })}
            placeholder="姓名"
          />
          <p className="text-red-600 min-h-[1.25rem]">
            {errors.accompanyingPersons?.[index]?.name?.message}
          </p>

          <Input
            {...register(`accompanyingPersons.${index}.email`, {
              required: "Email 必填"
            })}
            placeholder="Email"
            type="email"
          />
          <p className="text-red-600 min-h-[1.25rem]">
            {errors.accompanyingPersons?.[index]?.email?.message}
          </p>

          <Input
            {...register(`accompanyingPersons.${index}.phone`, {
              required: "電話號碼必填",
              minLength: { value: 10, message: "電話號碼必須為 10 碼" },
              maxLength: { value: 10, message: "電話號碼必須為 10 碼" }
            })}
            placeholder="電話號碼"
            type="tel"
          />
          <p className="text-red-600 min-h-[1.25rem]">
            {errors.accompanyingPersons?.[index]?.phone?.message}
          </p>

          <Button variant="outline" onClick={() => remove(index)} className="mt-2">
            刪除陪伴人
          </Button>
        </div>
      ))}

      <div className="flex justify-between">
        <Button onClick={onPrev} disabled={!isValid}>上一步</Button>
        <Button
          onClick={() => append({ name: "", email: "", phone: "" })}
          disabled={fields.length >= 2}
        >
          增加陪伴人
        </Button>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={onNext} disabled={!isValid}>下一步</Button>
      </div>
    </div>
  );
};

export default AccompanyingPersonsPage;
