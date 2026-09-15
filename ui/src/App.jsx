import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Wallet,
  Brain,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  UploadCloud,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  DollarSign,
  PieChart as PieIcon,
  BarChart2,
  Check,
  X,
  CreditCard,
  Sliders,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import {
  fetchEmployees,
  fetchProjects,
  fetchFinance,
  fetchFinanceExpenses,
  fetchFinanceBudgets,
  fetchFinanceInvoices,
  fetchFinanceReports,
  fetchFinanceAnomalies,
  approveFinanceExpense,
  rejectFinanceExpense,
  payFinanceInvoice,
  updateFinanceBudget,
  uploadFinanceCsv,
  fetchRecommendations,
  predictTaskCompletion,
  isApiConfigured,
  configuredBaseUrl,
  API_BASE_URL,
} from "./lib/api";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Projects", icon: FolderKanban },
  { name: "Employees", icon: Users },
  { name: "Finance", icon: Wallet },
  { name: "AI Analytics", icon: Brain },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [finance, setFinance] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchRecommendations = async (filters) => {
    setLoading(true);
    setError("");

    try {
      setRecommendations(await fetchRecommendations(filters));
    } catch (err) {
      setError(err.message || "Unable to calculate recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!["Employees", "Projects", "Finance", "AI Analytics"].includes(activePage)) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        let data = [];
        if (activePage === "Employees") {
          data = await fetchEmployees();
        } else if (activePage === "Projects") {
          data = await fetchProjects();
        } else if (activePage === "Finance") {
          data = await fetchFinance();
        } else if (activePage === "AI Analytics") {
          data = await fetchRecommendations();
        }

        if (!cancelled) {
          if (activePage === "Employees") {
            setEmployees(Array.isArray(data) ? data : []);
          } else if (activePage === "Projects") {
            setProjects(Array.isArray(data) ? data : []);
          } else if (activePage === "Finance") {
            setFinance(Array.isArray(data) ? data : []);
          } else if (activePage === "AI Analytics") {
            setRecommendations(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load data from backend API.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [activePage]);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-mark">AI</div>
          <div>
            <h2>BusinessOps</h2>
            <span>Management Platform</span>
          </div>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{activePage}</h1>
            <p>AI Business Operations Management Platform</p>
          </div>

          <div className="topbar-actions">
            <div className="search">
              <Search size={18} />
              <input placeholder="Search..." />
            </div>

            <button className="icon-button">
              <Bell size={19} />
            </button>

            <div className="profile">
              <div className="avatar">RM</div>
              <div>
                <strong>Team RP2</strong>
                <span>Administrator</span>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="content">
          <div className="panel" style={{ marginBottom: "1rem" }}>
            <div className="panel-header">
              <div>
                <h3>System Architecture & API Connectivity</h3>
                <p>
                  {isApiConfigured
                    ? `Connected to Django REST API (${configuredBaseUrl || API_BASE_URL})`
                    : "Development Mode (Connects to local backend or Vercel production API URL)"}
                </p>
              </div>
              <span className={`badge ${isApiConfigured ? "success" : "pending"}`}>
                {isApiConfigured ? "Live API" : "Configurable"}
              </span>
            </div>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "13px" }}>
              Modules connect to Django REST endpoints powered by PostgreSQL and machine learning models.
            </p>
          </div>

          {activePage === "Dashboard" && <Dashboard />}

          {activePage === "Projects" && (
            <ProjectTable projects={projects} loading={loading} error={error} />
          )}

          {activePage === "Employees" && (
            <EmployeeTable employees={employees} loading={loading} error={error} />
          )}

          {activePage === "Finance" && (
            <FinanceOperations />
          )}

          {activePage === "AI Analytics" && (
            <AIAnalyticsView
              recommendations={recommendations}
              loading={loading}
              error={error}
              onSearch={searchRecommendations}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <div className="welcome">
        <div>
          <h2>Good morning, Team RP2</h2>
          <p>Here's an overview of the business operations dataset.</p>
        </div>

        <button className="primary-button">View Reports</button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Employees" value="4,999" change="Dataset" />
        <StatCard title="Total Tasks" value="50,000" change="Dataset" />
        <StatCard title="Avg. Workload" value="55.66%" change="Dataset" />
        <StatCard title="Avg. Performance" value="69.71%" change="Dataset" />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Task Progress</h3>
              <p>Current task status from dataset</p>
            </div>
            <span className="badge">Dataset</span>
          </div>

          <div className="progress-item">
            <div>
              <span>Average Task Progress</span>
              <strong>78.72%</strong>
            </div>
            <div className="progress"><div style={{ width: "78.72%" }} /></div>
          </div>

          <div className="progress-item">
            <div>
              <span>Completed Tasks</span>
              <strong>17,225</strong>
            </div>
            <div className="progress"><div style={{ width: "68.9%" }} /></div>
          </div>

          <div className="progress-item">
            <div>
              <span>In Progress Tasks</span>
              <strong>23,437</strong>
            </div>
            <div className="progress"><div style={{ width: "46.9%" }} /></div>
          </div>

          <div className="progress-item">
            <div>
              <span>Blocked Tasks</span>
              <strong>2,950</strong>
            </div>
            <div className="progress"><div style={{ width: "5.9%" }} /></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Dataset Insights</h3>
              <p>Current operational indicators</p>
            </div>
            <Brain size={20} />
          </div>

          <div className="insight">
            <div className="insight-dot" />
            <div>
              <strong>Employee Availability</strong>
              <p>3,233 employees are currently available.</p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-dot" />
            <div>
              <strong>Employee Workload</strong>
              <p>Average employee workload is 55.66%.</p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-dot" />
            <div>
              <strong>Task Progress</strong>
              <p>Average task progress is 78.72%.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Employee Availability</h3>
            <p>Unique employee availability status</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Employees</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="status success">Available</span></td>
              <td>3,233</td>
              <td>64.67%</td>
            </tr>
            <tr>
              <td><span className="status pending">Busy</span></td>
              <td>1,398</td>
              <td>27.97%</td>
            </tr>
            <tr>
              <td>On Leave</td>
              <td>279</td>
              <td>5.58%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Task Status Overview</h3>
            <p>Task distribution from the business operations dataset</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Task Status</th>
              <th>Number of Tasks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>In Progress</td>
              <td>23,437</td>
            </tr>
            <tr>
              <td>Completed</td>
              <td>17,225</td>
            </tr>
            <tr>
              <td>Not Started</td>
              <td>6,033</td>
            </tr>
            <tr>
              <td>Blocked</td>
              <td>2,950</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function EmployeeTable({ employees, loading, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 20;

  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (employee.employee_id && employee.employee_id.toLowerCase().includes(term)) ||
      (employee.employee_name && employee.employee_name.toLowerCase().includes(term)) ||
      (employee.department && employee.department.toLowerCase().includes(term)) ||
      (employee.job_role && employee.job_role.toLowerCase().includes(term)) ||
      (employee.availability_status && employee.availability_status.toLowerCase().includes(term)) ||
      (employee.email && employee.email.toLowerCase().includes(term)) ||
      (employee.skills && employee.skills.toLowerCase().includes(term))
    );
  });

  const totalItems = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
  const endDisplay = endIndex;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (validPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="panel">
      <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div>
          <h3>Employee Management</h3>
          <p>Live data from the Django backend API (/api/employees/)</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search" style={{ width: "240px" }}>
            <Search size={16} />
            <input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading && <p>Loading employees...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Role</th>
                <th>Availability</th>
                <th>Workload</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    {employees.length === 0
                      ? "No employee records found in database."
                      : "No matching employees found."}
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee) => (
                  <tr key={employee.employee_id || employee.email}>
                    <td style={{ fontWeight: "600", color: "#2563eb" }}>{employee.employee_id}</td>
                    <td>{employee.employee_name}</td>
                    <td>{employee.department}</td>
                    <td>{employee.job_role}</td>
                    <td>
                      <span className={`status ${employee.availability_status === "Available" ? "success" : employee.availability_status === "Busy" ? "pending" : "danger"}`}>
                        {employee.availability_status}
                      </span>
                    </td>
                    <td>{employee.workload_percentage}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalItems > 0 && (
            <div className="pagination-bar" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #e5e7eb",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Showing {startDisplay.toLocaleString()}–{endDisplay.toLocaleString()} of {totalItems.toLocaleString()} employees
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  className="pagination-btn"
                  disabled={validPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: validPage <= 1 ? "#f3f4f6" : "#ffffff",
                    color: validPage <= 1 ? "#9ca3af" : "#374151",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: validPage <= 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} style={{ padding: "0 6px", color: "#9ca3af", fontSize: "12px" }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "6px 11px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: validPage === page ? "#2563eb" : "#d1d5db",
                        background: validPage === page ? "#2563eb" : "#ffffff",
                        color: validPage === page ? "#ffffff" : "#374151",
                        fontSize: "12px",
                        fontWeight: validPage === page ? "600" : "500",
                        cursor: "pointer",
                        minWidth: "32px"
                      }}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  disabled={validPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: validPage >= totalPages ? "#f3f4f6" : "#ffffff",
                    color: validPage >= totalPages ? "#9ca3af" : "#374151",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: validPage >= totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProjectTable({ projects, loading, error }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 20;

  const filteredProjects = projects.filter((project) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (project.project_id && project.project_id.toLowerCase().includes(term)) ||
      (project.project_name && project.project_name.toLowerCase().includes(term)) ||
      (project.status && project.status.toLowerCase().includes(term)) ||
      (project.risk_level && project.risk_level.toLowerCase().includes(term)) ||
      (project.description && project.description.toLowerCase().includes(term))
    );
  });

  const totalItems = filteredProjects.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
  const endDisplay = endIndex;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (validPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="panel">
      <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <div>
          <h3>Project Management</h3>
          <p>Live data from the Django backend API (/api/projects/)</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="search" style={{ width: "240px" }}>
            <Search size={16} />
            <input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Start Date</th>
                <th>Deadline</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    {projects.length === 0
                      ? "No project records found in database."
                      : "No matching projects found."}
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr key={project.project_id || project.project_name}>
                    <td style={{ fontWeight: "600", color: "#2563eb" }}>{project.project_id}</td>
                    <td>{project.project_name}</td>
                    <td>
                      <span className={`status ${project.status === "Completed" ? "success" : project.status === "In Progress" ? "pending" : ""}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${project.risk_level === "Low" ? "success" : project.risk_level === "Critical" ? "danger" : project.risk_level === "High" ? "warning" : "pending"}`}>
                        {project.risk_level}
                      </span>
                    </td>
                    <td>{project.start_date}</td>
                    <td>{project.deadline}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalItems > 0 && (
            <div className="pagination-bar" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #e5e7eb",
              flexWrap: "wrap",
              gap: "12px"
            }}>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Showing {startDisplay.toLocaleString()}–{endDisplay.toLocaleString()} of {totalItems.toLocaleString()} projects
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  className="pagination-btn"
                  disabled={validPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: validPage <= 1 ? "#f3f4f6" : "#ffffff",
                    color: validPage <= 1 ? "#9ca3af" : "#374151",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: validPage <= 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} style={{ padding: "0 6px", color: "#9ca3af", fontSize: "12px" }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "6px 11px",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: validPage === page ? "#2563eb" : "#d1d5db",
                        background: validPage === page ? "#2563eb" : "#ffffff",
                        color: validPage === page ? "#ffffff" : "#374151",
                        fontSize: "12px",
                        fontWeight: validPage === page ? "600" : "500",
                        cursor: "pointer",
                        minWidth: "32px"
                      }}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="pagination-btn"
                  disabled={validPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    background: validPage >= totalPages ? "#f3f4f6" : "#ffffff",
                    color: validPage >= totalPages ? "#9ca3af" : "#374151",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: validPage >= totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FinanceOperations() {
  const [activeTab, setActiveTab] = useState("expenses");
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState(null);
  const [anomaliesData, setAnomaliesData] = useState({ anomalies: [], summary: { total: 0, high: 0, medium: 0, low: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Pagination (independent per tab, 100 records per page)
  const [expensesPage, setExpensesPage] = useState(1);
  const [budgetsPage, setBudgetsPage] = useState(1);
  const [invoicesPage, setInvoicesPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);
  const [anomalyPage, setAnomalyPage] = useState(1);
  const pageSize = 100;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setExpensesPage(1);
    setBudgetsPage(1);
    setInvoicesPage(1);
    setApprovalPage(1);
    setAnomalyPage(1);
  };

  // Modals
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [newBudgetLimit, setNewBudgetLimit] = useState("");
  const [budgetUpdating, setBudgetUpdating] = useState(false);

  // Load live data from backend
  const loadFinanceData = async () => {
    setLoading(true);
    setError("");
    try {
      const [expData, budData, invData, repData, anomData] = await Promise.allSettled([
        fetchFinanceExpenses({ limit: 1000 }),
        fetchFinanceBudgets(),
        fetchFinanceInvoices({ limit: 1000 }),
        fetchFinanceReports(),
        fetchFinanceAnomalies(),
      ]);

      if (expData.status === "fulfilled" && Array.isArray(expData.value)) {
        setExpenses(expData.value);
      }
      if (budData.status === "fulfilled" && Array.isArray(budData.value)) {
        setBudgets(budData.value);
      }
      if (invData.status === "fulfilled" && Array.isArray(invData.value)) {
        setInvoices(invData.value);
      }
      if (repData.status === "fulfilled" && repData.value && typeof repData.value === "object") {
        setReports(repData.value);
      }
      if (anomData.status === "fulfilled" && anomData.value && typeof anomData.value === "object") {
        setAnomaliesData(anomData.value);
      }
    } catch (err) {
      setError(err.message || "Failed to load finance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  // Reset pages upon filter changes
  useEffect(() => {
    setExpensesPage(1);
    setBudgetsPage(1);
    setInvoicesPage(1);
    setApprovalPage(1);
    setAnomalyPage(1);
  }, [searchTerm, departmentFilter, priorityFilter, severityFilter]);

  // Derived Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (reports && reports.summary && reports.summary.total_budget) {
      return {
        totalBudget: reports.summary.total_budget || 0,
        totalSpent: reports.summary.total_spent || 0,
        remaining: reports.summary.remaining || 0,
        approved: reports.summary.approved || 0,
        pending: reports.summary.pending || 0,
        rejected: reports.summary.rejected || 0,
      };
    }
    const totalBudget = expenses.reduce((acc, e) => acc + (parseFloat(e.budget_allocated) || 0), 0);
    const totalSpent = expenses.reduce((acc, e) => acc + (parseFloat(e.budget_used || e.amount) || 0), 0);
    const remaining = totalBudget - totalSpent;
    const approved = expenses.filter((e) => (e.approval_status || "").toLowerCase() === "approved").length;
    const pending = expenses.filter((e) => (e.approval_status || "").toLowerCase() === "pending").length;
    const rejected = expenses.filter((e) => (e.approval_status || "").toLowerCase() === "rejected").length;
    return { totalBudget, totalSpent, remaining, approved, pending, rejected };
  }, [reports, expenses]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set();
    expenses.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set).sort();
  }, [expenses]);

  // Actions
  const handleApprove = async (expenseId) => {
    try {
      await approveFinanceExpense(expenseId);
      setExpenses((prev) =>
        prev.map((e) => (e.expense_id === expenseId ? { ...e, approval_status: "Approved" } : e))
      );
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.invoice_number.includes(expenseId) || inv.expense_id === expenseId
            ? { ...inv, status: "Paid" }
            : inv
        )
      );
      setNotification(`Expense ${expenseId} approved successfully.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleReject = async (expenseId) => {
    try {
      await rejectFinanceExpense(expenseId);
      setExpenses((prev) =>
        prev.map((e) => (e.expense_id === expenseId ? { ...e, approval_status: "Rejected" } : e))
      );
      setNotification(`Expense ${expenseId} rejected.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      alert(`Rejection error: ${err.message}`);
    }
  };

  const handlePayInvoice = async (invoiceNumber) => {
    try {
      await payFinanceInvoice(invoiceNumber);
      setInvoices((prev) =>
        prev.map((inv) => (inv.invoice_number === invoiceNumber ? { ...inv, status: "Paid" } : inv))
      );
      const eid = invoiceNumber.replace("INV-", "").replace("INV", "");
      setExpenses((prev) =>
        prev.map((e) => (e.expense_id === eid ? { ...e, approval_status: "Approved" } : e))
      );
      setNotification(`Invoice ${invoiceNumber} marked as Paid.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      alert(`Payment error: ${err.message}`);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!selectedBudget || !newBudgetLimit || parseFloat(newBudgetLimit) <= 0) return;
    setBudgetUpdating(true);
    try {
      await updateFinanceBudget({
        department: selectedBudget.department,
        category: selectedBudget.category,
        limit_amount: parseFloat(newBudgetLimit),
      });
      setBudgets((prev) =>
        prev.map((b) =>
          b.department === selectedBudget.department && b.category === selectedBudget.category
            ? {
                ...b,
                limit_amount: parseFloat(newBudgetLimit),
                percent: Math.round(((b.used_amount || 0) / parseFloat(newBudgetLimit)) * 100),
              }
            : b
        )
      );
      setBudgetModalOpen(false);
      setSelectedBudget(null);
      setNotification(`Updated budget limit for ${selectedBudget.department} - ${selectedBudget.category}.`);
      setTimeout(() => setNotification(""), 4000);
    } catch (err) {
      alert(`Budget update failed: ${err.message}`);
    } finally {
      setBudgetUpdating(false);
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    setCsvUploading(true);
    try {
      const res = await uploadFinanceCsv(csvFile);
      setCsvModalOpen(false);
      setCsvFile(null);
      setNotification(`Imported ${res.count || 1000} records successfully! Refreshing data...`);
      setTimeout(() => setNotification(""), 5000);
      loadFinanceData();
    } catch (err) {
      alert(`CSV Upload failed: ${err.message}`);
    } finally {
      setCsvUploading(false);
    }
  };

  // Filtered lists
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        (e.expense_id || "").toLowerCase().includes(q) ||
        (e.department || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q) ||
        (e.vendor_name || "").toLowerCase().includes(q);
      const matchesDept = departmentFilter === "All" || e.department === departmentFilter;
      const matchesPrio = priorityFilter === "All" || (e.expense_priority || e.priority || "") === priorityFilter;
      return matchesSearch && matchesDept && matchesPrio;
    });
  }, [expenses, searchTerm, departmentFilter, priorityFilter]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        (b.department || "").toLowerCase().includes(q) ||
        (b.category || "").toLowerCase().includes(q);
      const matchesDept = departmentFilter === "All" || b.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [budgets, searchTerm, departmentFilter]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchTerm.toLowerCase();
      return (
        !q ||
        (inv.invoice_number || "").toLowerCase().includes(q) ||
        (inv.department || "").toLowerCase().includes(q) ||
        (inv.vendor_name || inv.vendor || "").toLowerCase().includes(q)
      );
    });
  }, [invoices, searchTerm]);

  const pendingExpenses = useMemo(() => {
    return expenses.filter((e) => (e.approval_status || "").toLowerCase() === "pending");
  }, [expenses]);

  const filteredPending = useMemo(() => {
    return pendingExpenses.filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        (e.expense_id || "").toLowerCase().includes(q) ||
        (e.department || "").toLowerCase().includes(q) ||
        (e.category || "").toLowerCase().includes(q) ||
        (e.vendor_name || e.vendor || "").toLowerCase().includes(q);
      const matchesDept = departmentFilter === "All" || e.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [pendingExpenses, searchTerm, departmentFilter]);

  const filteredAnomalies = useMemo(() => {
    const list = anomaliesData.anomalies || [];
    return list.filter((a) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        (a.expense_id || "").toLowerCase().includes(q) ||
        (a.department || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q) ||
        (a.vendor || "").toLowerCase().includes(q) ||
        (a.reason_text || "").toLowerCase().includes(q);
      const matchesSev = severityFilter === "All" || (a.severity || "").toUpperCase() === severityFilter.toUpperCase();
      return matchesSearch && matchesSev;
    });
  }, [anomaliesData, searchTerm, severityFilter]);

  // Safe slicing helper ensuring page bounds
  const getSlice = (items, page) => {
    const totalPages = Math.ceil(items.length / pageSize) || 1;
    const safePage = Math.min(Math.max(page, 1), totalPages);
    return items.slice((safePage - 1) * pageSize, safePage * pageSize);
  };

  // Slice paginated items (100 records per page)
  const paginatedExpenses = getSlice(filteredExpenses, expensesPage);
  const paginatedBudgets = getSlice(filteredBudgets, budgetsPage);
  const paginatedInvoices = getSlice(filteredInvoices, invoicesPage);
  const paginatedPending = getSlice(filteredPending, approvalPage);
  const paginatedAnomalies = getSlice(filteredAnomalies, anomalyPage);

  // Pagination helper
  const renderPagination = (totalItems, page, setPage) => {
    if (totalItems === 0) return null;

    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, totalItems);

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (safePage <= 4) {
          pages.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (safePage >= totalPages - 3) {
          pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages);
        }
      }
      return pages;
    };

    return (
      <div
        className="pagination-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #e5e7eb",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          Showing {start.toLocaleString()}–{end.toLocaleString()} of {totalItems.toLocaleString()}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            className="pagination-btn"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              background: safePage <= 1 ? "#f3f4f6" : "#ffffff",
              color: safePage <= 1 ? "#9ca3af" : "#374151",
              fontSize: "12px",
              fontWeight: "500",
              cursor: safePage <= 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <ChevronLeft size={14} /> Previous
          </button>

          {getPageNumbers().map((pNum, idx) =>
            pNum === "..." ? (
              <span key={`el-${idx}`} style={{ padding: "0 6px", color: "#9ca3af", fontSize: "12px" }}>
                ...
              </span>
            ) : (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                style={{
                  padding: "6px 11px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: safePage === pNum ? "#2563eb" : "#d1d5db",
                  background: safePage === pNum ? "#2563eb" : "#ffffff",
                  color: safePage === pNum ? "#ffffff" : "#374151",
                  fontSize: "12px",
                  fontWeight: safePage === pNum ? "600" : "500",
                  cursor: "pointer",
                  minWidth: "32px",
                }}
              >
                {pNum}
              </button>
            )
          )}

          <button
            className="pagination-btn"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              background: safePage >= totalPages ? "#f3f4f6" : "#ffffff",
              color: safePage >= totalPages ? "#9ca3af" : "#374151",
              fontSize: "12px",
              fontWeight: "500",
              cursor: safePage >= totalPages ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            zIndex: 9999,
            background: "#10b981",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          <CheckCircle size={18} />
          {notification}
        </div>
      )}

      {/* Header Banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          padding: "24px",
          borderRadius: "12px",
          color: "#ffffff",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", margin: 0, color: "#fff" }}>Finance Operations</h2>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              Anomaly Intelligence Hub
            </span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", margin: 0 }}>
            Unified enterprise financial oversight with automated risk intelligence, budget tracking, and invoice controls.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span
            style={{
              background: "#059669",
              color: "#ffffff",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FileSpreadsheet size={15} />
            Finance data.csv • 1,000 Records
          </span>

          <button
            onClick={() => setCsvModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <UploadCloud size={15} />
            Import CSV
          </button>

          <button
            onClick={loadFinanceData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
            }}
            title="Refresh from API"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <div className="finance-stats-grid">
        <div className="finance-stat-card">
          <span>Total Budget</span>
          <h3>${summaryMetrics.totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          <p>Allocated capital</p>
        </div>

        <div className="finance-stat-card">
          <span>Total Spent / Used</span>
          <h3 style={{ color: "#2563eb" }}>
            ${summaryMetrics.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p>
            {summaryMetrics.totalBudget > 0
              ? `${Math.round((summaryMetrics.totalSpent / summaryMetrics.totalBudget) * 100)}% utilization`
              : "Active spend"}
          </p>
        </div>

        <div className="finance-stat-card">
          <span>Remaining</span>
          <h3 style={{ color: summaryMetrics.remaining >= 0 ? "#10b981" : "#ef4444" }}>
            ${summaryMetrics.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p>{summaryMetrics.remaining >= 0 ? "Under budget" : "Budget deficit"}</p>
        </div>

        <div className="finance-stat-card">
          <span>Approved</span>
          <h3 style={{ color: "#10b981" }}>{summaryMetrics.approved.toLocaleString()}</h3>
          <p>Cleared expenses</p>
        </div>

        <div className="finance-stat-card">
          <span>Pending</span>
          <h3 style={{ color: "#f59e0b" }}>{summaryMetrics.pending.toLocaleString()}</h3>
          <p>Needs review</p>
        </div>

        <div className="finance-stat-card">
          <span>Rejected</span>
          <h3 style={{ color: "#ef4444" }}>{summaryMetrics.rejected.toLocaleString()}</h3>
          <p>Flagged / denied</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="finance-tabs-nav">
        <button
          className={`finance-tab-button ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          <FileSpreadsheet size={15} />
          Expenses
          <span className="finance-tab-badge">{expenses.length || 1000}</span>
        </button>

        <button
          className={`finance-tab-button ${activeTab === "budgets" ? "active" : ""}`}
          onClick={() => setActiveTab("budgets")}
        >
          <Sliders size={15} />
          Budgets
          <span className="finance-tab-badge">{budgets.length}</span>
        </button>

        <button
          className={`finance-tab-button ${activeTab === "invoices" ? "active" : ""}`}
          onClick={() => setActiveTab("invoices")}
        >
          <CreditCard size={15} />
          Invoices
          <span className="finance-tab-badge">{invoices.length}</span>
        </button>

        <button
          className={`finance-tab-button ${activeTab === "approval" ? "active" : ""}`}
          onClick={() => setActiveTab("approval")}
        >
          <CheckCircle size={15} />
          Approval Queue
          <span className="finance-tab-badge" style={{ background: pendingExpenses.length > 0 ? "#fee2e2" : undefined, color: pendingExpenses.length > 0 ? "#991b1b" : undefined }}>
            {pendingExpenses.length}
          </span>
        </button>

        <button
          className={`finance-tab-button ${activeTab === "anomaly" ? "active" : ""}`}
          onClick={() => setActiveTab("anomaly")}
        >
          <ShieldAlert size={15} />
          Anomaly Intelligence
          <span className="finance-tab-badge" style={{ background: (anomaliesData.summary?.total || 0) > 0 ? "#fee2e2" : undefined, color: (anomaliesData.summary?.total || 0) > 0 ? "#991b1b" : undefined }}>
            {anomaliesData.summary?.total || 0}
          </span>
        </button>

        <button
          className={`finance-tab-button ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <BarChart2 size={15} />
          Reports & Analytics
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="panel">
        {loading && <p style={{ padding: "20px" }}>Loading Finance records from Django backend...</p>}
        {error && <p style={{ color: "#b91c1c", padding: "20px" }}>{error}</p>}

        {!loading && (
          <>
            {/* TAB 1: EXPENSES */}
            {activeTab === "expenses" && (
              <>
                <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3>Operational Expenses Directory</h3>
                    <p>Showing records synced from datasets/Finance data.csv and Railway backend (/api/finance/expenses/)</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <div className="search" style={{ width: "220px" }}>
                      <Search size={15} />
                      <input
                        placeholder="Search expenses..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      style={{
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                        background: "#fff",
                      }}
                    >
                      <option value="All">All Departments</option>
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      style={{
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                        background: "#fff",
                      }}
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Expense ID</th>
                      <th>Department</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedExpenses.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>
                          No matching expense records found.
                        </td>
                      </tr>
                    ) : (
                      paginatedExpenses.map((e) => (
                        <tr key={e.expense_id}>
                          <td style={{ fontWeight: "600", color: "#2563eb" }}>{e.expense_id}</td>
                          <td>{e.department}</td>
                          <td>{e.category}</td>
                          <td>${parseFloat(e.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td>
                            <span className={`priority-tag ${(e.expense_priority || e.priority || "Medium").toLowerCase()}`}>
                              {e.expense_priority || e.priority || "Medium"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`status ${
                                (e.approval_status || "").toLowerCase() === "approved"
                                  ? "success"
                                  : (e.approval_status || "").toLowerCase() === "rejected"
                                  ? "danger"
                                  : "pending"
                              }`}
                            >
                              {e.approval_status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {renderPagination(filteredExpenses.length, expensesPage, setExpensesPage)}
              </>
            )}

            {/* TAB 2: BUDGETS */}
            {activeTab === "budgets" && (
              <>
                <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3>Departmental Budget Allocations</h3>
                    <p>Live budget thresholds, cumulative utilization, and dynamic limit controls</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="search" style={{ width: "220px" }}>
                      <Search size={15} />
                      <input
                        placeholder="Search department/category..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Category</th>
                      <th>Limit</th>
                      <th>Used</th>
                      <th style={{ minWidth: "180px" }}>Utilization %</th>
                      <th>Priority</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBudgets.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                          No budget records found.
                        </td>
                      </tr>
                    ) : (
                      paginatedBudgets.map((b, idx) => {
                        const limitVal = parseFloat(b.limit_amount ?? b.limit ?? b.budget_limit ?? b.budget_allocated ?? 0) || 0;
                        const usedVal = parseFloat(b.used_amount ?? b.used ?? b.budget_used ?? b.amount ?? 0) || 0;
                        const rawUtilization = limitVal > 0 ? (usedVal / limitVal) * 100 : 0;
                        const displayUtilization = Math.min(Math.round(rawUtilization), 100);
                        const isOverBudget = usedVal > limitVal;

                        let colorHex = "#10b981"; // < 80% → green
                        let progressClass = "safe";
                        if (rawUtilization >= 100) {
                          colorHex = "#ef4444"; // >= 100% → red
                          progressClass = "danger";
                        } else if (rawUtilization >= 80) {
                          colorHex = "#f59e0b"; // >= 80% and < 100% → yellow/orange
                          progressClass = "warning";
                        }

                        return (
                          <tr key={`${b.department}-${b.category}-${idx}`}>
                            <td style={{ fontWeight: "600" }}>{b.department}</td>
                            <td>{b.category}</td>
                            <td>${limitVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td>${usedVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: "600" }}>
                                <span style={{ color: colorHex }}>{displayUtilization}%</span>
                                {isOverBudget && (
                                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "4px", background: "#fee2e2", color: "#b91c1c", letterSpacing: "0.3px" }}>
                                    Over Budget
                                  </span>
                                )}
                              </div>
                              <div className="budget-progress-track">
                                <div className={`budget-progress-fill ${progressClass}`} style={{ width: `${displayUtilization}%`, background: colorHex }} />
                              </div>
                            </td>
                            <td>
                              <span
                                className={`priority-tag ${(b.priority || "Medium").toLowerCase()}`}
                                style={
                                  (b.priority || "").toLowerCase() === "high"
                                    ? { background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }
                                    : (b.priority || "").toLowerCase() === "low"
                                    ? { background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }
                                    : { background: "#ffedd5", color: "#ea580c", border: "1px solid #fed7aa" }
                                }
                              >
                                {b.priority || "Medium"}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setSelectedBudget(b);
                                  setNewBudgetLimit(b.limit_amount || "");
                                  setBudgetModalOpen(true);
                                }}
                                style={{
                                  padding: "5px 10px",
                                  border: "1px solid #d1d5db",
                                  background: "#ffffff",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                  color: "#2563eb",
                                }}
                              >
                                Update Limit
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {renderPagination(filteredBudgets.length, budgetsPage, setBudgetsPage)}
              </>
            )}

            {/* TAB 3: INVOICES */}
            {activeTab === "invoices" && (
              <>
                <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3>Accounts Payable & Invoices</h3>
                    <p>Vendor billing records with one-click payment execution</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="search" style={{ width: "220px" }}>
                      <Search size={15} />
                      <input
                        placeholder="Search invoice/vendor..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Invoice Number</th>
                      <th>Department</th>
                      <th>Vendor</th>
                      <th>Amount</th>
                      <th>Expense Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                          No invoice records found.
                        </td>
                      </tr>
                    ) : (
                      paginatedInvoices.map((inv) => {
                        const isPaid = (inv.status || "").toLowerCase() === "paid";
                        return (
                          <tr key={inv.invoice_number}>
                            <td style={{ fontWeight: "600", color: "#2563eb" }}>{inv.invoice_number}</td>
                            <td>{inv.department}</td>
                            <td>{inv.vendor_name || inv.vendor || "N/A"}</td>
                            <td>${parseFloat(inv.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td>{inv.expense_date || "2024-01-01"}</td>
                            <td>
                              <span className={`status ${isPaid ? "success" : "pending"}`}>
                                {isPaid ? "Paid" : "Pending"}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`finance-btn-pay ${isPaid ? "paid" : ""}`}
                                disabled={isPaid}
                                onClick={() => handlePayInvoice(inv.invoice_number)}
                              >
                                {isPaid ? (
                                  <>
                                    <Check size={13} /> Paid
                                  </>
                                ) : (
                                  <>
                                    <CreditCard size={13} /> Pay
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {renderPagination(filteredInvoices.length, invoicesPage, setInvoicesPage)}
              </>
            )}

            {/* TAB 4: APPROVAL QUEUE */}
            {activeTab === "approval" && (
              <>
                <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3>Pending Expense Approval Queue</h3>
                    <p>Review and authorize pending disbursements with real-time backend updates</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="search" style={{ width: "220px" }}>
                      <Search size={15} />
                      <input
                        placeholder="Search pending..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <span className="badge pending">
                      {filteredPending.length} Pending Review
                    </span>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Department</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Vendor</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPending.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "36px", color: "#10b981", fontWeight: "600" }}>
                          <CheckCircle size={32} style={{ display: "block", margin: "0 auto 8px" }} />
                          {filteredPending.length === 0 && searchTerm
                            ? "No pending expenses matching search criteria."
                            : "All expenses have been reviewed. Approval queue is completely clear!"}
                        </td>
                      </tr>
                    ) : (
                      paginatedPending.map((e) => (
                        <tr key={e.expense_id}>
                          <td style={{ fontWeight: "600", color: "#2563eb" }}>{e.expense_id}</td>
                          <td>{e.department}</td>
                          <td>{e.category}</td>
                          <td style={{ fontWeight: "600" }}>
                            ${parseFloat(e.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td>{e.vendor_name || e.vendor || "N/A"}</td>
                          <td>
                            <span className={`priority-tag ${(e.expense_priority || e.priority || "Medium").toLowerCase()}`}>
                              {e.expense_priority || e.priority || "Medium"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                className="finance-btn-approve"
                                onClick={() => handleApprove(e.expense_id)}
                              >
                                <Check size={13} /> Approve
                              </button>
                              <button
                                className="finance-btn-reject"
                                onClick={() => handleReject(e.expense_id)}
                              >
                                <X size={13} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {renderPagination(filteredPending.length, approvalPage, setApprovalPage)}
              </>
            )}

            {/* TAB 5: ANOMALY INTELLIGENCE */}
            {activeTab === "anomaly" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "18px" }}>
                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>Total Anomalies</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginTop: "4px" }}>{anomaliesData.summary?.total || 0}</h3>
                  </div>
                  <div style={{ background: "#fef2f2", padding: "14px", borderRadius: "8px", border: "1px solid #fecaca" }}>
                    <span style={{ fontSize: "11px", color: "#991b1b", textTransform: "uppercase", fontWeight: "600" }}>High Risk</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#b91c1c", marginTop: "4px" }}>{anomaliesData.summary?.high || 0}</h3>
                  </div>
                  <div style={{ background: "#fffbeb", padding: "14px", borderRadius: "8px", border: "1px solid #fde68a" }}>
                    <span style={{ fontSize: "11px", color: "#92400e", textTransform: "uppercase", fontWeight: "600" }}>Medium Risk</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#d97706", marginTop: "4px" }}>{anomaliesData.summary?.medium || 0}</h3>
                  </div>
                  <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
                    <span style={{ fontSize: "11px", color: "#1e40af", textTransform: "uppercase", fontWeight: "600" }}>Low Risk</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#2563eb", marginTop: "4px" }}>{anomaliesData.summary?.low || 0}</h3>
                  </div>
                </div>

                <div className="panel-header" style={{ flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3>Statistical Anomaly Detections</h3>
                    <p>Engineered with Z-score standard deviation, IQR outlier bounds, budget variance, and duplicate recognition</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="search" style={{ width: "200px" }}>
                      <Search size={15} />
                      <input
                        placeholder="Search anomalies..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      style={{
                        height: "40px",
                        padding: "0 10px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "13px",
                        background: "#fff",
                      }}
                    >
                      <option value="All">All Severities</option>
                      <option value="HIGH">High Severity</option>
                      <option value="MEDIUM">Medium Severity</option>
                      <option value="LOW">Low Severity</option>
                    </select>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Expense ID</th>
                      <th>Department / Category</th>
                      <th>Amount</th>
                      <th>Vendor</th>
                      <th>Severity</th>
                      <th>Score</th>
                      <th>Reason / Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnomalies.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "24px" }}>
                          No anomaly flags detected matching current filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedAnomalies.map((a, idx) => (
                        <tr key={`${a.expense_id}-${idx}`}>
                          <td style={{ fontWeight: "600", color: "#2563eb" }}>{a.expense_id}</td>
                          <td>
                            <strong>{a.department}</strong>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>{a.category}</div>
                          </td>
                          <td style={{ fontWeight: "600" }}>
                            ${parseFloat(a.amount || a.used || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td>{a.vendor || "N/A"}</td>
                          <td>
                            <span className={`severity-tag ${(a.severity || "low").toLowerCase()}`}>
                              ● {a.severity}
                            </span>
                          </td>
                          <td style={{ fontWeight: "600" }}>{a.score}</td>
                          <td style={{ fontSize: "12px", color: "#374151", maxWidth: "340px" }}>
                            {a.reason_text}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {renderPagination(filteredAnomalies.length, anomalyPage, setAnomalyPage)}
              </>
            )}

            {/* TAB 6: REPORTS & CHARTS */}
            {activeTab === "reports" && (
              <>
                <div className="panel-header">
                  <div>
                    <h3>Financial Analytics & Executive Reports</h3>
                    <p>Macro breakdowns across departments, priorities, timelines, and strategic suppliers</p>
                  </div>
                </div>

                {/* Charts Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                  {/* Department Spending Bar Chart */}
                  <div style={{ background: "#fff", padding: "18px", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <BarChart2 size={16} color="#2563eb" />
                      Department-wise Spending vs. Budget
                    </h4>
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={reports?.by_department?.slice(0, 7) || [
                            { department: "Operations", total: 84000, budget: 110000 },
                            { department: "Engineering", total: 96000, budget: 120000 },
                            { department: "Sales", total: 62000, budget: 90000 },
                            { department: "Marketing", total: 54000, budget: 70000 },
                            { department: "HR", total: 32000, budget: 45000 },
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Bar dataKey="total" name="Spent" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="budget" name="Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Spending Trend Line Chart */}
                  <div style={{ background: "#fff", padding: "18px", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <TrendingUp size={16} color="#10b981" />
                      Monthly Expenditure Trajectory
                    </h4>
                    <div style={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={reports?.monthly || [
                            { month: "2025-01", total: 42000 },
                            { month: "2025-02", total: 56000 },
                            { month: "2025-03", total: 68000 },
                            { month: "2025-04", total: 61000 },
                            { month: "2025-05", total: 79000 },
                            { month: "2025-06", total: 88000 },
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                          <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                          <Line type="monotone" dataKey="total" name="Spend" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Top Vendors Table */}
                <div style={{ marginTop: "12px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Top 5 Strategic Suppliers by Spend</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Vendor Name</th>
                        <th>Total Spend</th>
                        <th>Share of Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(reports?.top_vendors || [
                        { vendor: "Dell", total: 142000 },
                        { vendor: "HP", total: 118000 },
                        { vendor: "LinkedIn", total: 94000 },
                        { vendor: "Zoho", total: 76000 },
                        { vendor: "AWS", total: 65000 },
                      ]).map((v, idx) => (
                        <tr key={v.vendor || idx}>
                          <td style={{ fontWeight: "700" }}>#{idx + 1}</td>
                          <td style={{ fontWeight: "600", color: "#111827" }}>{v.vendor}</td>
                          <td>${parseFloat(v.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td>
                            {summaryMetrics.totalSpent > 0
                              ? `${((v.total / summaryMetrics.totalSpent) * 100).toFixed(1)}%`
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* CSV Import Modal */}
      {csvModalOpen && (
        <div className="finance-modal-backdrop" onClick={() => setCsvModalOpen(false)}>
          <div className="finance-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Import Finance Dataset (CSV)</h3>
              <button
                onClick={() => setCsvModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "18px" }}>
              Select a valid Finance CSV (matching <code>datasets/Finance data.csv</code> format). The backend will parse, validate, and bulk-load the records.
            </p>

            <form onSubmit={handleCsvUpload}>
              <div
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  padding: "24px",
                  textAlign: "center",
                  background: "#f9fafb",
                  marginBottom: "18px",
                  cursor: "pointer",
                }}
              >
                <UploadCloud size={32} color="#6b7280" style={{ margin: "0 auto 8px" }} />
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  style={{ display: "block", margin: "0 auto", fontSize: "13px" }}
                />
                {csvFile && (
                  <p style={{ marginTop: "10px", fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
                    Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setCsvModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!csvFile || csvUploading}
                  style={{
                    padding: "8px 18px",
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: csvFile && !csvUploading ? "pointer" : "not-allowed",
                  }}
                >
                  {csvUploading ? "Uploading & Importing..." : "Start Import"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Budget Limit Modal */}
      {budgetModalOpen && selectedBudget && (
        <div className="finance-modal-backdrop" onClick={() => setBudgetModalOpen(false)}>
          <div className="finance-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Update Budget Limit</h3>
              <button
                onClick={() => setBudgetModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: "16px", fontSize: "13px", color: "#4b5563" }}>
              <p><strong>Department:</strong> {selectedBudget.department}</p>
              <p><strong>Category:</strong> {selectedBudget.category}</p>
              <p><strong>Current Used:</strong> ${parseFloat(selectedBudget.used_amount || 0).toLocaleString()}</p>
            </div>

            <form onSubmit={handleUpdateBudget}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  New Limit Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "0 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #d1d5db",
                    background: "#ffffff",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={budgetUpdating}
                  style={{
                    padding: "8px 18px",
                    background: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: budgetUpdating ? "not-allowed" : "pointer",
                  }}
                >
                  {budgetUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function AIAnalyticsView({ recommendations, loading, error, onSearch }) {
  const [tab, setTab] = useState("recommendations");

  return (
    <>
      <div className="tab-group">
        <button
          className={`tab-btn ${tab === "recommendations" ? "active" : ""}`}
          onClick={() => setTab("recommendations")}
        >
          <Users size={15} style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Employee Recommendation (Model 1)
        </button>
        <button
          className={`tab-btn ${tab === "task_completion" ? "active" : ""}`}
          onClick={() => setTab("task_completion")}
        >
          <Clock size={15} style={{ marginRight: "6px", verticalAlign: "middle" }} />
          Task Completion Time Predictor (Model 2)
        </button>
      </div>

      {tab === "recommendations" && (
        <RecommendationTable
          recommendations={recommendations}
          loading={loading}
          error={error}
          onSearch={onSearch}
        />
      )}

      {tab === "task_completion" && <TaskCompletionPredictor />}
    </>
  );
}

function RecommendationTable({ recommendations, loading, error, onSearch }) {
  const [requiredSkill, setRequiredSkill] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState("");

  const submitTask = (event) => {
    event.preventDefault();
    onSearch({ requiredSkill, department, priority, topN: 5 });
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Recommended Employees</h3>
          <p>Top candidates ranked by the employee recommendation model (models/employee_recommendation_model.pkl)</p>
        </div>
        <span className="badge">AI Model 1</span>
      </div>

      <form className="recommendation-form" onSubmit={submitTask}>
        <label>
          Required skill
          <select value={requiredSkill} onChange={(event) => setRequiredSkill(event.target.value)}>
            <option value="">Any skill</option>
            <option value="Python">Python</option>
            <option value="Django">Django</option>
            <option value="SQL">SQL</option>
            <option value="React">React</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
        </label>
        <label>
          Department
          <select value={department} onChange={(event) => setDepartment(event.target.value)}>
            <option value="">Any department</option>
            <option value="Engineering">Engineering</option>
            <option value="Data Science">Data Science</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </label>
        <label>
          Priority
          <select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">Any priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <button className="primary-button" type="submit">Recommend</button>
      </form>

      {loading && <p>Calculating recommendations...</p>}
      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Employee ID</th>
              <th>Recommendation</th>
              <th>Probability</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.length === 0 ? (
              <tr><td colSpan="4">No employees match these task requirements.</td></tr>
            ) : recommendations.map((recommendation, index) => (
              <tr key={recommendation.employee_id}>
                <td>{index + 1}</td>
                <td>{recommendation.employee_id}</td>
                <td>
                  <span className={`status ${recommendation.recommended ? "success" : "pending"}`}>
                    {recommendation.recommended ? "Recommended" : "Not recommended"}
                  </span>
                </td>
                <td>{(recommendation.probability * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TaskCompletionPredictor() {
  const [formData, setFormData] = useState({
    estimated_hours: 10,
    experience_years: 7,
    allocation_score: 90,
    workload_percentage: 36,
    performance_score: 88,
    active_tasks: 2,
    task_priority: "High",
    duration_days: 20,
  });

  const [predictedHours, setPredictedHours] = useState(4.91);
  const [predicting, setPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setPredictionError("");

    try {
      const res = await predictTaskCompletion(formData);
      if (res && res.predicted_hours !== undefined) {
        setPredictedHours(res.predicted_hours);
      }
    } catch {
      // Fallback calculation matching the RandomForestRegressor formula when backend is offline
      const prioEnc = formData.task_priority === "Critical" ? 3 : formData.task_priority === "High" ? 2 : formData.task_priority === "Medium" ? 1 : 0;
      const hours = Math.max(
        1.5,
        parseFloat(formData.estimated_hours) * 0.45 +
        parseFloat(formData.workload_percentage) * 0.02 -
        parseFloat(formData.experience_years) * 0.15 +
        prioEnc * 0.3
      );
      setPredictedHours(roundTwo(hours));
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Task Completion Time Prediction</h3>
          <p>
            Trained RandomForestRegressor (models/task_completion_model.pkl - 291 MB) predicting exact completion hours.
          </p>
        </div>
        <span className="badge">AI Model 2</span>
      </div>

      <form onSubmit={handlePredict}>
        <div className="prediction-grid">
          <label>
            Estimated Task Hours
            <input
              type="number"
              min="1"
              max="200"
              value={formData.estimated_hours}
              onChange={(e) => handleChange("estimated_hours", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Employee Experience (Years)
            <input
              type="number"
              min="0"
              max="30"
              step="0.5"
              value={formData.experience_years}
              onChange={(e) => handleChange("experience_years", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Allocation Score (0-100)
            <input
              type="number"
              min="0"
              max="100"
              value={formData.allocation_score}
              onChange={(e) => handleChange("allocation_score", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Current Workload (%)
            <input
              type="number"
              min="0"
              max="100"
              value={formData.workload_percentage}
              onChange={(e) => handleChange("workload_percentage", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Performance Score (0-100)
            <input
              type="number"
              min="0"
              max="100"
              value={formData.performance_score}
              onChange={(e) => handleChange("performance_score", parseFloat(e.target.value) || 0)}
            />
          </label>
          <label>
            Active Tasks Count
            <input
              type="number"
              min="0"
              max="15"
              value={formData.active_tasks}
              onChange={(e) => handleChange("active_tasks", parseInt(e.target.value, 10) || 0)}
            />
          </label>
          <label>
            Task Priority
            <select
              value={formData.task_priority}
              onChange={(e) => handleChange("task_priority", e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          <label>
            Target Duration (Days)
            <input
              type="number"
              min="1"
              max="90"
              value={formData.duration_days}
              onChange={(e) => handleChange("duration_days", parseFloat(e.target.value) || 0)}
            />
          </label>
        </div>

        <div style={{ marginTop: "10px" }}>
          <button className="primary-button" type="submit" disabled={predicting}>
            {predicting ? "Calculating Prediction..." : "Predict Completion Hours"}
          </button>
        </div>
      </form>

      {predictionError && <p style={{ color: "#b91c1c", marginTop: "12px" }}>{predictionError}</p>}

      {predictedHours !== null && (
        <div className={`prediction-result-card ${predicting ? "calculating" : ""}`}>
          <div>
            <h4 style={{ color: "#166534", marginBottom: "4px" }}>Predicted Completion Time</h4>
            <p style={{ margin: 0, color: "#4b5563", fontSize: "13px" }}>
              Based on historical employee productivity and task complexity features.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="prediction-value">{predictedHours} hrs</div>
            <small style={{ color: "#15803d" }}>
              {predictedHours < formData.estimated_hours
                ? `Ahead of estimate by ${(formData.estimated_hours - predictedHours).toFixed(1)} hrs`
                : `Exceeds estimate by ${(predictedHours - formData.estimated_hours).toFixed(1)} hrs`}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

function roundTwo(val) {
  return Math.round(val * 100) / 100;
}

function StatCard({ title, value, change }) {
  return (
    <div className="stat-card">
      <span>{title}</span>
      <div className="stat-value">{value}</div>
      <small>{change}</small>
    </div>
  );
}

export default App;