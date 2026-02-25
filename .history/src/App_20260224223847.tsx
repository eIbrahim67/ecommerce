import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GlobalLoader } from "./components/GlobalLoader";
import { ErrorBoundary } from "./components/ErrorFallback";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
