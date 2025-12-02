// src/pages/AdminHome.jsx
import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const MENU = {
  ANNOUNCEMENT: 'announcement',
  EMPLOYEES: 'employees',
  LEAVES: 'leaves',
};


const AdminHome = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(MENU.ANNOUNCEMENT);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case MENU.ANNOUNCEMENT:
        return <AnnouncementPanel />;
      case MENU.EMPLOYEES:
        return <EmployeeManagementPanel />;
      case MENU.LEAVES:
        return <AdminLeavePanel />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* 左侧菜单 */}
      <aside
        style={{
          width: 220,
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
          padding: '16px 12px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
          管理员控制台
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Admin Console
          </div>
        </div>

        <MenuItem
          active={activeMenu === MENU.ANNOUNCEMENT}
          onClick={() => setActiveMenu(MENU.ANNOUNCEMENT)}
        >
          公告管理 / Announcements
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU.EMPLOYEES}
          onClick={() => setActiveMenu(MENU.EMPLOYEES)}
        >
          员工管理 / Employees
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU.LEAVES}
          onClick={() => setActiveMenu(MENU.LEAVES)}
        >
          请假管理 / Leave Approvals
        </MenuItem>


        <div style={{ borderTop: '1px solid #e0e0e0', marginTop: 24, paddingTop: 16 }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: 4,
              border: '1px solid #d32f2f',
              backgroundColor: '#fff',
              color: '#d32f2f',
              cursor: 'pointer',
            }}
          >
            退出登录 / Logout
          </button>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <main
        style={{
          flex: 1,
          padding: 24,
          boxSizing: 'border-box',
          overflowY: 'auto',
          backgroundColor: '#fafafa',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminHome;

/* ================== 公共菜单组件 ================== */

const MenuItem = ({ active, children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '10px 12px',
      marginBottom: 4,
      borderRadius: 4,
      cursor: 'pointer',
      fontSize: 14,
      backgroundColor: active ? '#1677ff' : 'transparent',
      color: active ? '#fff' : '#333',
    }}
  >
    {children}
  </div>
);

/* ================== 公告管理面板 ================== */

const AnnouncementPanel = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      // 员工端列表接口也可以给管理员用
      const res = await api.get('/api/employee/announcement');
      setAnnouncements(res.data || []);
    } catch (e) {
      console.error(e);
      alert('加载公告失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('标题不能为空');
      return;
    }
    try {
      await api.post('/api/admin/announcement', { title, content });
      setTitle('');
      setContent('');
      await loadAnnouncements();
    } catch (e) {
      console.error(e);
      alert('发布公告失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>公告管理 / Announcement Management</h2>
      <div style={{ color: '#777', marginBottom: 20 }}>
        管理员可以在此发布公告，员工端会读取这些信息。
      </div>

      {/* 发布公告表单 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>发布公告 / Create Announcement</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>标题 / Title</label>
            <div>
              <input
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>内容 / Content</label>
            <div>
              <textarea
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: '#1677ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            提交 / Submit
          </button>
        </form>
      </section>

      {/* 公告列表 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>现有公告 / Existing Announcements</h3>
        {loading ? (
          <div>加载中...</div>
        ) : announcements.length === 0 ? (
          <div>暂无公告 / No announcements.</div>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {announcements.map((a) => (
              <li key={a.id} style={{ marginBottom: 6 }}>
                <strong>{a.title}</strong>
                {a.content ? ` — ${a.content}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

/* ================== 员工管理面板 ================== */

const EmployeeManagementPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // ★ 新增：上级候选列表
  const [managers, setManagers] = useState([]);

  // 新增员工表单
  const [form, setForm] = useState({
    username: '',
    password: '',
    realName: '',
    department: '',
    position: '',
    hireDate: '',
    level: '',
    baseSalary: '',
    status: 'ACTIVE',
    phone: '',
    email: '',
    managerId: '', // ★ 新增字段
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/users', {
        params: { page: 0, size: 50 },
      });
      const data = res.data;
      const list = Array.isArray(data) ? data : data.content || [];
      setEmployees(list);
    } catch (e) {
      console.error(e);
      alert('加载员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  // ★ 新增：加载可选上级列表
  const loadManagers = async () => {
    try {
      const res = await api.get('/api/admin/meta/managers');
      setManagers(res.data || []);
    } catch (e) {
      console.error(e);
      // 不强制提示，可以静默失败
    }
  };

  useEffect(() => {
    loadEmployees();
    loadManagers(); // ★ 同时加载上级列表
  }, []);

  // 新增员工
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim() || !form.realName.trim()) {
      alert('用户名、密码、姓名为必填');
      return;
    }
    try {
      await api.post('/api/admin/users', {
        ...form,
        baseSalary: form.baseSalary ? Number(form.baseSalary) : null,
        managerId: form.managerId ? Number(form.managerId) : null, // ★ 带上上级ID
      });
      alert('新增员工成功');
      // 清空表单
      setForm({
        username: '',
        password: '',
        realName: '',
        department: '',
        position: '',
        hireDate: '',
        level: '',
        baseSalary: '',
        status: 'ACTIVE',
        phone: '',
        email: '',
        managerId: '',
      });
      await loadEmployees();
    } catch (e) {
      console.error(e);
      alert('新增员工失败');
    }
  };

  // 删除员工（原逻辑不变）
  const handleDelete = async (id, username) => {
    const current = user.username || '';
    if (current && current === username) {
      alert('不允许删除当前登录账号');
      return;
    }

    if (!window.confirm(`确认要删除员工【${username}】吗？`)) {
      return;
    }

    try {
      await api.delete(`/api/admin/users/${id}`);
      alert('删除成功');
      await loadEmployees();
    } catch (e) {
      console.error(e);
      alert('删除失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>员工管理 / Employee Management</h2>
      <div style={{ color: '#777', marginBottom: 20 }}>
        管理员工基本档案信息，一部分字段在员工端只读展示。
      </div>

      {/* 新增员工表单 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>新增员工 / Create Employee</h3>
        <form onSubmit={handleSubmit}>
          {/* 第一行：账号+密码+姓名 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="用户名 / Username *"
              value={form.username}
              onChange={(v) => handleChange('username', v)}
            />
            <LabeledInput
              type="password"
              label="初始密码 / Password *"
              value={form.password}
              onChange={(v) => handleChange('password', v)}
            />
            <LabeledInput
              label="姓名 / Name *"
              value={form.realName}
              onChange={(v) => handleChange('realName', v)}
            />
          </div>

          {/* 第二行：部门 职位 入职日期 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="部门 / Department"
              value={form.department}
              onChange={(v) => handleChange('department', v)}
            />
            <LabeledInput
              label="职位 / Position"
              value={form.position}
              onChange={(v) => handleChange('position', v)}
            />
            <LabeledInput
              type="date"
              label="入职日期 / Hire Date"
              value={form.hireDate}
              onChange={(v) => handleChange('hireDate', v)}
            />
          </div>

          {/* 第三行：职级 工资 状态 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="职级 / Level"
              value={form.level}
              onChange={(v) => handleChange('level', v)}
            />
            <LabeledInput
              label="基础工资 / Base Salary"
              value={form.baseSalary}
              onChange={(v) => handleChange('baseSalary', v)}
            />
            <div>
              <div style={{ marginBottom: 4 }}>状态 / Status</div>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              >
                <option value="ACTIVE">在职 / ACTIVE</option>
                <option value="LEFT">离职 / LEFT</option>
              </select>
            </div>
          </div>

          {/* 第四行：联系方式 + 直属上级 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <LabeledInput
              label="手机 / Phone"
              value={form.phone}
              onChange={(v) => handleChange('phone', v)}
            />
            <LabeledInput
              label="邮箱 / Email"
              value={form.email}
              onChange={(v) => handleChange('email', v)}
            />
            {/* ★ 直属上级选择 */}
            <div>
              <div style={{ marginBottom: 4 }}>直属上级 / Manager</div>
              <select
                value={form.managerId}
                onChange={(e) => handleChange('managerId', e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">（可不选）</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.realName} ({m.username})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: '#1677ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            保存 / Save
          </button>
        </form>
      </section>

      {/* 员工列表 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>员工列表 / Employee List</h3>
        {loading ? (
          <div>加载中...</div>
        ) : employees.length === 0 ? (
          <div>暂无员工数据</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>用户名</th>
                <th>姓名</th>
                <th>部门</th>
                <th>职位</th>
                <th>上级</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 8 }}>
                    暂无员工
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.username}</td>
                    <td>{emp.realName}</td>
                    <td>{emp.department || '-'}</td>
                    <td>{emp.position || '-'}</td>
                    <td>{emp.managerName || '-'}</td>
                    <td><button
                      style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: '1px solid #d32f2f',
                        backgroundColor: '#fff',
                        color: '#d32f2f',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(emp.id, emp.username)}
                    >
                      删除
                    </button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};


/* ================== 小工具组件 ================== */

const LabeledInput = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <div style={{ marginBottom: 4 }}>{label}</div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: 8,
        borderRadius: 4,
        border: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    />
  </div>
);

const AdminLeavePanel = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/leaves/pending');
      setList(res.data || []);
    } catch (e) {
      console.error(e);
      alert('加载请假数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (item, decision) => {
    const defaultMsg = decision === 'APPROVE' ? '同意' : '拒绝';
    const comment = window.prompt('请输入审批意见（可留空）', defaultMsg) ?? '';

    const url =
      decision === 'APPROVE'
        ? `/api/employee/leaves/${item.id}/approve`
        : `/api/employee/leaves/${item.id}/reject`;

    try {
      await api.post(url, { comment });
      alert('操作成功');
      await loadData();
    } catch (e) {
      console.error(e);
      alert('操作失败');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>请假管理 / Leave Management</h2>
      <div style={{ color: '#777', marginBottom: 20 }}>
        查看所有待处理的请假单，管理员可以统一审批。
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : list.length === 0 ? (
        <div>暂无待审批的请假单</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <Th>编号</Th>
              <Th>申请人</Th>
              <Th>类型</Th>
              <Th>开始日期</Th>
              <Th>结束日期</Th>
              <Th>当前审批人</Th>
              <Th>操作</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.applicantName || item.applicant}</Td>
                <Td>{item.type}</Td>
                <Td>{item.startDate}</Td>
                <Td>{item.endDate}</Td>
                <Td>{item.approverName || item.approver}</Td>
                <Td>
                  <button
                    style={{
                      marginRight: 8,
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid #4caf50',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDecision(item, 'APPROVE')}
                  >
                    通过
                  </button>
                  <button
                    style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      border: '1px solid #f44336',
                      backgroundColor: '#fff',
                      color: '#f44336',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDecision(item, 'REJECT')}
                  >
                    拒绝
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Th = ({ children }) => (
  <th
    style={{
      borderBottom: '1px solid #e0e0e0',
      textAlign: 'left',
      padding: '6px 4px',
    }}
  >
    {children}
  </th>
);

const Td = ({ children }) => (
  <td
    style={{
      borderBottom: '1px solid #f0f0f0',
      padding: '6px 4px',
    }}
  >
    {children}
  </td>
);