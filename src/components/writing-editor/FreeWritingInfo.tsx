
import { Label } from "@/components/ui/label";
import { PenTool } from "lucide-react";

const FreeWritingInfo = () => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <PenTool className="w-5 h-5 text-green-600" />
        <Label className="font-semibold text-green-800">Free Writing Mode</Label>
      </div>
      <p className="text-green-700 text-sm">
        Write about any topic you choose. Your writing will still be analyzed using IELTS criteria.
      </p>
    </div>
  );
};

export default FreeWritingInfo;
