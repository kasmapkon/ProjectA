import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OrderContextType {
  newOrderId: string | undefined;
  setNewOrderId: (orderId: string | undefined) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newOrderId, setNewOrderId] = useState<string | undefined>(undefined);

  return (
    <OrderContext.Provider
      value={{
        newOrderId,
        setNewOrderId
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}; 