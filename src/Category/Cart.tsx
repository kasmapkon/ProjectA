import React, { useReducer, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface State {
  total: number;
  items: CartItem[];
}

const reducer = (state: State, action: { type: string; payload?: CartItem }) => {
  switch (action.type) {
    case "ADD_TO_CART":
      if (!action.payload) return state;
      const { name, price } = action.payload;
      const existingItem = state.items.find((item) => item.name === name);

      if (existingItem) {
        return {
          ...state,
          total: state.total + price,
          items: state.items.map((item) =>
            item.name === name ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }

      return {
        ...state,
        total: state.total + price,
        items: [...state.items, { name, price, quantity: 1 }],
      };

    default:
      return state;
  }
};

const Cart = () => {
  const [state, dispatch] = useReducer(reducer, { total: 0, items: [] });
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleAddCategory = (name: string, price: number) => {
    dispatch({ type: "ADD_TO_CART", payload: { name, price, quantity: 1 } });
    toast.success(`${name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDeleteCategory = () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      toast.error("Category deleted!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const filteredItems = state.items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">🛒 Shopping Cart</h1>

      <div className="mb-4">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search in cart..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full rounded-lg"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
          <span>Laptop - $1000</span>
          <button
            onClick={() => handleAddCategory("Laptop", 1000)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>

        <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
          <span>Phone - $500</span>
          <button
            onClick={() => handleAddCategory("Phone", 500)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>

        <div className="flex justify-between bg-gray-100 p-3 rounded-lg">
          <span>Headphones - $100</span>
          <button
            onClick={() => handleAddCategory("Headphones", 100)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🛍️ Items in Cart:</h2>
        {filteredItems.length === 0 ? (
          <p className="text-gray-500">No matching products found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 text-center">
        <h1 className="text-xl font-bold">Total: $ {state.total}</h1>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleDeleteCategory}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Category
        </button>
      </div>
    </div>
  );
};

export default Cart;
