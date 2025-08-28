import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Stack,
  Alert,
} from "@mui/material";
import { Edit, Delete, Notes, Add } from "@mui/icons-material";
import axios, { type AxiosResponse } from "axios";
import type { TaskDto, CreateTaskDto, UpdateTaskDto } from "../types/task";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5207/api";

const getAuthHeader = () => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export default function TaskPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<{
    Title?: string;
    IsCompleted?: boolean;
  }>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState<
    Partial<UpdateTaskDto & { id?: number }>
  >({
    title: "",
    description: "",
    dueDate: "",
    isCompleted: false,
  });

  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "notCompleted"
  >("all");

  const fetchTasks = async () => {
    try {
      const response: AxiosResponse<TaskDto[]> = await axios.get(
        `${API_URL}/task`,
        {
          headers: getAuthHeader(),
          params: {
            Title: filter.Title,
            IsCompleted: filter.IsCompleted?.toString(),
          },
        }
      );

      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/task/${id}`, {
        headers: getAuthHeader(),
      });

      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleSave = async () => {
    setError(null);

    try {
      let response: AxiosResponse;

      if (currentTask.id) {
        const updateData: UpdateTaskDto = {
          ...currentTask,
          title: currentTask.title || "",
          description: currentTask.description || "",
          isCompleted: currentTask.isCompleted || false,
          dueDate: currentTask.dueDate
            ? new Date(currentTask.dueDate).toISOString()
            : "",
        };

        response = await axios.put(
          `${API_URL}/task/${currentTask.id}`,
          updateData,
          {
            headers: getAuthHeader(),
          }
        );
      } else {
        const createData: CreateTaskDto = {
          title: currentTask.title || "",
          description: currentTask.description || "",
          dueDate: currentTask.dueDate || "",
        };

        response = await axios.post(`${API_URL}/task`, createData, {
          headers: getAuthHeader(),
        });
      }

      setOpenDialog(false);
      fetchTasks();
    } catch (err: any) {
      console.error("Error saving task:", err);

      if (err.response) {
        if (err.response.status === 400) {
          const errorData = err.response.data;
          if (errorData.errors) {
            const messages = Object.values(errorData.errors).flat().join(" ");
            setError(messages);
          } else if (errorData.message) {
            setError(errorData.message);
          } else {
            setError("Validation error occurred");
          }
        } else {
          setError(`HTTP ${err.response.status}: ${err.response.statusText}`);
        }
      } else {
        setError(err.message || "Network error or server unavailable");
      }
    }
  };

  const handleStatusChange = (value: "all" | "completed" | "notCompleted") => {
    setStatusFilter(value);
    let isCompleted: boolean | undefined = undefined;
    if (value === "completed") isCompleted = true;
    else if (value === "notCompleted") isCompleted = false;
    setFilter({ ...filter, IsCompleted: isCompleted });
  };

  const formatDateForInput = (dateValue: string | Date): string => {
    if (!dateValue) return "";

    try {
      const date =
        typeof dateValue === "string" ? new Date(dateValue) : dateValue;
      if (isNaN(date.getTime())) return "";

      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatDateForDisplay = (dateValue: string | Date): string => {
    if (!dateValue) return "No due date";

    try {
      const date =
        typeof dateValue === "string" ? new Date(dateValue) : dateValue;
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date for display:", error);
      return "Invalid date";
    }
  };

  const handleOpenDialog = (task?: TaskDto) => {
    if (task) {
      setCurrentTask({
        ...task,
        dueDate: formatDateForInput(task.dueDate),
      });
    } else {
      setCurrentTask({
        title: "",
        description: "",
        dueDate: "",
        isCompleted: false,
      });
    }
    setError(null); // Clear any previous errors
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Tasks
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Search tasks"
            value={filter.Title || ""}
            onChange={(e) => setFilter({ ...filter, Title: e.target.value })}
            size="small"
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => handleStatusChange(e.target.value as any)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="notCompleted">Pending</MenuItem>
            </Select>
          </FormControl>

          <Button onClick={fetchTasks} variant="outlined">
            Filter
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            New Task
          </Button>
        </Box>
      </Paper>

      <Stack spacing={2}>
        {tasks.map((task) => (
          <Paper key={task.id} sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <Typography variant="h6">{task.title}</Typography>
                  <Chip
                    label={task.isCompleted ? "Completed" : "Pending"}
                    color={task.isCompleted ? "success" : "default"}
                    size="small"
                  />
                </Box>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {task.description || "No description"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Due: {formatDateForDisplay(task.dueDate)}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => handleOpenDialog(task)}
                  color="primary"
                >
                  <Edit />
                </IconButton>

                <IconButton
                  onClick={() => navigate(`/task/${task.id}`)}
                  color="info"
                >
                  <Notes />
                </IconButton>

                <IconButton onClick={() => handleDelete(task.id)} color="error">
                  <Delete />
                </IconButton>
              </Stack>
            </Box>
          </Paper>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentTask.id ? "Edit Task" : "Create Task"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={currentTask.title || ""}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={currentTask.description || ""}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, description: e.target.value })
              }
            />

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              value={currentTask.dueDate || ""}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, dueDate: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            {currentTask.id && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={currentTask.isCompleted || false}
                  onChange={(e) =>
                    setCurrentTask({
                      ...currentTask,
                      isCompleted: e.target.checked,
                    })
                  }
                />
                <Typography>Completed</Typography>
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
