import React from "react";
import { CheckCircle, Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";

const stageColors = [
  "border-blue-500",
  "border-yellow-500",
  "border-green-500",
  "border-gray-400",
  "border-red-500",
];

const iconByStatus = (isDone, isCurrent) => {
  if (isDone) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (isCurrent)
    return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
  return <Clock className="h-5 w-5 text-gray-400" />;
};

const OrderStageTimeline = ({ histories = [] }) => {
  if (!histories.length)
    return <div className="text-gray-500 italic">Chưa có tiến độ nào.</div>;
  return (
    <ol className="relative border-l-2 border-blue-200 ml-2">
      {histories.map((item, idx) => {
        const isDone = idx < histories.length - 1;
        const isCurrent = idx === histories.length - 1;
        return (
          <li key={item.orderStageHistoryID} className="mb-8 ml-4">
            <span
              className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 ${
                isCurrent
                  ? "border-yellow-500"
                  : isDone
                  ? "border-green-500"
                  : "border-gray-300"
              }`}>
              {iconByStatus(isDone, isCurrent)}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-blue-700">
                {item.stageName}
              </span>
              <span className="text-xs text-gray-400">
                ({item.stageDescription})
              </span>
              {isCurrent && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                  Hiện tại
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              {format(new Date(item.changeDate), "dd/MM/yyyy HH:mm")} •{" "}
              {item.changedByEmployeeFullName && (
                <span className="inline-flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {item.changedByEmployeeFullName}
                </span>
              )}
            </div>
            {item.notes && (
              <div className="text-xs text-gray-700 bg-gray-50 border-l-4 border-blue-200 px-3 py-1 rounded">
                <FileText className="h-3 w-3 inline mr-1 text-blue-400" />
                {item.notes}
              </div>
            )}
            {typeof item.completionPercentage === "number" && (
              <div className="mt-1 text-xs text-green-700">
                Hoàn thành: {item.completionPercentage}%
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default OrderStageTimeline;
