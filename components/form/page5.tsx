import { FC, useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Shadcn 的 Input 元件

const ExhibitorsPage: FC<{ onNext: () => void; onPrev: () => void; }> = ({ onNext, onPrev }) => {
  const { register, control, formState: { errors, isValid }, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exhibitors" // 這裡是參展人的數組
  });

  // 在渲染後觸發表單驗證以確保按鈕狀態正確
  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">參展人資訊（需填寫姓名和 Email）</h2>
      
      {fields.map((field, index) => (
        <div key={field.id} className="mb-4">
          <h3 className="text-lg font-semibold">參展人 {index + 1}</h3>

          <Input
            {...register(`exhibitors.${index}.name`, {
              required: "姓名必填"
            })}
            placeholder="姓名"
          />
          <p className="text-red-600 min-h-[1.25rem]">
            {errors.exhibitors?.[index]?.name?.message}
          </p>

          <Input
            {...register(`exhibitors.${index}.email`, {
              required: "Email 必填",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email 格式不正確"
              }
            })}
            placeholder="Email"
            type="email"
          />
          <p className="text-red-600 min-h-[1.25rem]">
            {errors.exhibitors?.[index]?.email?.message}
          </p>

          <Button variant="outline" onClick={() => remove(index)} className="mt-2">
            刪除參展人
          </Button>
        </div>
      ))}

      <div className="flex justify-between">
        <Button onClick={onPrev} disabled={!isValid}>上一步</Button>
        <Button
          onClick={() => append({ name: "", email: "" })}
          disabled={fields.length >= 50}
        >
          增加參展人
        </Button>
      </div>

      <div className="mt-4 flex justify-end">
        <Button onClick={onNext} disabled={!isValid}>下一步</Button>
      </div>
    </div>
  );
};

export default ExhibitorsPage;
