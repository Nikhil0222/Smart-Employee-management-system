import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { authorizeRoles } from "./middlewares/role.middleware.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.json({ message: "SEMS Backend Running 🚀" });
});

/**
 * 🔓 REGISTER
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔓 LOGIN
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🔐 PROTECTED ROUTE
 */
app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected profile access granted",
    user: req.user,
  });
});

// ADMIN only
app.get(
  "/api/admin/dashboard",
  verifyToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome ADMIN" });
  }
);

// ADMIN + MANAGER
app.get(
  "/api/manager/reports",
  verifyToken,
  authorizeRoles("ADMIN", "MANAGER"),
  (req, res) => {
    res.json({ message: "Manager reports access granted" });
  }
);

// EMPLOYEE (all roles)
app.get(
  "/api/employee/profile",
  verifyToken,
  authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
  (req, res) => {
    res.json({ message: "Employee profile access granted" });
  }
);

const PORT = process.env.PORT || 5000;
// ➕ CREATE EMPLOYEE (ADMIN, MANAGER)
// ➕ CREATE EMPLOYEE (ADMIN, MANAGER)
app.post(
  "/api/employees",
  verifyToken,
  authorizeRoles("ADMIN", "MANAGER"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Employee already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const employee = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "EMPLOYEE",
        },
      });

      res.status(201).json({
        message: "Employee created successfully",
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
// 📄 GET ALL EMPLOYEES (ADMIN, MANAGER)
app.get(
  "/api/employees",
  verifyToken,
  authorizeRoles("ADMIN", "MANAGER"),
  async (req, res) => {
    try {
      const employees = await prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      res.json({
        count: employees.length,
        employees,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
// ✏️ UPDATE EMPLOYEE (ADMIN only)
app.put(
  "/api/employees/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const employeeId = parseInt(req.params.id);
      const { name, email, role } = req.body;

      const employee = await prisma.user.findUnique({
        where: { id: employeeId },
      });

      if (!employee || employee.role !== "EMPLOYEE") {
        return res.status(404).json({ message: "Employee not found" });
      }

      const updatedEmployee = await prisma.user.update({
        where: { id: employeeId },
        data: {
          name: name ?? employee.name,
          email: email ?? employee.email,
          role: role ?? employee.role,
        },
      });

      res.json({
        message: "Employee updated successfully",
        employee: {
          id: updatedEmployee.id,
          name: updatedEmployee.name,
          email: updatedEmployee.email,
          role: updatedEmployee.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
// 🗑️ DELETE EMPLOYEE (ADMIN only)
app.delete(
  "/api/employees/:id",
  verifyToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const employeeId = parseInt(req.params.id);

      const employee = await prisma.user.findUnique({
        where: { id: employeeId },
      });

      if (!employee || employee.role !== "EMPLOYEE") {
        return res.status(404).json({ message: "Employee not found" });
      }

      await prisma.user.delete({
        where: { id: employeeId },
      });

      res.json({ message: "Employee deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

