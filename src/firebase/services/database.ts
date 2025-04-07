import { ref, get, set, update, remove, push, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { db } from '../config';

/**
 * Lấy dữ liệu từ đường dẫn cụ thể
 * @param path Đường dẫn trong Realtime Database
 */
export const fetchData = async (path: string) => {
  try {
    const dataRef = ref(db, path);
    const snapshot = await get(dataRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    throw error;
  }
};

/**
 * Lắng nghe dữ liệu theo thời gian thực
 * @param path Đường dẫn trong database
 * @param callback Hàm callback xử lý khi có dữ liệu mới
 * @returns Hàm hủy lắng nghe
 */
export const listenToData = (path: string, callback: (data: any) => void) => {
  const dataRef = ref(db, path);
  
  // Lắng nghe sự kiện thay đổi
  const unsubscribe = onValue(dataRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  }, (error) => {
    console.error('Lỗi khi lắng nghe dữ liệu:', error);
  });
  
  // Trả về hàm để hủy lắng nghe khi không cần thiết
  return unsubscribe;
};

/**
 * Lưu dữ liệu vào đường dẫn
 * @param path Đường dẫn trong Realtime Database
 * @param data Dữ liệu cần lưu
 */
export const saveData = async (path: string, data: any) => {
  try {
    const dataRef = ref(db, path);
    await set(dataRef, data);
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    throw error;
  }
};

/**
 * Cập nhật dữ liệu tại đường dẫn
 * @param path Đường dẫn trong Realtime Database
 * @param data Dữ liệu cần cập nhật
 */
export const updateData = async (path: string, data: any) => {
  try {
    const dataRef = ref(db, path);
    await update(dataRef, data);
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
    throw error;
  }
};

/**
 * Xóa dữ liệu tại đường dẫn
 * @param path Đường dẫn trong Realtime Database
 */
export const deleteData = async (path: string) => {
  try {
    const dataRef = ref(db, path);
    await remove(dataRef);
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi xóa dữ liệu:', error);
    throw error;
  }
};

/**
 * Thêm dữ liệu mới và tạo ID tự động
 * @param path Đường dẫn trong Realtime Database
 * @param data Dữ liệu cần thêm
 */
export const pushData = async (path: string, data: any) => {
  try {
    const listRef = ref(db, path);
    const newItemRef = push(listRef);
    await set(newItemRef, data);
    
    // Trả về ID mới được tạo
    return { 
      id: newItemRef.key,
      success: true 
    };
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu:', error);
    throw error;
  }
};

/**
 * Truy vấn dữ liệu theo trường
 * @param path Đường dẫn trong Realtime Database
 * @param field Tên trường cần truy vấn
 * @param value Giá trị cần tìm
 */
export const queryByField = async (path: string, field: string, value: string | number | boolean) => {
  try {
    const dataRef = ref(db, path);
    const dataQuery = query(dataRef, orderByChild(field), equalTo(value));
    const snapshot = await get(dataQuery);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu:', error);
    throw error;
  }
}; 