/**
 * CSR (Client-Side Rendering) Demo Page
 *
 * ===========================================
 * WHAT IS CLIENT-SIDE RENDERING (CSR)?
 * ===========================================
 * CSR means the page is rendered in the browser (client) after it loads.
 * The server sends basic HTML + JavaScript, then JavaScript runs in the
 * browser to fetch data and build the page.
 *
 * WHEN TO USE CSR:
 * ✅ Interactive dashboards and admin panels
 * ✅ Real-time apps (chat, live updates)
 * ✅ Single Page Applications (SPAs)
 * ✅ Complex user interactions
 *
 * BENEFITS:
 * ✅ Rich, interactive experiences
 * ✅ Fast navigation after initial load
 * ✅ Great for complex interactions
 *
 * DRAWBACKS:
 * ❌ Slower first load (needs to download JS)
 * ❌ SEO challenges
 * ❌ Needs loading states
 */

"use client"; // This makes it a CLIENT COMPONENT. Now we can use hooks like useState and useEffect. They only works in client components.

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, ShoppingCart } from "lucide-react";
import Header from "@/components/examples/csr-demo/header";
import InfoCard from "@/components/examples/csr-demo/info-card";
import Footer from "@/components/examples/csr-demo/footer";

/**
 * Simple Product interface
 */
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

/**
 * CSR Demo Component
 * Shows basic client-side rendering patterns
 */
export default function CSRDemo() {
  /**
   * STATE MANAGEMENT WITH USESTATE
   * All state is managed in the browser
   */

  // Products from API - starts empty, filled by useEffect
  const [products, setProducts] = useState<Product[]>([]);

  // Loading state - shows spinner while fetching data
  const [loading, setLoading] = useState<boolean>(true);

  // Search term - updates as user types
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Liked products - user can like/unlike products
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  // Cart items - simple shopping cart
  const [cartCount, setCartCount] = useState<number>(0);

  /**
   * CLIENT-SIDE DATA FETCHING WITH USEEFFECT
   * This runs AFTER the component mounts in the browser
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This API call happens in the browser
        const response = await fetch(
          "https://fakestoreapi.com/products?limit=6"
        );
        const data: Product[] = await response.json();

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty array means this runs once when component mounts

  /**
   * EVENT HANDLERS
   * These handle user interactions in the browser
   */

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle like status for a product
  const toggleLike = (productId: number) => {
    if (likedProducts.includes(productId)) {
      // Remove from likes
      setLikedProducts(likedProducts.filter((id) => id !== productId));
    } else {
      // Add to likes
      setLikedProducts([...likedProducts, productId]);
    }
  };

  // Add item to cart
  const addToCart = () => {
    setCartCount(cartCount + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <Header />

        {/* Info Card */}
        <InfoCard />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products from API...</p>
          </div>
        )}

        {/* Main Content - Only show when not loading */}
        {!loading && (
          <>
            {/* Search and Stats */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Cart Counter */}
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{likedProducts.length} liked</span>
                  </Badge>

                  <Badge
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{cartCount} in cart</span>
                  </Badge>
                </div>
              </div>

              {/* Search Results */}
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-white p-4 relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain"
                      priority={false}
                    />
                  </div>

                  {/* Product Info */}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.title}
                    </h3>

                    <p className="text-lg font-bold text-green-600 mb-4">
                      ${product.price}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant={
                          likedProducts.includes(product.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => toggleLike(product.id)}
                        className="flex-1"
                      >
                        <Heart
                          className={`w-4 h-4 mr-2 ${
                            likedProducts.includes(product.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        {likedProducts.includes(product.id) ? "Liked" : "Like"}
                      </Button>

                      <Button size="sm" onClick={addToCart} className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {`No products found for "${searchTerm}"`}
                </p>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
