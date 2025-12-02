// src/pages/EmployeeHome.jsx
import React, { useEffect, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// 左侧菜单 key
const MENU_KEYS = {
  PROFILE: 'profile',
  SALARY: 'salary',
  REQUESTS: 'requests',
  ATTENDANCE: 'attendance',
  MESSAGES: 'messages',
};

const EmployeeHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const username = user?.username;

  const [activeMenu, setActiveMenu] = useState(MENU_KEYS.PROFILE);

  // 个人中心数据
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/employee/profile/${username}`);
        setProfile(res.data);
      } catch (e) {
        console.error(e);
        alert('加载个人信息失败');
      }
    };

    fetchProfile();
  }, [username]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = async () => {
    try {
      await api.put(`/api/employee/profile/${username}`, {
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
      });
      setEditing(false);
      alert('保存成功 / Saved');
    } catch (e) {
      console.error(e);
      alert('保存失败');
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case MENU_KEYS.PROFILE:
        return (
          <ProfilePanel
            profile={profile}
            editing={editing}
            onChange={handleProfileChange}
            onSave={handleProfileSave}
            onEdit={() => setEditing(true)}
            onCancel={() => setEditing(false)}
          />
        );
      case MENU_KEYS.SALARY:
        return <PlaceholderPanel title="我的工资 / My Salary" />;
      case MENU_KEYS.REQUESTS:
        return <LeaveRequestPanel />;
      case MENU_KEYS.ATTENDANCE:
        return <AttendancePanel />;
      case MENU_KEYS.MESSAGES:
        return <PlaceholderPanel title="留言互动 / Messages & Comments" />;
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
          员工工作台
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Employee Portal
          </div>
        </div>

        <MenuItem
          active={activeMenu === MENU_KEYS.PROFILE}
          onClick={() => setActiveMenu(MENU_KEYS.PROFILE)}
        >
          个人中心 / Profile
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU_KEYS.SALARY}
          onClick={() => setActiveMenu(MENU_KEYS.SALARY)}
        >
          我的工资 / Salary
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU_KEYS.REQUESTS}
          onClick={() => setActiveMenu(MENU_KEYS.REQUESTS)}
        >
          申请与审批 / Requests
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU_KEYS.ATTENDANCE}
          onClick={() => setActiveMenu(MENU_KEYS.ATTENDANCE)}
        >
          考勤记录 / Attendance
        </MenuItem>

        <MenuItem
          active={activeMenu === MENU_KEYS.MESSAGES}
          onClick={() => setActiveMenu(MENU_KEYS.MESSAGES)}
        >
          留言互动 / Messages
        </MenuItem>

        <div
          style={{
            borderTop: '1px solid #e0e0e0',
            marginTop: 24,
            paddingTop: 16,
          }}
        >
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

      {/* 右侧内容 */}
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

export default EmployeeHome;

/* ---------- 左侧菜单组件 ---------- */

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

/* ---------- 个人中心组件 ---------- */

const ProfilePanel = ({ profile, editing, onChange, onSave, onEdit, onCancel }) => {
  if (!profile) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>个人中心 / Personal Center</h2>
      <div style={{ color: '#777', marginBottom: 20 }}>
        查看和维护个人档案与联系方式。
      </div>

      {/* 基本信息 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          marginBottom: 24,
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>基本信息 / Basic Info</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            rowGap: 8,
          }}
        >
          <Field label="账号 / Username" value={profile.username} />
          <Field label="姓名 / Name" value={profile.realName || '-'} />
          <Field label="部门 / Department" value={profile.department || '-'} />
          <Field label="职位 / Position" value={profile.position || '-'} />
          <Field label="入职日期 / Hire Date" value={profile.hireDate || '-'} />
          <Field label="职级 / Level" value={profile.level || '-'} />
          <Field
            label="基础工资 / Base Salary"
            value={profile.baseSalary ?? '-'}
          />
          <Field label="状态 / Status" value={profile.status || '-'} />
        </div>
      </section>

      {/* 联系方式 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>联系方式 / Contact Info</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr',
            rowGap: 10,
          }}
        >
          <EditField
            label="手机 / Phone"
            value={profile.phone || ''}
            editing={editing}
            onChange={(v) => onChange('phone', v)}
          />
          <EditField
            label="邮箱 / Email"
            value={profile.email || ''}
            editing={editing}
            onChange={(v) => onChange('email', v)}
          />
          <EditField
            label="地址 / Address"
            value={profile.address || ''}
            editing={editing}
            onChange={(v) => onChange('address', v)}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          {editing ? (
            <>
              <button
                onClick={onSave}
                style={{
                  marginRight: 8,
                  padding: '6px 16px',
                  borderRadius: 4,
                  border: 'none',
                  backgroundColor: '#1677ff',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                保存 / Save
              </button>
              <button
                onClick={onCancel}
                style={{
                  padding: '6px 16px',
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                }}
              >
                取消 / Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              style={{
                padding: '6px 16px',
                borderRadius: 4,
                border: '1px solid #1677ff',
                backgroundColor: '#fff',
                color: '#1677ff',
                cursor: 'pointer',
              }}
            >
              编辑联系方式 / Edit Contact
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

// ---------- 申请与审批：请假面板 ----------
const LeaveRequestPanel = () => {
  const [form, setForm] = useState({
    type: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  // 我的请假记录
  const [myList, setMyList] = useState([]);
  // 待我审批的请假记录（我作为上级）
  const [todoList, setTodoList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [myRes, todoRes] = await Promise.all([
        api.get('/api/employee/leave/my'),
        api.get('/api/employee/leave/to-approve'),
      ]);
      setMyList(myRes.data || []);
      setTodoList(todoRes.data || []);
    } catch (e) {
      console.error(e);
      alert('加载请假记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      alert('开始日期、结束日期、请假原因不能为空');
      return;
    }
    if (form.endDate < form.startDate) {
      alert('结束日期不能早于开始日期');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/employee/leave', {
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });
      alert('提交成功');
      setForm({
        type: 'ANNUAL',
        startDate: '',
        endDate: '',
        reason: '',
      });
      await loadData();
    } catch (e) {
      console.error(e);
      alert('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 审批操作（通过 / 拒绝）
  const handleDecision = async (item, decision) => {
    const defaultMsg = decision === 'APPROVE' ? '同意' : '拒绝';
    const comment = window.prompt('请输入审批意见（可留空）', defaultMsg) ?? '';

    const url =
      decision === 'APPROVE'
        ? `/api/employee/leave/${item.id}/approve`
        : `/api/employee/leave/${item.id}/reject`;

    try {
      await api.post(url, { comment });
      alert('操作成功');
      await loadData();
    } catch (e) {
      console.error(e);
      alert('操作失败');
    }
  };

  const renderStatus = (status) => {
    if (!status) return '-';
    switch (status) {
      case 'PENDING':
        return '待审批 / Pending';
      case 'APPROVED':
        return '已通过 / Approved';
      case 'REJECTED':
        return '已拒绝 / Rejected';
      default:
        return status;
    }
  };

  const renderType = (type) => {
    switch (type) {
      case 'ANNUAL':
        return '年假 / Annual';
      case 'SICK':
        return '病假 / Sick';
      case 'PERSONAL':
        return '事假 / Personal';
      default:
        return type;
    }
  };

  const formatDateTime = (dt) => {
    if (!dt) return '-';
    return dt.replace('T', ' ');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 4 }}>申请与审批 / Leave Requests</h2>
      <div style={{ color: '#777', marginBottom: 20 }}>
        在此提交请假申请，并查看历史记录及待我审批的单据。
      </div>

      {/* 提交请假申请 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>
          提交请假单 / Submit Leave Request
        </h3>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ marginBottom: 4 }}>请假类型 / Type</div>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                style={{
                  width: '100%',
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              >
                <option value="ANNUAL">年假 / Annual</option>
                <option value="SICK">病假 / Sick</option>
                <option value="PERSONAL">事假 / Personal</option>
              </select>
            </div>

            <LabeledInput
              type="date"
              label="开始日期 / Start Date"
              value={form.startDate}
              onChange={(v) => handleChange('startDate', v)}
            />

            <LabeledInput
              type="date"
              label="结束日期 / End Date"
              value={form.endDate}
              onChange={(v) => handleChange('endDate', v)}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ marginBottom: 4 }}>请假原因 / Reason</div>
            <textarea
              value={form.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              style={{
                width: '100%',
                minHeight: 80,
                padding: 8,
                borderRadius: 4,
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: 'none',
              backgroundColor: '#1677ff',
              color: '#fff',
              cursor: 'pointer',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? '提交中...' : '提交申请 / Submit'}
          </button>
        </form>
      </section>

      {/* 我的请假记录 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
          marginBottom: 24,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>
          我的请假记录 / My Leave History
        </h3>

        {loading ? (
          <div>加载中...</div>
        ) : myList.length === 0 ? (
          <div>暂无请假记录</div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                <Th>编号</Th>
                <Th>类型</Th>
                <Th>开始日期</Th>
                <Th>结束日期</Th>
                <Th>状态</Th>
                <Th>审批人</Th>
                <Th>审批意见</Th>
                <Th>提交时间</Th>
              </tr>
            </thead>
            <tbody>
              {myList.map((item) => (
                <tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{renderType(item.type)}</Td>
                  <Td>{item.startDate}</Td>
                  <Td>{item.endDate}</Td>
                  <Td>{renderStatus(item.status)}</Td>
                  <Td>{item.approver || '-'}</Td>
                  <Td>{item.approverComment || '-'}</Td>
                  <Td>{formatDateTime(item.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 待我审批的请假单 */}
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>
          待我审批的申请 / To Approve
        </h3>

        {loading ? (
          <div>加载中...</div>
        ) : todoList.length === 0 ? (
          <div>暂无待审批记录（如果你没有下属，这里为空属正常情况）</div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 14,
            }}
          >
            <thead>
              <tr>
                <Th>编号</Th>
                <Th>申请人</Th>
                <Th>类型</Th>
                <Th>开始日期</Th>
                <Th>结束日期</Th>
                <Th>状态</Th>
                <Th>操作</Th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((item) => (
                <tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.applicantName || item.applicant}</Td>
                  <Td>{renderType(item.type)}</Td>
                  <Td>{item.startDate}</Td>
                  <Td>{item.endDate}</Td>
                  <Td>{renderStatus(item.status)}</Td>
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
      </section>
    </div>
  );
};


/* ---------- 考勤 ---------- */
const AttendancePanel = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/employee/attendance/my');
      setRecords(res.data || []);
    } catch (e) {
      console.error('加载考勤记录失败', e);
      setError('加载考勤记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/api/employee/attendance/check-in');
      alert('签到成功');
      fetchRecords();
    } catch (e) {
      console.error('签到失败', e);
      const msg = e.response?.data?.message || '签到失败';
      alert(msg);
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/api/employee/attendance/check-out');
      alert('签退成功');
      fetchRecords();
    } catch (e) {
      console.error('签退失败', e);
      const msg = e.response?.data?.message || '签退失败';
      alert(msg);
    }
  };

  return (
    <div>
      <h2>考勤记录 / Attendance Records</h2>

      <div style={{ margin: '16px 0' }}>
        <button
          onClick={handleCheckIn}
          style={{
            marginRight: 8,
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #1677ff',
            backgroundColor: '#1677ff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          签到 / Check-in
        </button>
        <button
          onClick={handleCheckOut}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #1677ff',
            backgroundColor: '#fff',
            color: '#1677ff',
            cursor: 'pointer',
          }}
        >
          签退 / Check-out
        </button>
      </div>

      {loading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!loading && !error && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>日期 / Date</th>
              <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>签到时间 / Check-in</th>
              <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>签退时间 / Check-out</th>
              <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>状态 / Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 12, textAlign: 'center' }}>
                  暂无考勤记录
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id}>
                  <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>
                    {r.date}
                  </td>
                  <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>
                    {r.checkInTime || '-'}
                  </td>
                  <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>
                    {r.checkOutTime || '-'}
                  </td>
                  <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>
                    {r.status || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ---------- 占位模块 ---------- */

const PlaceholderPanel = ({ title }) => (
  <div>
    <h2 style={{ marginBottom: 4 }}>{title}</h2>
    <div style={{ color: '#777', marginBottom: 16 }}>
      模块接口和页面暂未实现，可在后续开发。
    </div>
  </div>
);

/* ---------- 小工具组件 ---------- */

const Field = ({ label, value }) => (
  <>
    <div style={{ color: '#666' }}>{label}</div>
    <div>{value}</div>
  </>
);

const EditField = ({ label, value, editing, onChange }) => (
  <>
    <div style={{ color: '#666' }}>{label}</div>
    <div>
      {editing ? (
        <input
          style={{
            padding: 6,
            borderRadius: 4,
            border: '1px solid #ccc',
            width: 260,
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <span>{value || '-'}</span>
      )}
    </div>
  </>
);

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
