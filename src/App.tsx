/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewScreen } from './components/OverviewScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { ProductsScreen } from './components/ProductsScreen';
import { CustomersScreen } from './components/CustomersScreen';
import { HomepageScreen } from './components/HomepageScreen';
import { StaffScreen } from './components/StaffScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NewOrderModal } from './components/NewOrderModal';
import { NewProductModal } from './components/NewProductModal';
import { SlipZoomModal } from './components/SlipZoomModal';
import { ToastNotification } from './components/ToastNotification';

import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ACTIVITY_LOGS,
} from './data/mockData';
import { Order, Product, Customer, ActivityLog, OrderStatus } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<string>('owner');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data Collections
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);

  // Inspector and Modal States
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('ord-1030');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [slipZoom, setSlipZoom] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    amount: string;
    orderId?: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
    amount: '',
  });

  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
  };

  // Pending review orders count
  const pendingReviewsCount = orders.filter((o) => o.status === 'review').length;

  // Navigation helpers
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderInspector = (orderIdentifier: string) => {
    const found = orders.find(
      (o) => o.orderNumber === orderIdentifier || o.id === orderIdentifier
    );
    if (found) {
      setSelectedOrderId(found.id);
    } else {
      setSelectedOrderId(orderIdentifier);
    }
    setCurrentTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            all: 'အားလုံး',
            awaiting_payment: 'ငွေစောင့်ဆဲ',
            review: 'စစ်ဆေးရန်',
            confirmed: 'အတည်ပြုပြီး',
            packing: 'ထုပ်ပိုးနေ',
            shipped: 'ပို့ပြီး',
            delivered: 'ရောက်ပြီး',
            cancelled: 'ပယ်ဖျက်ပြီး',
          };
          return {
            ...ord,
            status: newStatus,
            statusLabel: statusLabels[newStatus] || newStatus,
            internalNote: note !== undefined ? note : ord.internalNote,
          };
        }
        return ord;
      })
    );

    // Add activity log
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (targetOrder) {
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        role: currentRole === 'owner' ? 'Owner' : currentRole === 'manager' ? 'Manager' : 'Order Staff',
        name: currentRole === 'owner' ? 'ဒေါ်အေးအေးမာ' : currentRole === 'manager' ? 'ကိုအောင်နိုင်' : 'သီတာ',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: `Order ${targetOrder.orderNumber} ကို ${newStatus} အဖြစ် အတည်ပြု ပြင်ဆင်ခဲ့သည်။`,
        highlight: targetOrder.orderNumber,
        dotColor: newStatus === 'confirmed' ? 'bg-[#2a7146]' : newStatus === 'cancelled' ? 'bg-[#ad3229]' : 'bg-[#2c3f8f]',
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }
  };

  // Add order
  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      role: 'Staff',
      name: 'အရောင်းစာရင်း',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: `${newOrder.customerName} ထံမှ ${newOrder.orderNumber} အသစ် စာရင်းသွင်းခဲ့သည်။`,
      highlight: newOrder.orderNumber,
      dotColor: 'bg-[#2c3f8f]',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Update product (e.g. stock matrix save)
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.sku === updated.sku ? updated : p)));
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      role: 'Manager',
      name: 'ကိုအောင်နိုင်',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: `"${updated.title}" (${updated.sku}) ၏ Stock Matrix လက်ကျန် ပြင်ဆင်သိမ်းဆည်းခဲ့သည်။`,
      highlight: updated.sku,
      dotColor: 'bg-[#835500]',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Add product
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Customer notes
  const handleUpdateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes } : c))
    );
  };

  // Open slip zoom modal
  const handleOpenSlipZoom = (imageUrl: string, title: string, amount: string) => {
    setSlipZoom({
      isOpen: true,
      url: imageUrl,
      title,
      amount,
      orderId: selectedOrderId || undefined,
    });
  };

  return (
    <div className="bg-[#f3f4f8] min-h-screen text-[#151a30] font-sans antialiased flex">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        reviewCount={pendingReviewsCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[232px]">
        {/* Top Header Bar */}
        <Header
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigateToTab={handleSelectTab}
          pendingReviewsCount={pendingReviewsCount}
        />

        {/* Dynamic Screen Viewport */}
        <main className="relative pt-16 min-h-[calc(100vh-4rem)] pb-12">
          {currentTab === 'overview' && (
            <OverviewScreen
              onNavigateTab={handleSelectTab}
              onOpenOrderInspector={handleOpenOrderInspector}
              onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
              onShowToast={showToast}
              activityLogs={activityLogs}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersScreen
              orders={orders}
              selectedOrderId={selectedOrderId}
              onSelectOrder={setSelectedOrderId}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenNewOrderModal={() => setIsNewOrderModalOpen(true)}
              onOpenSlipZoom={handleOpenSlipZoom}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'products' && (
            <ProductsScreen
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersScreen
              customers={customers}
              onAddOrder={handleAddOrder}
              onUpdateCustomerNotes={handleUpdateCustomerNotes}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'homepage' && (
            <HomepageScreen products={products} onShowToast={showToast} />
          )}

          {currentTab === 'staff' && (
            <StaffScreen onShowToast={showToast} />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={products}
        onAddOrder={handleAddOrder}
        onShowToast={showToast}
      />

      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        onShowToast={showToast}
      />

      <SlipZoomModal
        isOpen={slipZoom.isOpen}
        onClose={() => setSlipZoom((prev) => ({ ...prev, isOpen: false }))}
        imageUrl={slipZoom.url}
        title={slipZoom.title}
        amount={slipZoom.amount}
        onVerify={() => {
          if (slipZoom.orderId) {
            handleUpdateOrderStatus(slipZoom.orderId, 'confirmed');
            showToast('ငွေလွှဲ အတည်ပြုပြီး', 'ငွေလွှဲစလစ် အောင်မြင်စွာ အတည်ပြုပြီး Paid အဖြစ် သတ်မှတ်လိုက်ပါသည်။');
          }
        }}
      />

      {/* Global Toast Alert */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
