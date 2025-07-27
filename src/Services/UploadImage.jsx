import { useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { Box, Button } from "@mui/material";

const UploadImage = ({ onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChooseFile = () => fileInputRef.current.click();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Vui lòng chọn một ảnh!");

    setLoading(true);
    const fileName = `${Date.now()}_${image.name}`;

    const { data, error } = await supabase.storage
      .from("hiv-hospital")
      .upload(fileName, image);
    console.log("Upload data:", data);
    if (error) {
      console.error("Lỗi khi upload:", error);
    } else {
      const { data: publicUrl } = supabase.storage
        .from("hiv-hospital")
        .getPublicUrl(fileName);

      onUploadSuccess(publicUrl.publicUrl);
    }

    setLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      mt={2}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        hidden
      />

      {/* Sửa lỗi thiếu dấu `}` */}
      <Button variant="contained" color="primary" onClick={handleChooseFile}>
        Chọn ảnh
      </Button>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{
            width: "150px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            padding: "5px",
          }}
        />
      )}

      <Button
        variant="contained"
        color="success"
        onClick={handleUpload}
        disabled={loading}
        sx={{ mt: 1, width: "150px" }}
      >
        {loading ? "Đang tải..." : "Upload"}
      </Button>
    </Box>
  );
};

export default UploadImage;
