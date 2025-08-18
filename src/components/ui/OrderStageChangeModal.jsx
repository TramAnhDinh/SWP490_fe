import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const OrderStageChangeModal = ({ isOpen, onClose, onSubmit, stageName }) => {
  const [notes, setNotes] = useState('');
  const [subStage, setSubStage] = useState('2'); // default: Đang thiết kế
  if (!isOpen) return null;
  const isInProgress = stageName === 'Đang xử lý' || stageName === 'In Progress';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Chuyển trạng thái: <span className="text-blue-600">{stageName}</span></h2>
        {isInProgress && (
          <div className="mb-4">
            <div className="font-medium mb-1">Chọn giai đoạn:</div>
            <label className="flex items-center gap-2 mb-1">
              <input type="radio" name="subStage" value="2" checked={subStage === '2'} onChange={() => setSubStage('2')} />
              Đang thiết kế (50%)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="subStage" value="3" checked={subStage === '3'} onChange={() => setSubStage('3')} />
              Đang sản xuất (75%)
            </label>
          </div>
        )}
        <Input
          label="Ghi chú (bắt buộc)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          required
          placeholder="Nhập ghi chú cho tiến độ này..."
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button onClick={() => {
            if (!notes.trim()) return;
            if (isInProgress) {
              // Gửi stage và completionPercentage tương ứng
              const stage = subStage === '2' ? 2 : 3;
              const completionPercentage = subStage === '2' ? 50 : 75;
              onSubmit(notes, stage, completionPercentage);
            } else {
              onSubmit(notes);
            }
          }} disabled={!notes.trim()}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};
export default OrderStageChangeModal;