import { useEffect, useState } from 'react';
import { getAllUsersAPI, deleteUserAPI, updateUserAPI, type User, type UpdateUserDto } from '../lib/api';
import toast from 'react-hot-toast';
import './AdminPanel.css';

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await getAllUsersAPI();
      setUsers(data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, email: string) {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
      return;
    }

    try {
      await deleteUserAPI(id);
      toast.success('Usuario eliminado');
      loadUsers();
    } catch (error) {
      toast.error('Error al eliminar usuario');
      console.error(error);
    }
  }

  function startEdit(user: User) {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  function cancelEdit() {
    setEditingUser(null);
    setFormData({});
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUserAPI(editingUser.id, formData);
      toast.success('Usuario actualizado');
      cancelEdit();
      loadUsers();
    } catch (error) {
      toast.error('Error al actualizar usuario');
      console.error(error);
    }
  }

  // Filtrar usuarios según el término de búsqueda
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.id.toString().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      (user.name && user.name.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <div className="admin-panel">
        <h1>Panel de Administración</h1>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1 className="gradient-heading-h1 heading-underline-large">Panel de Administración</h1>
        <p className="subtitle">Gestión de usuarios</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Buscar por ID, nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            ✕
          </button>
        )}
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td data-label="ID">{user.id}</td>
                <td data-label="Nombre">{user.name || '-'}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Rol">
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td data-label="Registro">{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                <td data-label="Acciones">
                  <div className="actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => startEdit(user)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(user.id, user.email)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <p className="no-users">
            {searchTerm ? `No se encontraron usuarios con "${searchTerm}"` : 'No hay usuarios registrados'}
          </p>
        )}
      </div>

      {/* Modal de edición */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={cancelEdit}>✕</button>
            <h2 className="gradient-heading-h2-small">Editar Usuario</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del usuario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Rol</label>
                <select
                  id="role"
                  className="input"
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  required
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Nueva contraseña (opcional)</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Dejar vacío para no cambiar"
                  autoComplete="new-password"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
