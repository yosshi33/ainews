// ユーザー認証システム

// デモ用のユーザーデータ
const demoUsers = [
  { id: 'admin', password: 'admin123', role: 'admin' },
  { id: 'user1', password: 'user123', role: 'viewer' },
  { id: 'user2', password: 'user456', role: 'viewer' }
];

// ローカルストレージからユーザーデータを取得
function getUsers() {
  const savedUsers = localStorage.getItem('aiToolsUsers');
  return savedUsers ? JSON.parse(savedUsers) : demoUsers;
}

// すべてのユーザーデータを取得（管理画面用）
function getAllUsers() {
  return getUsers();
}

// ユーザーデータをローカルストレージに保存
function saveUsers(users) {
  localStorage.setItem('aiToolsUsers', JSON.stringify(users));
}

// 初期化時にデモユーザーを保存
function initUsers() {
  if (!localStorage.getItem('aiToolsUsers')) {
    saveUsers(demoUsers);
  }
}

// 新規ユーザーを作成
function createUser(userId, password, role) {
  if (!userId || !password) return false;
  
  const users = getUsers();
  // 既存ユーザーIDのチェック
  if (users.some(u => u.id === userId)) return false;
  
  // 新規ユーザーを追加
  users.push({
    id: userId,
    password: password,
    role: role || 'viewer'
  });
  
  saveUsers(users);
  return true;
}

// ユーザー情報を更新
function updateUserData(userId, userData) {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  // パスワードが指定されている場合のみ更新
  if (userData.password) {
    users[userIndex].password = userData.password;
  }
  
  // 権限が指定されている場合は更新
  if (userData.role) {
    users[userIndex].role = userData.role;
  }
  
  saveUsers(users);
  return true;
}

// ユーザーを削除
function removeUser(userId) {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  // 削除対象が存在しない場合
  if (filteredUsers.length === users.length) return false;
  
  saveUsers(filteredUsers);
  return true;
}

// ログイン処理
function login(userId, password) {
  const users = getUsers();
  const user = users.find(u => u.id === userId && u.password === password);
  
  if (user) {
    // ログイン成功時、セッション情報を保存
    sessionStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      role: user.role
    }));
    return true;
  }
  return false;
}

// ログアウト処理
function logout() {
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// 現在のユーザー情報を取得
function getCurrentUser() {
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

// ユーザーが管理者かどうかを確認
function isAdmin() {
  const currentUser = getCurrentUser();
  return currentUser && currentUser.role === 'admin';
}

// 認証状態を確認し、未ログインならログインページにリダイレクト
function checkAuth() {
  if (!getCurrentUser()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// 初期化
initUsers();