import { FC, useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const TeamMemberForm: FC<{ index: number }> = ({ index }) => {
  const { register, watch, setValue } = useFormContext();
  const { fields: emergencyContacts, append: appendEmergencyContact, remove: removeEmergencyContact } = useFieldArray({
    name: `teamMembers.${index}.emergencyContacts` // 管理緊急聯絡人的陣列
  });
  const birthday = watch(`teamMembers.${index}.birthday`);

  const addEmergencyContact = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 防止頁面跳轉
    if (emergencyContacts.length < 4) { // 限制最多4位緊急聯絡人
      appendEmergencyContact({ name: "", relationship: "", phone: "" });
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-semibold">團隊成員 {index + 1}</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`representative-${index}`}
          {...register(`teamMembers.${index}.isRepresentative`)}
        />
        <Label htmlFor={`representative-${index}`}>是否為代表人</Label>
      </div>

      <Input {...register(`teamMembers.${index}.name`, { required: true })} placeholder="姓名" />

      <RadioGroup
        defaultValue="男"
        onValueChange={(value) => setValue(`teamMembers.${index}.gender`, value)}
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

      <Input {...register(`teamMembers.${index}.school`, { required: true })} placeholder="學校" />

      <Select onValueChange={(value) => setValue(`teamMembers.${index}.grade`, value)}>
        <SelectTrigger>
          <SelectValue placeholder="年級" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="一">一</SelectItem>
          <SelectItem value="二">二</SelectItem>
          <SelectItem value="三">三</SelectItem>
        </SelectContent>
      </Select>

      <Input 
        {...register(`teamMembers.${index}.identityNumber`, { 
          required: true,
          minLength: { value: 10, message: "身份字號至少需要10個字元" }
        })} 
        placeholder="身份字號" 
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {birthday ? format(new Date(birthday), 'PP') : '選擇生日'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={birthday ? new Date(birthday) : undefined}
            onSelect={(date) => setValue(`teamMembers.${index}.birthday`, date?.toISOString())}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Input 
        {...register(`teamMembers.${index}.email`, { 
          required: true,
          pattern: { value: /^\S+@\S+$/i, message: "請輸入有效的電子郵件地址" }
        })} 
        placeholder="Email" 
      />

      <Input 
        {...register(`teamMembers.${index}.phone`, { 
          required: true,
          pattern: { value: /^\d{10}$/, message: "請輸入10位數字的手機號碼" }
        })} 
        placeholder="手機" 
      />

      <Input {...register(`teamMembers.${index}.allergies`)} placeholder="過敏原 / 素食選擇" />
      <Input {...register(`teamMembers.${index}.specialDiseases`)} placeholder="特殊疾病" />
      <Textarea {...register(`teamMembers.${index}.remarks`)} placeholder="備註" />

      {/* 緊急聯絡人 */}
      <div className="space-y-2">
        <h4 className="font-semibold">緊急聯絡人</h4>
        {emergencyContacts.map((contact, contactIndex) => (
          <div key={contactIndex} className="space-y-2">
            <Label>{`緊急聯絡人 ${contactIndex + 1}`}</Label> {/* 添加編號 */}
            <Input 
              {...register(`teamMembers.${index}.emergencyContacts.${contactIndex}.name`, { required: true })} 
              placeholder="姓名" 
            />
            <Input 
              {...register(`teamMembers.${index}.emergencyContacts.${contactIndex}.relationship`, { required: true })} 
              placeholder="關係" 
            />
            <Input 
              {...register(`teamMembers.${index}.emergencyContacts.${contactIndex}.phone`, { required: true })} 
              placeholder="電話" 
            />
            {contactIndex > 0 && (
              <Button onClick={() => removeEmergencyContact(contactIndex)} variant="destructive">
                刪除
              </Button>
            )}
          </div>
        ))}
        {emergencyContacts.length < 4 && (
          <Button onClick={addEmergencyContact} variant="outline">添加緊急聯絡人</Button>
        )}
      </div>
    </div>
  );
};


const TeamMembersPage: FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const { control, watch } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: "teamMembers"
  });
  const teamSize = parseInt(watch("teamSize"), 10); // 確保 teamSize 是數字
  const isInitialRender = useRef(true);

  // 自動添加成員
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (!isNaN(teamSize)) { // 確保 teamSize 是有效數字
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
            emergencyContacts: [{ name: "", relationship: "", phone: "" }] // 初始化一位緊急聯絡人
          });
        }
      }
    }
  }, [teamSize, fields.length, append]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">參賽團隊成員資料</h2>
      {fields.map((field, index) => (
        <TeamMemberForm key={field.id} index={index} />
      ))}
      <div className="flex justify-between">
        <Button onClick={onPrev}>上一步</Button>
        <Button onClick={onNext}>下一步</Button>
      </div>
    </div>
  );
};

export default TeamMembersPage;
