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
            已經寄相關文件至您的信箱，完成簽名後即完成報名！
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationSuccess;