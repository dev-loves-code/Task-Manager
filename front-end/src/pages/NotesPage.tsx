import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton,
  Stack,
  Breadcrumbs,
  Link,
  Alert,
} from "@mui/material";
import { Edit, Delete, Add, ArrowBack } from "@mui/icons-material";
import axios, { type AxiosResponse } from "axios";
import type { NoteDto, GetNoteDto } from "../types/note";

const API_URL = "http://localhost:5207/api";

const getAuthHeader = () => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).token : null;

  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

export default function NotesPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<GetNoteDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentNote, setCurrentNote] = useState<
    Partial<NoteDto & { id?: number }>
  >({
    title: "",
    content: "",
  });

  const fetchNotes = async () => {
    if (!taskId) return;

    try {
      const response: AxiosResponse<GetNoteDto[]> = await axios.get(
        `${API_URL}/note/task/${taskId}/notes`,
        {
          headers: getAuthHeader(),
        }
      );

      setNotes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [taskId]);

  const handleSave = async () => {
    if (!taskId) return;

    setError(null);

    try {
      let response: AxiosResponse;

      const noteData = {
        title: currentNote.title || "",
        content: currentNote.content || "",
        ...(currentNote.id ? {} : { taskId }),
      };

      if (currentNote.id) {
        response = await axios.put(
          `${API_URL}/note/${currentNote.id}`,
          noteData,
          {
            headers: getAuthHeader(),
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/note/task/${taskId}`,
          noteData,
          {
            headers: getAuthHeader(),
          }
        );
      }

      setOpenDialog(false);
      fetchNotes();
    } catch (err: any) {
      console.error("Error saving note:", err);

      if (err.response && err.response.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors) {
          const messages = Object.values(errorData.errors).flat().join(" ");
          setError(messages);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError("Validation error occurred");
        }
      } else if (err.response) {
        setError(`HTTP ${err.response.status}: ${err.response.statusText}`);
      } else {
        setError(err.message || "Network error or server unavailable");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/note/${id}`, {
        headers: getAuthHeader(),
      });

      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleOpenDialog = (note?: GetNoteDto) => {
    if (note) {
      setCurrentNote({
        id: note.id,
        title: note.title,
        content: note.content,
      });
    } else {
      setCurrentNote({
        title: "",
        content: "",
      });
    }
    setError(null); // Clear any previous errors
    setOpenDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/")}
            sx={{ textDecoration: "none" }}
          >
            Tasks
          </Link>
          <Typography variant="body2" color="text.secondary">
            Task {taskId} Notes
          </Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/")} color="primary">
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Notes for Task {taskId}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Note
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 2,
        }}
      >
        {notes.map((note) => (
          <Paper key={note.id} sx={{ p: 3, height: "fit-content" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ flex: 1, pr: 1 }}>
                  {note.title || "Untitled"}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(note)}
                    color="primary"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(note.id)}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {note.content || "No content"}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                {new Date(note.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {notes.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No notes yet
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Create First Note
          </Button>
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentNote.id ? "Edit Note" : "Create Note"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={currentNote.title || ""}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, title: e.target.value })
              }
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={6}
              value={currentNote.content || ""}
              onChange={(e) =>
                setCurrentNote({ ...currentNote, content: e.target.value })
              }
            />

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
