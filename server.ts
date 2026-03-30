import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "uploads/" });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize SQLite Database
  const db = new Database("ipp.db");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS Core_Subject_Vertical_Alignment (
      Outcome_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Core_Subject_Area TEXT,
      Enrolled_Grade_Level TEXT,
      Below_Grade_Level_Descriptor TEXT,
      At_Grade_Level_Descriptor TEXT,
      Above_Grade_Level_Descriptor TEXT
    );

    CREATE TABLE IF NOT EXISTS UDL_Accommodations_Matrix (
      Accommodation_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Learner_Barrier TEXT,
      UDL_Purpose TEXT,
      Recommended_Assistive_Tech TEXT
    );

    CREATE TABLE IF NOT EXISTS Divisional_Benchmarks_Evaluation (
      Benchmark_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Division_Level TEXT,
      Evaluation_Status TEXT,
      Modifier INTEGER
    );

    CREATE TABLE IF NOT EXISTS Student_Profiles (
      Student_ID TEXT PRIMARY KEY,
      First_Name TEXT,
      Last_Initial TEXT,
      Grade_Level TEXT,
      Transition_Plan_Status TEXT,
      Date_of_Birth TEXT,
      Eligibility_Code TEXT,
      Parents_Names TEXT,
      Phone_Number TEXT,
      Address TEXT,
      Age_Sept_1 TEXT,
      Date_IPP_Created TEXT,
      School_Program TEXT,
      Teacher_Name TEXT,
      IPP_Coordinator TEXT,
      Program_Administrator TEXT,
      Additional_Team_Members TEXT,
      Centre_Based_Hours TEXT,
      Family_Oriented_Sessions TEXT,
      Parental_Input TEXT,
      Medical_Conditions TEXT,
      Strengths_Summary TEXT,
      Areas_of_Need_Summary TEXT,
      Transition_Plan_Details TEXT,
      Year_End_Summary TEXT,
      School_Name TEXT,
      School_Board TEXT,
      Principal_Name TEXT,
      Support_Services_Summary TEXT,
      Current_Performance_Narrative TEXT
    );

    CREATE TABLE IF NOT EXISTS Specialized_Assessments (
      Assessment_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Student_ID TEXT,
      Date TEXT,
      Test_Name TEXT,
      Results TEXT,
      FOREIGN KEY(Student_ID) REFERENCES Student_Profiles(Student_ID)
    );

    CREATE TABLE IF NOT EXISTS Observation_Logs (
      Log_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Student_ID TEXT,
      Outcome_ID INTEGER,
      Accommodation_ID INTEGER,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      Raw_Dictation TEXT,
      AI_Scrubbed_Observation TEXT,
      Image_Path TEXT,
      FOREIGN KEY(Student_ID) REFERENCES Student_Profiles(Student_ID),
      FOREIGN KEY(Outcome_ID) REFERENCES Core_Subject_Vertical_Alignment(Outcome_ID),
      FOREIGN KEY(Accommodation_ID) REFERENCES UDL_Accommodations_Matrix(Accommodation_ID)
    );

    CREATE TABLE IF NOT EXISTS Measurable_Goals (
      Goal_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Student_ID TEXT,
      Goal_Description TEXT,
      Target_Date TEXT,
      Status TEXT DEFAULT 'In Progress',
      Core_Subject_Area TEXT,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      Objective_1_Description TEXT,
      Objective_1_Assessment_Procedure TEXT,
      Objective_1_Progress_Review TEXT,
      Objective_2_Description TEXT,
      Objective_2_Assessment_Procedure TEXT,
      Objective_2_Progress_Review TEXT,
      Objective_3_Description TEXT,
      Objective_3_Assessment_Procedure TEXT,
      Objective_3_Progress_Review TEXT,
      Goal_Accommodations_Strategies TEXT,
      FOREIGN KEY(Student_ID) REFERENCES Student_Profiles(Student_ID)
    );

    CREATE TABLE IF NOT EXISTS Curriculum_Outcomes (
      Outcome_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Subject TEXT,
      Grade TEXT,
      Outcome_Code TEXT,
      Description TEXT
    );

    CREATE TABLE IF NOT EXISTS Student_Outcome_Evaluations (
      Evaluation_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Student_ID TEXT,
      Outcome_ID INTEGER,
      Status TEXT, -- 'Not Met', 'Met', 'Exceeded'
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(Student_ID) REFERENCES Student_Profiles(Student_ID),
      FOREIGN KEY(Outcome_ID) REFERENCES Curriculum_Outcomes(Outcome_ID)
    );

    CREATE TABLE IF NOT EXISTS Student_Vertical_Alignment_Evaluations (
      Evaluation_ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Student_ID TEXT,
      Outcome_ID INTEGER,
      Status TEXT, -- 'Below', 'At', 'Above'
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(Student_ID) REFERENCES Student_Profiles(Student_ID),
      FOREIGN KEY(Outcome_ID) REFERENCES Core_Subject_Vertical_Alignment(Outcome_ID)
    );
  `);

  try { db.exec("ALTER TABLE Student_Profiles ADD COLUMN School_Name TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Student_Profiles ADD COLUMN School_Board TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Student_Profiles ADD COLUMN Principal_Name TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Student_Profiles ADD COLUMN Support_Services_Summary TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Student_Profiles ADD COLUMN Current_Performance_Narrative TEXT;"); } catch (e) {}

  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_1_Description TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_1_Assessment_Procedure TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_1_Progress_Review TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_2_Description TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_2_Assessment_Procedure TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_2_Progress_Review TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_3_Description TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_3_Assessment_Procedure TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Objective_3_Progress_Review TEXT;"); } catch (e) {}
  try { db.exec("ALTER TABLE Measurable_Goals ADD COLUMN Goal_Accommodations_Strategies TEXT;"); } catch (e) {}

  // Seed data if empty
  const countCurriculum = db.prepare("SELECT COUNT(*) as count FROM Curriculum_Outcomes").get() as { count: number };
  if (countCurriculum.count === 0) {
    const insertCurriculum = db.prepare("INSERT INTO Curriculum_Outcomes (Subject, Grade, Outcome_Code, Description) VALUES (?, ?, ?, ?)");
    
    // Mathematics Grade 6
    insertCurriculum.run("Mathematics", "Gr.6", "6.N.1", "Demonstrate an understanding of place value for numbers greater than one million.");
    insertCurriculum.run("Mathematics", "Gr.6", "6.N.2", "Solve problems involving whole numbers and decimals.");
    insertCurriculum.run("Mathematics", "Gr.6", "6.N.3", "Demonstrate an understanding of factors and multiples.");
    insertCurriculum.run("Mathematics", "Gr.6", "6.N.4", "Relate improper fractions to mixed numbers.");
    insertCurriculum.run("Mathematics", "Gr.6", "6.SS.1", "Demonstrate an understanding of angles by identifying examples in the environment.");
    
    // ELA Grade 6
    insertCurriculum.run("English Language Arts", "Gr.6", "6.ELA.1", "Use a variety of strategies to decode and understand unfamiliar words.");
    insertCurriculum.run("English Language Arts", "Gr.6", "6.ELA.2", "Identify and explain the main idea and supporting details in a text.");
    insertCurriculum.run("English Language Arts", "Gr.6", "6.ELA.3", "Write clear, coherent sentences and paragraphs.");
    
    // Mathematics Grade 3
    insertCurriculum.run("Mathematics", "Gr.3", "3.N.1", "Say the number sequence 0 to 1000 forward and backward.");
    insertCurriculum.run("Mathematics", "Gr.3", "3.N.2", "Represent and describe numbers to 1000, concretely, pictorially and symbolically.");

    // English Language Arts Grade 3
    insertCurriculum.run("English Language Arts", "Gr.3", "3.1.1", "Connect prior knowledge and personal experiences with new ideas and information.");
    insertCurriculum.run("English Language Arts", "Gr.3", "3.2.1", "Describe characters, setting and main events in a variety of oral, print and other media texts.");

    // Kindergarten Outcomes
    insertCurriculum.run("English Language Arts", "Kindergarten", "K.ELA.1", "Participate in and represent a range of experiences.");
    insertCurriculum.run("Mathematics", "Kindergarten", "K.Math.1", "Recognize connections between new experiences and prior knowledge.");
    insertCurriculum.run("Social Studies", "Kindergarten", "K.Social.1", "Recognize immediate caregivers and family members.");
    insertCurriculum.run("Science", "Kindergarten", "K.Science.1", "Explore textures and sounds in the environment.");
  }

  const countSubjects = db.prepare("SELECT COUNT(*) as count FROM Core_Subject_Vertical_Alignment").get() as { count: number };
  if (countSubjects.count === 0) {
    const insertSubject = db.prepare("INSERT INTO Core_Subject_Vertical_Alignment (Core_Subject_Area, Enrolled_Grade_Level, Below_Grade_Level_Descriptor, At_Grade_Level_Descriptor, Above_Grade_Level_Descriptor) VALUES (?, ?, ?, ?, ?)");
    
    // Vertical Alignment Data from UDL Framework
    insertSubject.run("English Language Arts", "Kindergarten", "Emergent engagement with visual cues.", "Outcome 1.1: Participate in and represent a range of experiences.", "Outcome 1.1: Express personal experiences and familiar events.");
    insertSubject.run("English Language Arts", "Kindergarten", "Limited connection to prior knowledge.", "Outcome 1.2: Recognize connections between new experiences and prior knowledge.", "Outcome 1.2: Connect new experiences and information with prior knowledge.");
    
    insertSubject.run("Mathematics", "Kindergarten", "Sorting objects by a single attribute.", "Outcome 1.1: Say the number sequence 0 to 10.", "Outcome 1.1: Say the number sequence 0 to 20.");
    insertSubject.run("Mathematics", "Kindergarten", "Limited connection to prior knowledge.", "Outcome 1.2: Recognize connections between new experiences and prior knowledge.", "Outcome 1.2: Connect new experiences and information with prior knowledge.");
    
    insertSubject.run("Social Studies", "Kindergarten", "Recognizing immediate caregivers.", "Area: \"My Family\" / \"My Home.\"", "Area: \"My Body\" / \"Clothing for each season.\"");
    insertSubject.run("Science", "Kindergarten", "Exploring textures and sounds.", "Area: \"Today’s Weather\" / \"Domestic/Wild Animals.\"", "Area: \"Songs and Dances\" / \"Caring for Pets.\"");

    // Existing sample data
    insertSubject.run("English Language Arts", "Gr.6", "Struggles to read complex texts.", "Reads grade-level texts fluently.", "Reads above grade-level texts with deep comprehension.");
    insertSubject.run("Mathematics", "Gr.6", "Difficulty with basic operations.", "Solves grade-level math problems.", "Excels in advanced problem solving.");
    insertSubject.run("Mathematics", "Gr.3", "Struggles with addition/subtraction.", "Understands basic multiplication.", "Solves complex word problems.");
    insertSubject.run("Social Studies", "Gr.6", "Needs help understanding historical events.", "Understands key historical events.", "Analyzes historical events critically.");
  }

  const countAccommodations = db.prepare("SELECT COUNT(*) as count FROM UDL_Accommodations_Matrix").get() as { count: number };
  if (countAccommodations.count === 0) {
    const insertAcc = db.prepare("INSERT INTO UDL_Accommodations_Matrix (Learner_Barrier, UDL_Purpose, Recommended_Assistive_Tech) VALUES (?, ?, ?)");
    insertAcc.run("Reading Fluency", "Access", "Readability Chrome Extensions");
    insertAcc.run("Reading Fluency", "Access", "Raz-Kids");
    insertAcc.run("Resistance to Paper/Pencil", "Expression", "Comic Life");
    insertAcc.run("Resistance to Paper/Pencil", "Expression", "GarageBand");
    insertAcc.run("Math Calculation", "Access & Expression", "Manipulatives");
  }

  const countBenchmarks = db.prepare("SELECT COUNT(*) as count FROM Divisional_Benchmarks_Evaluation").get() as { count: number };
  if (countBenchmarks.count === 0) {
    const insertBench = db.prepare("INSERT INTO Divisional_Benchmarks_Evaluation (Division_Level, Evaluation_Status, Modifier) VALUES (?, ?, ?)");
    insertBench.run("Division 2", "Below Grade Level", -1);
    insertBench.run("Division 2", "At Grade Level", 0);
    insertBench.run("Division 2", "Above Grade Level", 1);
  }

  // API Routes
  app.get("/api/students", (req, res) => {
    const students = db.prepare(`
      SELECT s.*, (SELECT MAX(Timestamp) FROM Observation_Logs WHERE Student_ID = s.Student_ID) as Last_Observation_Date
      FROM Student_Profiles s
    `).all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { Student_ID, First_Name, Last_Initial, Grade_Level, Transition_Plan_Status } = req.body;
    try {
      db.prepare("INSERT INTO Student_Profiles (Student_ID, First_Name, Last_Initial, Grade_Level, Transition_Plan_Status) VALUES (?, ?, ?, ?, ?)").run(Student_ID, First_Name, Last_Initial, Grade_Level, Transition_Plan_Status || "Active");
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/students/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const keys = Object.keys(updates);
    if (keys.length === 0) return res.json({ success: true });

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);

    try {
      db.prepare(`UPDATE Student_Profiles SET ${setClause} WHERE Student_ID = ?`).run(...values, id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/students/:id/assessments", (req, res) => {
    const { id } = req.params;
    const assessments = db.prepare("SELECT * FROM Specialized_Assessments WHERE Student_ID = ? ORDER BY Date DESC").all(id);
    res.json(assessments);
  });

  app.post("/api/students/:id/assessments", (req, res) => {
    const { id } = req.params;
    const { Date, Test_Name, Results } = req.body;
    try {
      db.prepare("INSERT INTO Specialized_Assessments (Student_ID, Date, Test_Name, Results) VALUES (?, ?, ?, ?)").run(id, Date, Test_Name, Results);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/students/bulk", (req, res) => {
    const { students } = req.body;
    const insert = db.prepare("INSERT OR IGNORE INTO Student_Profiles (Student_ID, First_Name, Last_Initial, Grade_Level, Transition_Plan_Status) VALUES (?, ?, ?, ?, ?)");
    const insertMany = db.transaction((students) => {
      for (const student of students) {
        insert.run(student.Student_ID, student.First_Name, student.Last_Initial, student.Grade_Level, "Active");
      }
    });
    try {
      insertMany(students);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/metadata", (req, res) => {
    const subjects = db.prepare("SELECT DISTINCT Core_Subject_Area FROM Core_Subject_Vertical_Alignment").all();
    const evaluationStatuses = db.prepare("SELECT DISTINCT Evaluation_Status FROM Divisional_Benchmarks_Evaluation").all();
    const assistiveTechs = db.prepare("SELECT DISTINCT Recommended_Assistive_Tech FROM UDL_Accommodations_Matrix").all();
    const outcomes = db.prepare("SELECT * FROM Core_Subject_Vertical_Alignment").all();
    const accommodations = db.prepare("SELECT * FROM UDL_Accommodations_Matrix").all();
    res.json({ subjects, evaluationStatuses, assistiveTechs, outcomes, accommodations });
  });

  app.post("/api/observations", upload.single("image"), (req, res) => {
    const { Student_ID, Outcome_ID, Accommodation_ID, Raw_Dictation, AI_Scrubbed_Observation } = req.body;
    const Image_Path = req.file ? req.file.path : null;
    try {
      db.prepare("INSERT INTO Observation_Logs (Student_ID, Outcome_ID, Accommodation_ID, Raw_Dictation, AI_Scrubbed_Observation, Image_Path) VALUES (?, ?, ?, ?, ?, ?)").run(
        Student_ID, Outcome_ID || null, Accommodation_ID || null, Raw_Dictation, AI_Scrubbed_Observation, Image_Path
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/students/:id/report", (req, res) => {
    const { id } = req.params;
    const student = db.prepare("SELECT * FROM Student_Profiles WHERE Student_ID = ?").get(id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const logs = db.prepare(`
      SELECT o.*, c.Core_Subject_Area, c.Enrolled_Grade_Level, u.UDL_Purpose, u.Recommended_Assistive_Tech
      FROM Observation_Logs o
      LEFT JOIN Core_Subject_Vertical_Alignment c ON o.Outcome_ID = c.Outcome_ID
      LEFT JOIN UDL_Accommodations_Matrix u ON o.Accommodation_ID = u.Accommodation_ID
      WHERE o.Student_ID = ?
      ORDER BY o.Timestamp DESC
    `).all(id);

    const goals = db.prepare("SELECT * FROM Measurable_Goals WHERE Student_ID = ? ORDER BY Timestamp DESC").all(id);

    res.json({ student, logs, goals });
  });

  app.post("/api/students/:id/goals", (req, res) => {
    const { id } = req.params;
    const { 
      Goal_Description, Target_Date, Core_Subject_Area,
      Objective_1_Description, Objective_1_Assessment_Procedure, Objective_1_Progress_Review,
      Objective_2_Description, Objective_2_Assessment_Procedure, Objective_2_Progress_Review,
      Objective_3_Description, Objective_3_Assessment_Procedure, Objective_3_Progress_Review,
      Goal_Accommodations_Strategies
    } = req.body;
    try {
      db.prepare(`
        INSERT INTO Measurable_Goals (
          Student_ID, Goal_Description, Target_Date, Status, Core_Subject_Area,
          Objective_1_Description, Objective_1_Assessment_Procedure, Objective_1_Progress_Review,
          Objective_2_Description, Objective_2_Assessment_Procedure, Objective_2_Progress_Review,
          Objective_3_Description, Objective_3_Assessment_Procedure, Objective_3_Progress_Review,
          Goal_Accommodations_Strategies
        ) VALUES (?, ?, ?, 'Not Started', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, Goal_Description, Target_Date, Core_Subject_Area || "General",
        Objective_1_Description || "", Objective_1_Assessment_Procedure || "", Objective_1_Progress_Review || "",
        Objective_2_Description || "", Objective_2_Assessment_Procedure || "", Objective_2_Progress_Review || "",
        Objective_3_Description || "", Objective_3_Assessment_Procedure || "", Objective_3_Progress_Review || "",
        Goal_Accommodations_Strategies || ""
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/goals/:goalId", (req, res) => {
    const { goalId } = req.params;
    const { Status } = req.body;
    try {
      db.prepare("UPDATE Measurable_Goals SET Status = ? WHERE Goal_ID = ?").run(Status, goalId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/curriculum", (req, res) => {
    const { subject, grade } = req.query;
    let query = "SELECT * FROM Curriculum_Outcomes";
    const params: any[] = [];
    
    if (subject || grade) {
      query += " WHERE";
      if (subject) {
        query += " Subject = ?";
        params.push(subject);
      }
      if (grade) {
        if (subject) query += " AND";
        query += " Grade = ?";
        params.push(grade);
      }
    }
    
    const outcomes = db.prepare(query).all(...params);
    res.json(outcomes);
  });

  app.get("/api/vertical-alignment", (req, res) => {
    const { grade, subject } = req.query;
    let query = "SELECT * FROM Core_Subject_Vertical_Alignment";
    const params: any[] = [];
    
    if (grade || subject) {
      query += " WHERE";
      if (grade) {
        query += " Enrolled_Grade_Level = ?";
        params.push(grade);
      }
      if (subject) {
        if (grade) query += " AND";
        query += " Core_Subject_Area = ?";
        params.push(subject);
      }
    }
    
    const outcomes = db.prepare(query).all(...params);
    res.json(outcomes);
  });

  app.get("/api/students/:id/evaluations", (req, res) => {
    const { id } = req.params;
    const evaluations = db.prepare(`
      SELECT e.*, a.Subject, a.Grade, a.Outcome_Code, a.Description
      FROM Student_Outcome_Evaluations e
      JOIN Curriculum_Outcomes a ON e.Outcome_ID = a.Outcome_ID
      WHERE e.Student_ID = ?
      ORDER BY a.Subject, a.Grade, a.Outcome_Code
    `).all(id);
    res.json(evaluations);
  });

  app.post("/api/students/:id/evaluations", (req, res) => {
    const { id } = req.params;
    const { Outcome_ID, Status } = req.body;
    try {
      const existing = db.prepare("SELECT Evaluation_ID FROM Student_Outcome_Evaluations WHERE Student_ID = ? AND Outcome_ID = ?").get(id, Outcome_ID) as { Evaluation_ID: number } | undefined;
      
      if (existing) {
        db.prepare("UPDATE Student_Outcome_Evaluations SET Status = ?, Timestamp = CURRENT_TIMESTAMP WHERE Evaluation_ID = ?").run(Status, existing.Evaluation_ID);
      } else {
        db.prepare("INSERT INTO Student_Outcome_Evaluations (Student_ID, Outcome_ID, Status) VALUES (?, ?, ?)").run(id, Outcome_ID, Status);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/students/:id/vertical-evaluations", (req, res) => {
    const { id } = req.params;
    const evaluations = db.prepare("SELECT * FROM Student_Vertical_Alignment_Evaluations WHERE Student_ID = ?").all(id);
    res.json(evaluations);
  });

  app.post("/api/students/:id/vertical-evaluations", (req, res) => {
    const { id } = req.params;
    const { Outcome_ID, Status } = req.body;
    try {
      const existing = db.prepare("SELECT Evaluation_ID FROM Student_Vertical_Alignment_Evaluations WHERE Student_ID = ? AND Outcome_ID = ?").get(id, Outcome_ID) as { Evaluation_ID: number } | undefined;
      
      if (existing) {
        db.prepare("UPDATE Student_Vertical_Alignment_Evaluations SET Status = ?, Timestamp = CURRENT_TIMESTAMP WHERE Evaluation_ID = ?").run(Status, existing.Evaluation_ID);
      } else {
        db.prepare("INSERT INTO Student_Vertical_Alignment_Evaluations (Student_ID, Outcome_ID, Status) VALUES (?, ?, ?)").run(id, Outcome_ID, Status);
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/students/export", (req, res) => {
    try {
      const students = db.prepare("SELECT * FROM Student_Profiles").all();
      const exportData = students.map((student: any) => {
        const goals = db.prepare("SELECT Goal_Description, Status, Target_Date FROM Measurable_Goals WHERE Student_ID = ?").all(student.Student_ID);
        const logs = db.prepare(`
          SELECT o.Timestamp, o.AI_Scrubbed_Observation, c.Core_Subject_Area
          FROM Observation_Logs o
          LEFT JOIN Core_Subject_Vertical_Alignment c ON o.Outcome_ID = c.Outcome_ID
          WHERE o.Student_ID = ?
        `).all(student.Student_ID);
        const evaluations = db.prepare(`
          SELECT a.Outcome_Code, a.Description, e.Status
          FROM Student_Outcome_Evaluations e
          JOIN Curriculum_Outcomes a ON e.Outcome_ID = a.Outcome_ID
          WHERE e.Student_ID = ?
        `).all(student.Student_ID);
        const verticalEvaluations = db.prepare(`
          SELECT v.Core_Subject_Area, v.At_Grade_Level_Descriptor, e.Status
          FROM Student_Vertical_Alignment_Evaluations e
          JOIN Core_Subject_Vertical_Alignment v ON e.Outcome_ID = v.Outcome_ID
          WHERE e.Student_ID = ?
        `).all(student.Student_ID);

        return {
          ...student,
          Goals: goals.map((g: any) => `${g.Goal_Description} (${g.Status})`).join("; "),
          Observations: logs.map((l: any) => `[${l.Timestamp}] ${l.Core_Subject_Area || "General"}: ${l.AI_Scrubbed_Observation}`).join("; "),
          Curriculum_Evaluations: evaluations.map((e: any) => `${e.Outcome_Code}: ${e.Status}`).join("; "),
          Vertical_Evaluations: verticalEvaluations.map((v: any) => `${v.Core_Subject_Area}: ${v.Status}`).join("; ")
        };
      });
      res.json(exportData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
