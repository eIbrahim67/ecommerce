import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GlobalLoader } from "./components/GlobalLoader";
import { ErrorBoundary } from "./components/ErrorFallback";
import ScrollToTop from "./components/ScrollToTop";
import "./i18n/config";

// Lazy Loaded Pages
const Index = React.lazy(() => import("./pages/Index"));
const Shop = React.lazy(() => import("./pages/Shop"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Account = React.lazy(() => import("./pages/Account"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const PaymentCallback = React.lazy(() => import("./pages/PaymentCallback"));
const PaymentProcessing = React.lazy(() => import("./pages/PaymentProcessing"));
const OrderConfirmation = React.lazy(() => import("./pages/OrderConfirmation"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetail = React.lazy(() => import("./pages/OrderDetail"));

// Admin Pages
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = React.lazy(() => import("./pages/admin/AdminCategories"));
const AdminOrders = React.lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = React.lazy(() => import("./pages/admin/AdminUsers"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<GlobalLoader />}>
                    <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Public Routes (Cart & Checkout accessible to guests) */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/payment-processing" element={<PaymentProcessing />} />
                    <Route path="/payment-callback" element={<PaymentCallback />} />
                    <Route path="/order/:orderId/confirmation" element={<OrderConfirmation />} />

                    {/* Protected Routes */}
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

                    {/* Auth helpers */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><AdminCategories /></ProtectedRoute>} />
                    <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
