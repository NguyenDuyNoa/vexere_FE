import React, { useState, useEffect } from 'react'

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user',
    status: true
  });

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users');
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu');
      }
      const data = await response.json();
      // Đảm bảo data là một mảng
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setError(error.message);
      setUsers([]); // Set mảng rỗng nếu có lỗi
    }
  };

  // Hàm xóa người dùng
  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'DELETE',
      });
      // Cập nhật lại danh sách sau khi xóa
      fetchUsers();
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
    }
  };

  // Hàm xử lý thêm người dùng
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending data:', newUser); // Log để debug
      
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
      
      console.log('Response:', data); // Log để debug
      
      fetchUsers();
      setIsModalOpen(false);
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        status: true
      });
      setError(null); // Clear error khi thành công
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      setError(error.message);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-6 order-last">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
        >
          Thêm Người Dùng
        </button>
      </div>

      {/* Modal thêm người dùng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm Người Dùng Mới</h2>
            <form onSubmit={handleAddUser}>
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Vai trò</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2 border rounded text-gray-800"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value === 'true'})}
                  className="w-full p-2 border rounded text-gray-800"
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {error ? (
          <div className="text-red-500 p-4">
            Lỗi: {error}
          </div>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Họ và tên</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Vai trò</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="px-6 py-4">{user.id}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-500 rounded text-sm">
                        {user.status ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default HomePage
