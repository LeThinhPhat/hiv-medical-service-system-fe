import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import drugsManagerService from "../../Services/ManagerService/drugsManagerService";
import { Typography, Box, CircularProgress } from "@mui/material";

const DrugDetails = () => {
  const { id } = useParams(); // lấy ID từ URL
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrug = async () => {
      try {
        const data = await drugsManagerService.getDrugById(id);
        setDrug(data);
      } catch (error) {
        console.error("Error loading drug:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrug();
  }, [id]);

  if (loading) return <CircularProgress />;

  if (!drug) return <Typography>Drug not found.</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h5">Drug Details</Typography>
      <Typography>
        <b>Generic Name:</b> {drug.genericName}
      </Typography>
      <Typography>
        <b>Manufacturer:</b> {drug.manufacturer}
      </Typography>
      <Typography>
        <b>Group:</b> {drug.group.join(", ")}
      </Typography>
      <Typography>
        <b>Created By:</b> {drug.createdBy?.email}
      </Typography>
    </Box>
  );
};

export default DrugDetails;
