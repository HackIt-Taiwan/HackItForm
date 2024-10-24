import { useFormContext } from "react-hook-form";
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TeamSizePageForUpdate = ({ onNext, onPrev }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const teamSize = watch("teamSize");
  const teamName = watch("teamName");

  const handleTeamSizeChange = (value) => {
    setValue("teamSize", value);
  };

  const handleNext = () => {
    if (teamSize && teamName) {
      onNext();
      window.scrollTo(0, 0); 
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">請選擇參賽團隊人數</h2>
      
      {/* 團隊人數選擇 */}
      <Select
        {...register("teamSize", { required: "請選擇參賽團隊人數" })}
        onValueChange={handleTeamSizeChange}
        defaultValue={teamSize}
        disabled={true}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="團隊人數" />
        </SelectTrigger>
        <SelectContent>
          {/* 使用 Select.Item 來顯示選項 */}
          <SelectItem value="1">1 人</SelectItem>
          <SelectItem value="3">3 人</SelectItem>
          <SelectItem value="4">4 人</SelectItem>
          <SelectItem value="5">5 人</SelectItem>
          <SelectItem value="6">6 人</SelectItem>
        </SelectContent>
      </Select>
      {errors.teamSize && <p className="text-red-600">{errors.teamSize.message}</p>}
      
      {/* 團隊名稱輸入 */}
      <div className="mt-4">
        <Input
          {...register("teamName", { 
            required: "請輸入團隊名稱", 
            minLength: { value: 3, message: "團隊名稱至少需要 3 個字元" },
          })}
          placeholder="團隊名稱"
        />
        {errors.teamName && <p className="text-red-600">{errors.teamName.message}</p>}
      </div>

      <div className="mt-4 flex justify-between">
        <Button onClick={onPrev}>上一步</Button>
        <Button onClick={handleNext} disabled={!teamSize || !teamName || teamName.length < 3}>下一步</Button>
      </div>
    </div>
  );
};

export default TeamSizePageForUpdate;
