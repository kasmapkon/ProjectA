import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, User, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, update, query, orderByChild, equalTo } from 'firebase/database';
import { auth, db as database } from './config';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
  isDisabled?: boolean;
  role: 'user' | 'admin';
  phoneNumber?: string;
  address?: string;
  notificationPreferences?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    newArrivals?: boolean;
  };
}

export const registerUser = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    const userData: UserData = {
      uid: user.uid,
      email: user.email || email,
      displayName: displayName || user.displayName || '',
      role: 'user',
    };

    await set(ref(database, `users/${user.uid}`), userData);

    return userData;
  } catch (error: any) {
    let message = 'Đăng ký thất bại';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Email này đã được sử dụng bởi một tài khoản khác';
        break;
      case 'auth/invalid-email':
        message = 'Địa chỉ email không hợp lệ';
        break;
      case 'auth/weak-password':
        message = 'Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn';
        break;
      default:
        message = `${message}: ${error.message}`;
    }
    
    throw new Error(message);
  }
};


export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    // Xác thực với Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (!user.emailVerified && false) {  // Tạm thời vô hiệu hóa yêu cầu xác minh email
      await signOut(auth);
      throw new Error('Vui lòng xác minh email của bạn trước khi đăng nhập');
    }
    
    // Lấy thông tin người dùng từ database
    const userDataSnapshot = await get(ref(database, `users/${user.uid}`));
    
    if (userDataSnapshot.exists()) {
      const userData = userDataSnapshot.val() as UserData;
      
      // Kiểm tra xem tài khoản có bị vô hiệu hóa không
      if (userData.isDisabled) {
        await signOut(auth);
        throw new Error('Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.');
      }
      
      // Cập nhật thời gian đăng nhập gần nhất
      await update(ref(database, `users/${user.uid}`), {
        lastLogin: new Date().toISOString()
      });
      
      return userData;
    } else {
      // Tạo profile mới nếu không tồn tại trong database
      const userData: UserData = {
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || '',
        role: 'user',
      };
      
      await set(ref(database, `users/${user.uid}`), {
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      return userData;
    }
  } catch (error: any) {
    let message = 'Đăng nhập thất bại';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Địa chỉ email không hợp lệ';
        break;
      case 'auth/user-disabled':
        message = 'Tài khoản này đã bị vô hiệu hóa';
        break;
      case 'auth/user-not-found':
        message = 'Không tìm thấy tài khoản với địa chỉ email này';
        break;
      case 'auth/wrong-password':
        message = 'Mật khẩu không chính xác';
        break;
      case 'auth/too-many-requests':
        message = 'Quá nhiều yêu cầu không thành công. Vui lòng thử lại sau';
        break;
      default:
        if (error.message) {
          message = error.message;
        }
    }
    
    throw new Error(message);
  }
};

export const getCurrentUser = async (): Promise<UserData | null> => {
  const user = auth.currentUser;
  
  if (!user) {
    return null;
  }
  
  try {
    const userDataSnapshot = await get(ref(database, `users/${user.uid}`));
    
    if (userDataSnapshot.exists()) {
      const userData = userDataSnapshot.val() as UserData;
      
      // Kiểm tra trạng thái tài khoản
      if (userData.isDisabled) {
        await signOut(auth);
        throw new Error('Tài khoản đã bị vô hiệu hóa');
      }
      
      return userData;
    } else {
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: 'user', 
      };
      await set(ref(database, `users/${user.uid}`), {
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      return userData;
    }
  } catch (error: any) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    
    if (error.message === 'Tài khoản đã bị vô hiệu hóa') {
      throw error;
    }
    
    return null;
  }
};

export const onAuthChanged = (callback: (user: UserData | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDataSnapshot = await get(ref(database, `users/${user.uid}`));
        if (userDataSnapshot.exists()) {
          const userData = userDataSnapshot.val() as UserData;
          
          // Kiểm tra trạng thái tài khoản
          if (userData.isDisabled) {
            await signOut(auth);
            callback(null);
            return;
          }
          
          callback(userData);
        } else {
          const userData: UserData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: 'user',
          };
          await set(ref(database, `users/${user.uid}`), {
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          });
          callback(userData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const saveUserDataBeforeLogout = async (): Promise<void> => {
  const user = auth.currentUser;
  
  if (!user) {
    console.warn('Không có người dùng đang đăng nhập để lưu dữ liệu');
    return;
  }
  
  try {
    // Lấy giỏ hàng từ localStorage
    const cartData = localStorage.getItem('cart');
    
    // Lấy danh sách yêu thích từ localStorage
    const wishlistData = localStorage.getItem('wishlist');
    
    // Tạo đối tượng dữ liệu để lưu
    const userData = {
      cart: cartData ? JSON.parse(cartData) : [],
      wishlist: wishlistData ? JSON.parse(wishlistData) : [],
      lastUpdated: new Date().toISOString()
    };
    
    // Lưu vào Firebase
    await update(ref(database, `users/${user.uid}`), {
      userData: userData
    });
    
    console.log('Đã lưu dữ liệu giỏ hàng và yêu thích lên Firebase');
    
    // Xóa dữ liệu trong localStorage sau khi đã lưu
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    // Cập nhật UI (gửi sự kiện)
    window.dispatchEvent(new Event('cartUpdated'));
    window.dispatchEvent(new Event('wishlistUpdated'));
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu người dùng trước khi đăng xuất:', error);
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Lưu dữ liệu trước khi đăng xuất
    await saveUserDataBeforeLogout();
    
    // Đăng xuất khỏi Firebase
    await signOut(auth);
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    throw error;
  }
};

// Hàm tải dữ liệu giỏ hàng và yêu thích khi đăng nhập
export const loadUserData = async (userId: string): Promise<void> => {
  try {
    // Lấy dữ liệu người dùng từ Firebase
    const userDataSnapshot = await get(ref(database, `users/${userId}`));
    
    if (userDataSnapshot.exists()) {
      const userData = userDataSnapshot.val();
      
      // Kiểm tra và tải giỏ hàng
      if (userData.userData && userData.userData.cart) {
        localStorage.setItem('cart', JSON.stringify(userData.userData.cart));
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      // Kiểm tra và tải danh sách yêu thích
      if (userData.userData && userData.userData.wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(userData.userData.wishlist));
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
      
      console.log('Đã tải dữ liệu người dùng từ Firebase');
    }
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu người dùng:', error);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    let message = 'Gửi email đặt lại mật khẩu thất bại';
    
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Địa chỉ email không hợp lệ';
        break;
      case 'auth/user-not-found':
        message = 'Không tìm thấy tài khoản với địa chỉ email này';
        break;
      default:
        message = `${message}: ${error.message}`;
    }
    
    throw new Error(message);
  }
};


export const updateUserData = async (userId?: string, userData?: Partial<UserData>): Promise<void> => {
  let uid: string;
  
  
  if (!userId) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Không có người dùng đang đăng nhập');
    }
    uid = user.uid;
  } else {
    uid = userId;
  }
  

  if (!userData && userId && typeof userId === 'object') {
    userData = userId as Partial<UserData>;
    uid = auth.currentUser?.uid || '';
    
    if (!uid) {
      throw new Error('Không có người dùng đang đăng nhập');
    }
  }
  
  if (!userData) {
    throw new Error('Không có dữ liệu để cập nhật');
  }
  
  try {
    if (uid === auth.currentUser?.uid && (userData.displayName || userData.photoURL)) {
      await updateProfile(auth.currentUser, {
        displayName: userData.displayName,
        photoURL: userData.photoURL
      });
    }
  
    const userRef = ref(database, `users/${uid}`);
    const userSnapshot = await get(userRef);
    
    if (userSnapshot.exists()) {
      const currentData = userSnapshot.val();
      await update(userRef, { 
        ...currentData, 
        ...userData,
        updatedAt: new Date().toISOString() 
      });
    }
  } catch (error: any) {
    throw new Error(`Cập nhật thông tin người dùng thất bại: ${error.message}`);
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users: UserData[] = [];
    const data = snapshot.val();
    
    Object.keys(data).forEach(uid => {
      users.push({
        uid,
        ...data[uid]
      });
    });
    
    return users;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    return [];
  }
}; 