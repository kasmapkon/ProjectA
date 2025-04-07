import { fetchData, listenToData, updateData, pushData, deleteData, queryByField } from './database';

const createSlugFromCategory = (categoryName: string): string => {
  return categoryName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const categoryMap: { [key: string]: string } = {
  'hoa-ky-niem': 'ky-niem',
  'hoa-kỉ-niem': 'ky-niem', 
  'hoa-ki-niem': 'ky-niem',
  'hoa-qua-tang': 'qua-tang',
  'hoa-tinh-yeu': 'tinh-yeu',
  'hoa-bieu-tuong-cho-tinh-yeu': 'tinh-yeu',
  'hoa-trang-tri': 'trang-tri',
  'hoa-sinh-nhat': 'sinh-nhat',
  'hoa-cuoi': 'cuoi',
  'hoa-chuc-mung': 'chuc-mung'
};

const FLOWERS_PATH = 'flowers';
const CATEGORIES_PATH = 'categories';
const REVIEWS_PATH = 'reviews';

/**
 * Lấy tất cả sản phẩm hoa
 */
export const getAllFlowers = async () => {
  try {
    return await fetchData(FLOWERS_PATH);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu hoa:', error);
    throw error;
  }
};

/**
 * Lắng nghe sự thay đổi của tất cả sản phẩm hoa
 */
export const listenToFlowers = (callback: (flowers: any) => void) => {
  return listenToData(FLOWERS_PATH, callback);
};

/**
 * Lấy thông tin chi tiết của một sản phẩm hoa
 */
export const getFlowerById = async (flowerId: string) => {
  try {
    return await fetchData(`${FLOWERS_PATH}/${flowerId}`);
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin hoa ${flowerId}:`, error);
    throw error;
  }
};

/**
 * Tìm sản phẩm hoa theo mã sản phẩm
 */
export const getFlowerByCode = async (code: string) => {
  try {
    console.log("Đang tìm hoa với mã: ", code);
    const allFlowers = await getAllFlowers();
    if (!allFlowers) return null;
    
    for (const [id, flower] of Object.entries(allFlowers)) {
      const flowerData = flower as any;
      if (flowerData.code === code || flowerData.productCode === code) {
        console.log("Đã tìm thấy hoa: ", flowerData.name);
        return {
          id,
          ...flowerData
        };
      }
    }
    
    console.log("Không tìm thấy hoa với mã: ", code);
    return null;
  } catch (error) {
    console.error(`Lỗi khi tìm hoa theo mã ${code}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả các sản phẩm hoa theo danh mục
 */
export const getFlowersByCategory = async (categoryId: string) => {
  try {
    const allFlowers = await getAllFlowers();
    if (!allFlowers) return null;
    
    const resolvedCategoryId = categoryMap[categoryId] || categoryId;
    console.log(`Tìm kiếm sản phẩm với danh mục: ${categoryId}, đã phân giải thành: ${resolvedCategoryId}`);
    
    const filteredFlowers = Object.entries(allFlowers)
      .filter(([_, flower]: [string, any]) => {
        const match = 
          flower.category === resolvedCategoryId || 
          flower.category === categoryId ||
          
          flower.categoryId?.toString() === resolvedCategoryId.toString() ||
          flower.categoryId?.toString() === categoryId.toString() ||
          
          flower.categorySlug === categoryId ||
          
          (flower.categoryName && 
            (flower.categoryName.toLowerCase() === categoryId.toLowerCase() || 
             createSlugFromCategory(flower.categoryName) === categoryId));
        
        if (match) {
          console.log(`Sản phẩm phù hợp với danh mục ${categoryId}:`, {
            name: flower.name,
            category: flower.category,
            categorySlug: flower.categorySlug,
            categoryName: flower.categoryName
          });
        }
        
        return match;
      })
      .reduce((acc: any, [id, flower]) => {
        acc[id] = flower;
        return acc;
      }, {});
    
    console.log(`Tìm thấy ${Object.keys(filteredFlowers).length} sản phẩm cho danh mục ${categoryId}`);
    return filteredFlowers;
  } catch (error) {
    console.error(`Lỗi khi lấy hoa theo danh mục ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Cập nhật thông tin sản phẩm hoa
 */
export const updateFlower = async (flowerId: string, flowerData: any) => {
  try {
    return await updateData(`${FLOWERS_PATH}/${flowerId}`, flowerData);
  } catch (error) {
    console.error(`Lỗi khi cập nhật hoa ${flowerId}:`, error);
    throw error;
  }
};

/**
 * Thêm sản phẩm hoa mới
 */
export const addFlower = async (flowerData: any) => {
  try {
    return await pushData(FLOWERS_PATH, flowerData);
  } catch (error) {
    console.error('Lỗi khi thêm hoa mới:', error);
    throw error;
  }
};

/**
 * Xóa sản phẩm hoa
 */
export const deleteFlower = async (flowerId: string) => {
  try {
    return await deleteData(`${FLOWERS_PATH}/${flowerId}`);
  } catch (error) {
    console.error(`Lỗi khi xóa hoa ${flowerId}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả danh mục hoa
 */
export const getAllCategories = async () => {
  try {
    return await fetchData(CATEGORIES_PATH);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu danh mục:', error);
    throw error;
  }
};

/**
 * Lắng nghe sự thay đổi của các danh mục
 */
export const listenToCategories = (callback: (categories: any) => void) => {
  console.log("Starting to listen to categories");
  return listenToData(CATEGORIES_PATH, (categoriesData) => {
    console.log("Raw categories data from Firebase:", categoriesData);
    callback(categoriesData);
  });
};

// Thêm hàm để khởi tạo dữ liệu hoa nếu không có sẵn
export const initializeFlowersData = async (forceUpdate: boolean = false) => {
  try {
    // Kiểm tra xem đã có dữ liệu hoa chưa
    const existingData = await getAllFlowers();
    
    // Nếu không có dữ liệu hoặc forceUpdate = true, thêm dữ liệu mẫu
    if (!existingData || forceUpdate) {
      const sampleFlowers = {
        "flower1": {
          name: "Bó Hoa Hồng Tươi",
          code: "flower1",
          productCode: "flower1",
          id: "flower_1",
          price: 450000,
          salePrice: 405000,
          sale: 10,
          imageUrl: "https://haloflower.vn/wp-content/uploads/2023/03/bo-hoa-hong-chau-au-dodo.jpg",
          category: "tinh-yeu",        // ID của danh mục
          categoryName: "Hoa tình yêu", // Tên hiển thị của danh mục
          categorySlug: "hoa-tinh-yeu", // Slug của danh mục
          description: "Bó hoa hồng tươi thắm với sắc đỏ rực rỡ, tượng trưng cho tình yêu mãnh liệt và sự lãng mạn.",
          inStock: true,
          rating: 4.8,
          reviews: 156,
          tags: ["tình yêu", "lãng mạn", "quà tặng"]
        },
        "flower2": {
          name: "Hoa Lily Trắng",
          code: "flower2",
          productCode: "flower2",
          id: "flower_2",
          price: 350000,
          salePrice: null,
          sale: 0,
          imageUrl: "https://hoatuoithanhthao.com/media/ftp/bo-hoa-lily-trang-1.jpg",
          category: "qua-tang",
          categoryName: "Hoa quà tặng",
          categorySlug: "hoa-qua-tang",
          description: "Hoa lily trắng tinh khôi, biểu tượng của sự thuần khiết và trang nhã.",
          inStock: true,
          rating: 4.5,
          reviews: 89,
          tags: ["thuần khiết", "tinh tế", "sang trọng"]
        },
        "flower3": {
          name: "Giỏ Hoa Hướng Dương",
          code: "flower3",
          productCode: "flower3",
          id: "flower_3",
          price: 550000,
          salePrice: 467500,
          sale: 15,
          imageUrl: "https://hoatuoithanhthao.com/media/ftp/gio-hoa-huong-duong-1.jpg",
          category: "ky-niem",
          categoryName: "Hoa kỉ niệm",
          categorySlug: "hoa-ky-niem",
          description: "Giỏ hoa hướng dương rực rỡ, mang đến năng lượng tích cực và niềm vui. Phù hợp cho các dịp kỷ niệm quan trọng.",
          inStock: true,
          rating: 4.9,
          reviews: 127,
          tags: ["năng lượng", "tươi sáng", "niềm vui", "kỷ niệm"]
        },
        "flower4": {
          name: "Hoa Cúc Mẫu Đơn",
          code: "flower4",
          productCode: "flower4",
          id: "flower_4",
          price: 400000,
          salePrice: 380000,
          sale: 5,
          imageUrl: "https://hoatuoithanhthao.com/media/ftp/hoa-cuc-mau-don-2.jpg",
          category: "trang-tri",
          categoryName: "Hoa trang trí",
          categorySlug: "hoa-trang-tri",
          description: "Hoa cúc mẫu đơn với vẻ đẹp quý phái, tượng trưng cho sự thịnh vượng.",
          inStock: true,
          rating: 4.6,
          reviews: 98,
          tags: ["quý phái", "thịnh vượng", "trang trí"]
        },
        "flower5": {
          name: "Hoa Lan Hồ Điệp",
          code: "flower5",
          productCode: "flower5",
          id: "flower_5",
          price: 650000,
          salePrice: null,
          sale: 0,
          imageUrl: "https://hoatuoithanhthao.com/media/ftp/hoa-lan-ho-diep-3.jpg",
          category: "trang-tri",
          categoryName: "Hoa trang trí",
          categorySlug: "hoa-trang-tri",
          description: "Hoa lan hồ điệp thanh lịch, biểu tượng của vẻ đẹp tinh tế và cao quý.",
          inStock: true,
          rating: 4.7,
          reviews: 145,
          tags: ["cao quý", "thanh lịch", "sang trọng"]
        },
        "flower8": {
          name: "Hoa Mẫu Đơn Kỷ Niệm",
          code: "flower8",
          productCode: "flower8",
          id: "flower_8",
          price: 400000,
          salePrice: 370000,
          imageUrl: "https://thegioihatgiong.com/wp-content/uploads/2022/03/doi-net-ve-hoa-mau-don.jpg",
          category: "ky-niem",
          categoryName: "Hoa kỉ niệm",
          categorySlug: "hoa-ky-niem",
          description: "Hoa mẫu đơn tượng trưng cho sự giàu có và thịnh vượng. Là món quà ý nghĩa cho các dịp kỷ niệm đặc biệt.",
          inStock: true,
          rating: 4.9,
          reviews: 187,
          tags: [
            "thịnh vượng",
            "sang trọng",
            "trang trí",
            "kỷ niệm"
          ]
        },
        "flower9": {
          name: "Bó Hoa Dành Cho Kỷ Niệm",
          code: "flower9",
          productCode: "flower9",
          id: "flower_9",
          price: 450000,
          salePrice: 390000,
          imageUrl: "https://hoatuoithanhthao.com/media/ftp/bo-hoa-tuoi-11.jpg",
          category: "ky-niem",
          categoryName: "Hoa kỉ niệm", 
          categorySlug: "hoa-ky-niem",
          description: "Bó hoa kỷ niệm đặc biệt, gồm hoa hồng và hoa cúc, là sự lựa chọn hoàn hảo cho các dịp kỷ niệm quan trọng.",
          inStock: true,
          rating: 4.8,
          reviews: 95,
          tags: [
            "kỷ niệm",
            "lãng mạn",
            "trang trọng"
          ]
        }
      };
      
      // Lưu dữ liệu mẫu vào Firebase
      await updateData(FLOWERS_PATH, sampleFlowers);
      console.log("Đã khởi tạo dữ liệu hoa mẫu");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Lỗi khi khởi tạo dữ liệu hoa:", error);
    throw error;
  }
};

/**
 * Thêm đánh giá cho một sản phẩm hoa
 */
export const addFlowerReview = async (flowerId: string, reviewData: any) => {
  try {
    // Thêm đánh giá vào reviews
    const reviewId = await pushData(`${REVIEWS_PATH}/${flowerId}`, reviewData);
    
    // Lấy thông tin hiện tại của sản phẩm
    const flowerData = await getFlowerById(flowerId);
    
    if (flowerData) {
      // Cập nhật tổng đánh giá và số lượng đánh giá
      const currentReviews = flowerData.reviews || 0;
      const currentRating = flowerData.rating || 0;
      
      // Tính rating mới (trung bình cộng có trọng số)
      const newRating = (currentRating * currentReviews + reviewData.rating) / (currentReviews + 1);
      
      // Cập nhật sản phẩm với rating mới và tăng số lượng reviews
      await updateFlower(flowerId, {
        ...flowerData,
        rating: parseFloat(newRating.toFixed(1)),
        reviews: currentReviews + 1
      });
    }
    
    return reviewId;
  } catch (error) {
    console.error(`Lỗi khi thêm đánh giá cho hoa ${flowerId}:`, error);
    throw error;
  }
};

/**
 * Lấy tất cả đánh giá của một sản phẩm hoa
 */
export const getFlowerReviews = async (flowerId: string) => {
  try {
    const reviews = await fetchData(`${REVIEWS_PATH}/${flowerId}`);
    return reviews;
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá của hoa ${flowerId}:`, error);
    throw error;
  }
};

/**
 * Nhập dữ liệu JSON cho sản phẩm hoa
 * @param jsonData Dữ liệu JSON cần nhập
 * @param replaceAll Nếu true, sẽ thay thế toàn bộ dữ liệu hiện có
 */
export const importFlowersFromJson = async (jsonData: any, replaceAll: boolean = false) => {
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Dữ liệu JSON không hợp lệ');
    }

    // Nếu thay thế toàn bộ dữ liệu
    if (replaceAll) {
      await updateData(FLOWERS_PATH, jsonData);
      console.log("Đã nhập dữ liệu mới và thay thế toàn bộ dữ liệu cũ");
      return { success: true, message: "Đã nhập thành công và thay thế toàn bộ dữ liệu", count: Object.keys(jsonData).length };
    } 
    // Nếu chỉ cập nhật một số sản phẩm
    else {
      // Lấy dữ liệu hiện tại
      const existingData = await getAllFlowers() || {};
      
      // Hợp nhất dữ liệu mới với dữ liệu hiện tại
      const mergedData = { ...existingData, ...jsonData };
      
      await updateData(FLOWERS_PATH, mergedData);
      console.log("Đã nhập dữ liệu mới và cập nhật với dữ liệu cũ");
      
      // Đếm số sản phẩm được cập nhật
      const updatedCount = Object.keys(jsonData).length;
      return { 
        success: true, 
        message: `Đã nhập thành công và cập nhật ${updatedCount} sản phẩm`, 
        count: updatedCount 
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi nhập dữ liệu JSON:", error);
    return { success: false, message: `Lỗi: ${error.message || 'Không xác định'}` };
  }
};

// Thêm hàm để khởi tạo dữ liệu danh mục nếu không có
export const initializeCategoriesData = async (forceUpdate: boolean = false) => {
  try {
    // Kiểm tra xem đã có dữ liệu danh mục chưa
    const existingData = await getAllCategories();
    
    // Nếu không có dữ liệu hoặc forceUpdate = true, thêm dữ liệu mẫu
    if (!existingData || forceUpdate) {
      const sampleCategories = {
        "cat-roses": {
          name: "Hoa hồng",
          description: "Các loại hoa hồng tươi và đẹp",
          id: "roses",  // ID của danh mục (thường là tiếng Anh hoặc không dấu)
          slug: "hoa-hong", // Slug của danh mục (sử dụng trong URL)
          displayName: "Hoa Hồng" // Tên hiển thị của danh mục
        },
        "cat-lily": {
          name: "Hoa lily",
          description: "Hoa lily tinh tế và thanh lịch",
          id: "lilies",
          slug: "hoa-lily",
          displayName: "Hoa Lily"
        },
        "cat-sunflower": {
          name: "Hoa hướng dương",
          description: "Hoa hướng dương rực rỡ và tươi sáng",
          id: "sunflowers",
          slug: "hoa-huong-duong",
          displayName: "Hoa Hướng Dương"
        },
        "cat-ky-niem": {
          name: "Hoa kỉ niệm",
          description: "Hoa dùng để làm kỷ niệm các dịp quan trọng",
          id: "ky-niem",
          slug: "hoa-ky-niem",
          displayName: "Hoa Kỉ Niệm"
        },
        "cat-qua-tang": {
          name: "Hoa quà tặng",
          description: "Hoa dùng làm quà tặng trong các dịp đặc biệt",
          id: "qua-tang",
          slug: "hoa-qua-tang",
          displayName: "Hoa Quà Tặng"
        },
        "cat-tinh-yeu": {
          name: "Hoa tình yêu",
          description: "Hoa biểu tượng cho tình yêu và sự lãng mạn",
          id: "tinh-yeu",
          slug: "hoa-tinh-yeu",
          displayName: "Hoa Tình Yêu"
        },
        "cat-trang-tri": {
          name: "Hoa trang trí",
          description: "Hoa dùng để trang trí không gian sống và làm việc",
          id: "trang-tri",
          slug: "hoa-trang-tri",
          displayName: "Hoa Trang Trí"
        }
      };
      
      // Lưu dữ liệu mẫu vào Firebase
      await updateData(CATEGORIES_PATH, sampleCategories);
      console.log("Đã khởi tạo dữ liệu danh mục mẫu");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Lỗi khi khởi tạo dữ liệu danh mục:", error);
    throw error;
  }
};

/**
 * Nhập dữ liệu JSON cho danh mục
 * @param jsonData Dữ liệu JSON cần nhập
 * @param replaceAll Nếu true, sẽ thay thế toàn bộ dữ liệu hiện có
 */
export const importCategoriesFromJson = async (jsonData: any, replaceAll: boolean = false) => {
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Dữ liệu JSON không hợp lệ');
    }

    // Nếu thay thế toàn bộ dữ liệu
    if (replaceAll) {
      await updateData(CATEGORIES_PATH, jsonData);
      console.log("Đã nhập dữ liệu danh mục mới và thay thế toàn bộ dữ liệu cũ");
      return { 
        success: true, 
        message: "Đã nhập thành công và thay thế toàn bộ dữ liệu danh mục", 
        count: Object.keys(jsonData).length 
      };
    } 
    // Nếu chỉ cập nhật một số danh mục
    else {
      // Lấy dữ liệu hiện tại
      const existingData = await getAllCategories() || {};
      
      // Hợp nhất dữ liệu mới với dữ liệu hiện tại
      const mergedData = { ...existingData, ...jsonData };
      
      await updateData(CATEGORIES_PATH, mergedData);
      console.log("Đã nhập dữ liệu danh mục mới và cập nhật với dữ liệu cũ");
      
      // Đếm số danh mục được cập nhật
      const updatedCount = Object.keys(jsonData).length;
      return { 
        success: true, 
        message: `Đã nhập thành công và cập nhật ${updatedCount} danh mục`, 
        count: updatedCount 
      };
    }
  } catch (error: any) {
    console.error("Lỗi khi nhập dữ liệu JSON cho danh mục:", error);
    return { success: false, message: `Lỗi: ${error.message || 'Không xác định'}` };
  }
}; 