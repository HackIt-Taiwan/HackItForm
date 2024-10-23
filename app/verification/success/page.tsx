import { Card, CardHeader, CardContent} from '@/components/ui/card'; // 請確保這是正確的引入路徑

const VerificationSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-md w-full p-6 shadow-lg bg-white rounded-lg">
        <CardHeader>
          <h2 className="text-center font-bold text-green-600 text-xl">
            感謝您已經完成驗證！
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700">
            等待全隊成員完成驗證後，報名的驗證就會完成，請關注email信箱，更進一步的通知將會使用email信箱通知！
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSuccess;