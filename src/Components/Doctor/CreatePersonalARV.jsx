// CreatePersonalARV.jsx
import React from "react";
import {
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const CreatePersonalARV = ({
  regimen,
  editable,
  onDosageChange,
  onFrequencyChange,
  onSave,
}) => {
  return (
    <div className="border border-green-300 rounded-xl shadow-md bg-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT: Thông tin phác đồ */}
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {regimen.name} ({regimen.regimenType})
          </h3>

          <p className="text-sm mb-1">
            📄 <strong>Mô tả:</strong> {regimen.description}
          </p>
          <p className="text-sm mb-1">
            ⚠️ <strong>Tác dụng phụ:</strong> {regimen.sideEffects}
          </p>

          <Divider className="my-3" />

          <h4 className="font-semibold mb-2 text-sm">🧪 Tiêu chí áp dụng:</h4>
          <List dense className="pl-3">
            {regimen.criteria.map((c, i) => (
              <ListItem key={i} disablePadding>
                <ListItemText
                  primary={`• ${c.test_type} ${c.operator} ${c.value}`}
                  primaryTypographyProps={{ fontSize: "14px" }}
                />
              </ListItem>
            ))}
          </List>
        </div>

        {/* RIGHT: Chỉnh sửa thuốc */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">
            Chỉnh sửa liều lượng & tần suất:
          </h4>
          {editable?.customDrugs.map((drug, i) => (
            <div key={i} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-medium text-gray-800 mb-2">
                {drug.genericName} ({drug.manufacturer})
              </p>
              <TextField
                label="Liều lượng"
                value={drug.dosage}
                onChange={(e) => onDosageChange(regimen._id, i, e.target.value)}
                fullWidth
                size="small"
                margin="dense"
                className="mb-2"
              />
              <TextField
                label="Số lần dùng (ngăn cách bởi dấu phẩy)"
                value={drug.frequency.join(", ")}
                onChange={(e) =>
                  onFrequencyChange(regimen._id, i, e.target.value)
                }
                fullWidth
                size="small"
                margin="dense"
              />
            </div>
          ))}

          <Button
            variant="contained"
            color="success"
            onClick={() => onSave(regimen._id)}
          >
            💾 Lưu phác đồ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePersonalARV;
