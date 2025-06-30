import React, { useEffect, useState } from "react";
import drugsManagerService from "../../Services/ManagerService/drugsManagerService";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ManagerDrugs = () => {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [newDrug, setNewDrug] = useState({
    genericName: "",
    manufacturer: "",
    group: [],
  });

  const navigate = useNavigate();

  const fetchDrugs = async () => {
    try {
      const data = await drugsManagerService.getAllDrugs();
      setDrugs(data);
    } catch (error) {
      console.error("Failed to fetch drugs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleOpenForm = () => setOpenForm(true);
  const handleCloseForm = () => {
    setOpenForm(false);
    setNewDrug({ genericName: "", manufacturer: "", group: [] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDrug((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDrug = async () => {
    try {
      const payload = {
        ...newDrug,
        group: newDrug.group.split(",").map((g) => g.trim()),
      };
      await drugsManagerService.createDrug(payload);
      handleCloseForm();
      fetchDrugs(); // refresh list
    } catch (error) {
      alert("Failed to create drug");
    }
  };

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Drug List</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenForm}>
          Create Drug
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="drug table">
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <b>Generic Name</b>
                </TableCell>
                <TableCell>
                  <b>Manufacturer</b>
                </TableCell>
                <TableCell>
                  <b>Group</b>
                </TableCell>
                <TableCell>
                  <b>Created By</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drugs.map((drug) => (
                <TableRow key={drug._id}>
                  <TableCell>{drug.genericName}</TableCell>
                  <TableCell>{drug.manufacturer}</TableCell>
                  <TableCell>{drug.group.join(", ")}</TableCell>
                  <TableCell>{drug.createdBy?.email || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/manager/drugs/${drug._id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ ml: 1 }}
                      onClick={async () => {
                        const confirm = window.confirm(
                          "Are you sure you want to delete this drug?"
                        );
                        if (confirm) {
                          try {
                            await drugsManagerService.deleteDrug(drug._id);
                            fetchDrugs();
                          } catch (error) {
                            alert("Failed to delete drug");
                          }
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Drug Form - Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>Create New Drug</DialogTitle>
        <DialogContent>
          <TextField
            label="Generic Name"
            name="genericName"
            fullWidth
            margin="normal"
            value={newDrug.genericName}
            onChange={handleChange}
          />
          <TextField
            label="Manufacturer"
            name="manufacturer"
            fullWidth
            margin="normal"
            value={newDrug.manufacturer}
            onChange={handleChange}
          />
          <TextField
            label="Group (comma-separated)"
            name="group"
            fullWidth
            margin="normal"
            value={newDrug.group}
            onChange={handleChange}
            placeholder="e.g., NRTIs, NNRTIs"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateDrug}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerDrugs;
