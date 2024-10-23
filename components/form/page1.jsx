// components/WelcomePage.js
import { Button } from "@/components/ui/button";

const WelcomePage = ({ onNext }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center">歡迎參加 HackIT！</h1>
      <p className="text-center mb-6">這裡可以寫一些介紹或活動簡介。</p>
      <div className="flex justify-center">
        <Button className="w-full" onClick={onNext}>
          下一頁
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage
