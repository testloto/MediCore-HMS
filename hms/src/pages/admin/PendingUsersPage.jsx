// src/pages/admin/PendingUsersPage.jsx

import React from "react";
import { useAuth, ROLE_META } from "../../context/AuthContext";

export default function PendingUsersPage() {
  const { PENDING_USERS, approveUser, rejectUser } = useAuth();

  return (
    <div className="hms-card" style={{ padding: 24 }}>
      <h2 className="card-title">Pending User Approvals</h2>

      {PENDING_USERS.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", color: "var(--text3)" }}>
          No users waiting for approval.
        </div>
      ) : (
        <table className="hms-table" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Dept</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {PENDING_USERS.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{ROLE_META[u.role]?.label}</td>
                <td>{u.dept}</td>
                <td>
                  <div style={{ display:'flex', gap:10 }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => approveUser(u.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectUser(u.id)}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}