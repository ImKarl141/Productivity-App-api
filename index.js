import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
app.use(express.json())
app.use(cors())


//Create 

//Task Component
app.post("/TaskCurrent", (req, resp) => {
  const q = "INSERT INTO `TaskCurrent` (`task_title`, `task_desc`, `task_date`, `task_project`, `task_tag`, `focus_amount`, `is_checked`) VALUES (?)";
  const values = [
    req.body.task_title,
    req.body.task_desc,
    req.body.task_date,
    req.body.task_project,
    req.body.task_tag,
    req.body.focus_amount,
    req.body.is_checked,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  });
});

app.post("/ProjectList", (req, resp) => {
  const q = "INSERT INTO `ProjectList` (`project_name`, `project_color`) VALUES (?)";
  const values = [
    req.body.project_name,
    req.body.project_color,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Project added successfully")
  })
})

app.post("/TagList", (req, resp) => {
  const q = "INSERT INTO `TagList` (`tag_name`, `tag_color`) VALUES (?)"
  const values = [
    req.body.tag_name,
    req.body.tag_color,
  ]
  db.query(q, [values], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Tag added successfully");
  })
})

//Note Component 
app.post('/NoteList', (req, resp) => {
  const q = "INSERT INTO `NoteList` (`note_name`, `note_desc`, `note_color`) VALUES (?)";
  const values = [
    req.body.note_name,
    req.body.note_desc,
    req.body.note_color,
  ]

  db.query(q, [values], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Note send it!");
  })

})
//From Note to Task
app.post("/TaskCurrent/NewTaskFromNote", (req, resp) => {
  const q = "INSERT INTO `TaskCurrent` (`task_title`, `task_desc`, `task_date`, `task_project`, `task_tag`, `focus_amount`, `is_checked`) VALUES (?)";
  const values = [
    req.body.task_title,
    req.body.task_desc,
    req.body.task_date,
    req.body.task_project,
    req.body.task_tag,
    req.body.focus_amount,
    req.body.is_checked,
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  });
})

////////////////////////////////////////////////////////////////////////

//Read

//Task component
app.get("/", (req, resp) => {
  resp.json("Hello from the backend of todo!")
});

app.get("/ProjectList", (req, resp) => {
  const q = "SELECT * FROM ProjectList";
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  })
})

app.get("/TagList", (req, resp) => {
  const q = "SELECT * FROM TagList";
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  })
})

app.get("/TaskCurrent", (req, resp) => {
  const q = "SELECT t.id, t.task_title, t.task_desc, t.task_date, t.focus_amount, t.focus_finished, t.is_checked, p.project_name, p.project_color, tg.tag_name, tg.tag_color FROM `TaskCurrent` t LEFT JOIN `ProjectList` p ON t.task_project = p.id LEFT JOIN `TagList` tg ON t.task_tag = tg.id";
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  })
})

//Note component
app.get('/NoteList', (req, resp) => {
  const q = "SELECT n.id, n.note_name, n.note_desc, n.is_pinned, dc.color_name, dc.color_value FROM `NoteList` n LEFT JOIN `DefaultColors` dc ON n.note_color = dc.id";
  // const q = "SELECT * FROM NoteList";
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    }
    return resp.json(data);
  })
})

app.get('/DefaultColors', (req, resp) => {
  const q = "SELECT * FROM DefaultColors";
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    }
    return resp.json(data);
  })
})

//User settings
app.get('/UserSettings', (req, resp) => {
  const q = "SELECT * FROM `UserSettings`"
  db.query(q, (err, data) => {
    if (err) {
      return resp.json(err);
    } return resp.json(data);
  })
})

////////////////////////////////////////////////////////////////////////

//Update

//Task Component

app.put("/TaskCurrent/:id", (req, resp) => {
  const taskId = req.params.id;
  const q = "UPDATE TaskCurrent SET `task_title` = ?, `task_desc` = ?, `task_date` = ?, `task_project` = ?, `task_tag` = ?, `focus_amount` = ? WHERE id = ?"
  const values = [
    req.body.task_title,
    req.body.task_desc,
    req.body.task_date,
    req.body.task_project,
    req.body.task_tag,
    req.body.focus_amount,
  ];

  db.query(q, [...values, taskId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json(data);
  })
})



//User settings
app.patch("/UserSettings/:id", (req, resp) => {
  const userId = req.params.id;
  const q = "UPDATE UserSettings SET `focus` = ?, `short` = ?, `long` = ? WHERE id = ?"
  const values = [
    req.body.focus,
    req.body.short,
    req.body.long,
  ];

  db.query(q, [...values, userId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json(data);
  })
})

app.patch("/UserSettings/CurrentTask/:id", (req, resp) => {
  const userId = req.params.id
  const q = "UPDATE UserSettings SET `current_task` = ?, `task_id` = ? WHERE id = ?"
  const values = [
    req.body.current_task,
    req.body.task_id,
  ]

  db.query(q, [...values, userId], (err, data) => {
    if (err) return resp.json(err);
    console.log("Current Task Updated");
    return resp.json(data)
  })
})

app.patch("/UserSettings/ClearCurrentTask/:id", (req, resp) => {
  const userId = req.params.id
  const q = "UPDATE UserSettings SET `current_task` = ?, `task_id` = ? WHERE id = ?"
  const values = [
    req.body.current_task,
    req.body.task_id,
  ]

  db.query(q, [...values, userId], (err, data) => {
    if (err) return resp.json(err);
    console.log("Current Task Cleared");
    return resp.json(data)
  })
})

app.patch("/UserSettings/PomoCount/:id", (req, resp) => {
  const userId = req.params.id
  const q = "UPDATE UserSettings SET `PomoCount` = ? WHERE id = ?"
  const values = [
    req.body.PomoCount,
  ]

  db.query(q, [...values, userId], (err, data) => {
    if (err) return resp.json(err);
    console.log("Pomo Count Added");
    return resp.json(data)
  })
})

app.patch("/TaskCurrent/AddPomo/:id", (req, resp) => {
  const taskId = req.params.id
  const q = "UPDATE TaskCurrent SET `focus_finished` = ?  WHERE id = ?"
  const values = [
    req.body.focus_finished,
  ];

  db.query(q, [...values, taskId], (err, data) => {
    if (err) return resp.json(err);
    console.log("Focus amount added");
    return resp.json(data);
  })
})

// app.patch("/TaskCurrent/AddPomo/:id", (req, resp) => {
//   const taskId = req.params.id
//   const q = "UPDATE TaskCurrent SET `focus_finished` = ? WHERE id = ?"
//   const values = [
//     req.body.focus_finished,
//   ]

//   db.query(q, [...values, taskId], (err, data) => {
//     if (err) return resp.json(err);
//     console.log("Updated");
//     return resp.json(data)
//   })
// })




// app.patch("/UserSettings/CurrentTask/:id", (req, resp) => {
//   const userId = req.params.id;
//   const q = "UPDATE UserSettings SET `current_task` = ? WHERE id = ?"
//   const values = [
//     req.body.current_task,
//   ]

//   db.query(q, [...values, userId], (err, data) => {
//     if (err) return resp.json(err);
//     console.log("Settings changed Successfully");
//     return resp.json(data);
//   })
// })

// app.patch

app.put("/ProjectList/:id", (req, resp) => {
  const projectId = req.params.id;
  const q = "UPDATE ProjectList SET `project_name` = ?, `project_color` = ? WHERE id = ?"
  const values = [
    req.body.project_name,
    req.body.project_color
  ];

  db.query(q, [...values, projectId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Project updated successfully");
  })
})

app.put("/TagList/:id", (req, resp) => {
  const tagId = req.params.id;
  const q = "UPDATE TagList SET `tag_name` = ?, `tag_color` = ? WHERE id = ?"
  const values = [
    req.body.tag_name,
    req.body.tag_color
  ]

  db.query(q, [...values, tagId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Tag updated successfully");
  })
})

//Note Component
app.put("/NoteList/:id", (req, resp) => {
  const noteId = req.params.id;
  const q = "UPDATE NoteList SET `note_name` = ?, `note_desc` = ?, `note_color` = ? WHERE id = ?";
  const values = [
    req.body.note_name,
    req.body.note_desc,
    req.body.note_color
  ];

  db.query(q, [...values, noteId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Note updated successfully");
  })
})

//Timer Component
// await axios.patch("http://localhost:8800/TaskCurrent/" + currentTimerId, timerInput)
app.patch("/TaskCurrent/:id", (req, resp) => {
  const timerId = req.params.id;
  const q = "UPDATE `TaskCurrent` SET `task_title` = ?, `focus_amount` = ?, `is_checked` = ? WHERE id = ?"
  const values = [
    req.body.task_title,
    req.body.focus_amount,
    req.body.is_checked,
  ]
  db.query(q, [...values, timerId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Task updated successfully from timer")
  })
})

//Note Component 
app.patch("/NoteList/:id", (req, resp) => {
  const noteId = req.params.id;
  const q = "UPDATE `NoteList` SET `is_pinned` = ? WHERE id = ?"
  const values = [
    req.body.current
  ]
  db.query(q, [...values, noteId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Task updated successfully from timer")
  })
})


//Delete

//Task Component
app.delete("/ProjectList/:id", (req, resp) => {
  const projectId = req.params.id;
  const q = "DELETE FROM ProjectList WHERE id = ?";

  db.query(q, [projectId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Project deleted successfully");
  });
})

app.put("/TaskCurrent/deleteProject/:id", (req, resp) => {
  const projectId = req.params.id;
  const q = "UPDATE TaskCurrent INNER JOIN ProjectList ON TaskCurrent.task_project = ProjectList.id SET TaskCurrent.task_project = NULL WHERE ProjectList.id = ?"

  db.query(q, [projectId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json(data);
  })
})

app.put("/TaskCurrent/deleteTag/:id", (req, resp) => {
  const tagId = req.params.id;
  const q = "UPDATE TaskCurrent INNER JOIN TagList ON TaskCurrent.task_tag = TagList.id SET TaskCurrent.task_tag = NULL WHERE TagList.id = ?"

  db.query(q, [tagId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json(data);
  })
})


app.delete("/TagList/:id", (req, resp) => {
  const tagId = req.params.id;
  const q = "DELETE FROM TagList WHERE id = ?";

  db.query(q, [tagId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Tag deleted successfully");
  })
})

app.delete("/TaskCurrent/:id", (req, resp) => {
  const taskId = req.params.id;
  const q = "DELETE FROM TaskCurrent WHERE id = ?";

  db.query(q, [taskId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Task deleted successfully");
  })
})

app.delete("/TaskCurrent/ClearFinished", (req, resp) => {
  const q = "DELETE FROM `TaskCurrent` WHERE is_checked = 1"
  db.query(q, (err, data) => {
    if (err) return resp.json(err);
    return resp.json("All checked tasks deleted successfully");
  })
})

app.post("/TaskCurrent/ClearAll", (req, resp) => {
  // const q = "DELETE FROM `TaskCurrent` WHERE is_checked = 1"
  const q = "TRUNCATE TABLE `TaskCurrent`"
  db.query(q, (err, data) => {
    if (err) return resp.json(err);
    return resp.json("All checked tasks deleted successfully");
  })
})


//Note Component
app.delete("/NoteList/:id", (req, resp) => {
  const noteId = req.params.id;
  const q = "DELETE FROM NoteList WHERE id = ?";

  db.query(q, [noteId], (err, data) => {
    if (err) return resp.json(err);
    return resp.json("Note deleted successfully");
  })
})

app.post("/NoteList/ClearAll", (req, resp) => {
  const q = "TRUNCATE TABLE `NoteList`";

  db.query(q, (err, data) => {
    if (err) return resp.json(err);
    return resp.json("All Notes deleted successfully");
  })
})

////////////////////////////////////////////////////////////////////////

app.listen(8800, () => {
  console.log("Connected to the server!");
})