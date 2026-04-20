import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import { customerAccountApi } from "../api/customerAccount";
import { addressesApi } from "../api/addresses";
import { formatPrice } from "../utils";
import type { Address } from "../types";
import "./CustomerDashboard.css";

type Tab = "overview" | "settings" | "addresses" | "transactions";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { transactions, isLoading: txLoading } = useTransactions(currentUser?.id);

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Settings form state
  const [newName, setNewName] = useState(currentUser?.name ?? "");
  const [newUsername, setNewUsername] = useState(currentUser?.username ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsMsg, setSettingsMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [savingName, setSavingName] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [addressForm, setAddressForm] = useState({ address: "", city: "", province: "", country: "", postalCode: "" });
  const [addingAddress, setAddingAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const loadAddresses = async () => {
    if (addressesLoaded) return;
    try {
      const data = await addressesApi.getAll();
      setAddresses(data);
      setAddressesLoaded(true);
    } catch {}
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "addresses") loadAddresses();
    setSettingsMsg(null);
  };

  const handleSaveName = async () => {
    if (!currentUser) return;
    setSavingName(true);
    try {
      await customerAccountApi.updateName(currentUser.emailAddress, newName);
      setSettingsMsg({ type: "ok", text: "Name updated successfully." });
    } catch (e: any) {
      setSettingsMsg({ type: "err", text: e.message });
    } finally { setSavingName(false); }
  };

  const handleSaveUsername = async () => {
    if (!currentUser) return;
    setSavingUsername(true);
    try {
      await customerAccountApi.updateUsername(currentUser.emailAddress, newUsername);
      setSettingsMsg({ type: "ok", text: "Username updated successfully." });
    } catch (e: any) {
      setSettingsMsg({ type: "err", text: e.message });
    } finally { setSavingUsername(false); }
  };

  const handleSavePassword = async () => {
    if (!currentUser) return;
    if (!oldPassword || !newPassword) {
      setSettingsMsg({ type: "err", text: "Please fill in both password fields." });
      return;
    }
    setSavingPassword(true);
    try {
      await customerAccountApi.updatePassword(currentUser.emailAddress, oldPassword, newPassword);
      setOldPassword(""); setNewPassword("");
      setSettingsMsg({ type: "ok", text: "Password updated successfully." });
    } catch (e: any) {
      setSettingsMsg({ type: "err", text: e.message });
    } finally { setSavingPassword(false); }
  };

  const handleAddAddress = async () => {
    if (!currentUser) return;
    setAddingAddress(true);
    try {
      const created = await addressesApi.create({ ...addressForm, customerAccountId: currentUser.id });
      setAddresses((prev) => [...prev, created]);
      setAddressForm({ address: "", city: "", province: "", country: "", postalCode: "" });
      setShowAddressForm(false);
    } catch {} finally { setAddingAddress(false); }
  };

  const handleDeleteAddress = async (id: number) => {
    await addressesApi.delete(id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (!currentUser) return <><Navbar /><Spinner /></>;

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard__inner">
        {/* Sidebar */}
        <aside className="dashboard__sidebar">
          <div className="dashboard__profile">
            <div className="dashboard__avatar">
              {(currentUser.name ?? currentUser.username)[0].toUpperCase()}
            </div>
            <div>
              <p className="dashboard__profile-name">{currentUser.name ?? currentUser.username}</p>
              <p className="dashboard__profile-email">{currentUser.emailAddress}</p>
            </div>
          </div>

          <nav className="dashboard__nav">
            {(["overview", "settings", "addresses", "transactions"] as Tab[]).map((tab) => (
              <button
                key={tab}
                className={`dashboard__nav-item ${activeTab === tab ? "dashboard__nav-item--active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                <span className="dashboard__nav-icon">
                  {tab === "overview" && "◈"}
                  {tab === "settings" && "⚙"}
                  {tab === "addresses" && "◎"}
                  {tab === "transactions" && "⊟"}
                </span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <button className="dashboard__logout" onClick={() => { logout(); navigate("/"); }}>
            Sign Out
          </button>
        </aside>

        {/* Main Content */}
        <main className="dashboard__main">

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="dashboard__tab">
              <h1 className="dashboard__title">Welcome back, {currentUser.name ?? currentUser.username}</h1>
              <div className="dashboard__overview-grid">
                <div className="dashboard__stat-card" onClick={() => handleTabChange("transactions")}>
                  <span className="dashboard__stat-icon">⊟</span>
                  <span className="dashboard__stat-value">{transactions.length}</span>
                  <span className="dashboard__stat-label">Transactions</span>
                </div>
                <div className="dashboard__stat-card" onClick={() => handleTabChange("addresses")}>
                  <span className="dashboard__stat-icon">◎</span>
                  <span className="dashboard__stat-value">{addresses.length}</span>
                  <span className="dashboard__stat-label">Addresses</span>
                </div>
                <div className="dashboard__stat-card" onClick={() => handleTabChange("settings")}>
                  <span className="dashboard__stat-icon">⚙</span>
                  <span className="dashboard__stat-value">—</span>
                  <span className="dashboard__stat-label">Settings</span>
                </div>
              </div>

              {transactions.length > 0 && (
                <div className="dashboard__recent">
                  <h2 className="dashboard__section-title">Recent Transactions</h2>
                  <div className="dashboard__tx-list">
                    {transactions.slice(0, 3).map((tx) => (
                      <div className="dashboard__tx-row" key={tx.transactionId}>
                        <span className="dashboard__tx-id">#{tx.transactionId}</span>
                        <span className={`dashboard__tx-status ${tx.isPaid ? "dashboard__tx-status--paid" : "dashboard__tx-status--pending"}`}>
                          {tx.isPaid ? "Paid" : "Pending"}
                        </span>
                        <span className="dashboard__tx-price">{formatPrice(tx.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                  <button className="dashboard__see-all" onClick={() => handleTabChange("transactions")}>
                    See all transactions →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="dashboard__tab">
              <h1 className="dashboard__title">Account Settings</h1>
              {settingsMsg && (
                <div className={`dashboard__msg ${settingsMsg.type === "ok" ? "dashboard__msg--ok" : "dashboard__msg--err"}`}>
                  {settingsMsg.text}
                </div>
              )}

              <div className="dashboard__settings-section">
                <h2 className="dashboard__section-title">Display Name</h2>
                <div className="dashboard__settings-row">
                  <Input
                    label="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your display name"
                  />
                  <Button variant="secondary" onClick={handleSaveName} loading={savingName}>Save</Button>
                </div>
              </div>

              <div className="dashboard__settings-section">
                <h2 className="dashboard__section-title">Username</h2>
                <div className="dashboard__settings-row">
                  <Input
                    label="Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Your username"
                  />
                  <Button variant="secondary" onClick={handleSaveUsername} loading={savingUsername}>Save</Button>
                </div>
              </div>

              <div className="dashboard__settings-section">
                <h2 className="dashboard__section-title">Change Password</h2>
                <Input
                  label="Current Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <div className="dashboard__settings-row">
                  <Input
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button variant="secondary" onClick={handleSavePassword} loading={savingPassword}>Update</Button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          {activeTab === "addresses" && (
            <div className="dashboard__tab">
              <div className="dashboard__tab-header">
                <h1 className="dashboard__title">Address Book</h1>
                <Button variant="secondary" size="sm" onClick={() => setShowAddressForm((v) => !v)}>
                  {showAddressForm ? "Cancel" : "+ Add Address"}
                </Button>
              </div>

              {showAddressForm && (
                <div className="dashboard__address-form">
                  <div className="dashboard__address-form-grid">
                    <Input label="Street Address" value={addressForm.address} onChange={(e) => setAddressForm((f) => ({ ...f, address: e.target.value }))} placeholder="123 Main St" />
                    <Input label="City" value={addressForm.city} onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))} placeholder="Montreal" />
                    <Input label="Province" value={addressForm.province} onChange={(e) => setAddressForm((f) => ({ ...f, province: e.target.value }))} placeholder="QC" />
                    <Input label="Country" value={addressForm.country} onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))} placeholder="Canada" />
                    <Input label="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm((f) => ({ ...f, postalCode: e.target.value }))} placeholder="H3A 0G4" />
                  </div>
                  <Button variant="primary" onClick={handleAddAddress} loading={addingAddress}>Save Address</Button>
                </div>
              )}

              {!addressesLoaded
                ? <Spinner size="sm" label="Loading addresses…" />
                : addresses.length === 0
                  ? <p className="dashboard__empty">No saved addresses yet.</p>
                  : <div className="dashboard__address-list">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="dashboard__address-card">
                          <div className="dashboard__address-lines">
                            <p>{addr.address}</p>
                            <p>{addr.city}, {addr.province} {addr.postalCode}</p>
                            <p>{addr.country}</p>
                          </div>
                          <button className="dashboard__address-delete" onClick={() => handleDeleteAddress(addr.id)}>✕</button>
                        </div>
                      ))}
                    </div>
              }
            </div>
          )}

          {/* Transactions */}
          {activeTab === "transactions" && (
            <div className="dashboard__tab">
              <h1 className="dashboard__title">Transaction History</h1>
              {txLoading
                ? <Spinner size="sm" label="Loading transactions…" />
                : transactions.length === 0
                  ? <p className="dashboard__empty">No transactions yet. Start shopping!</p>
                  : <div className="dashboard__tx-table-wrap">
                      <table className="dashboard__tx-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Delivery</th>
                            <th>Promo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx.transactionId}>
                              <td className="dashboard__tx-id-cell">#{tx.transactionId}</td>
                              <td className="dashboard__tx-price-cell">{formatPrice(tx.totalPrice)}</td>
                              <td>
                                <span className={`dashboard__tx-status ${tx.isPaid ? "dashboard__tx-status--paid" : "dashboard__tx-status--pending"}`}>
                                  {tx.isPaid ? "Paid" : "Pending"}
                                </span>
                              </td>
                              <td>
                                <span className={`dashboard__tx-status ${tx.deliveryStatus ? "dashboard__tx-status--paid" : "dashboard__tx-status--pending"}`}>
                                  {tx.deliveryStatus ? "Delivered" : "In Transit"}
                                </span>
                              </td>
                              <td className="dashboard__tx-promo">{tx.promotionCode ?? "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
              }
            </div>
          )}
        </main>
      </div>
    </div>
  );
}