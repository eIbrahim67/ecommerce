// Reusable Skeleton Loading Components

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-card border border-border shadow-sm rounded-2xl p-4 animate-pulse">
      <div className="aspect-square rounded-xl bg-surface-light mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-surface-light rounded w-1/3"></div>
        <div className="h-4 bg-surface-light rounded w-full"></div>
        <div className="h-4 bg-surface-light rounded w-4/5"></div>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-surface-light rounded"></div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="h-6 bg-surface-light rounded w-20"></div>
          <div className="w-10 h-10 bg-surface-light rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-surface-light to-white border border-border/50 rounded-2xl p-6 text-center animate-pulse">
      <div className="w-16 h-16 bg-surface-light rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-surface-light rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-surface-light rounded w-1/2 mx-auto"></div>
    </div>
  );
};

export const FeatureCardSkeleton = () => {
  return (
    <div className="bg-surface-light border border-border/50 rounded-2xl p-6 text-center animate-pulse">
      <div className="w-10 h-10 bg-surface-light/50 rounded-full mx-auto mb-3"></div>
      <div className="h-4 bg-surface-light/50 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-surface-light/50 rounded w-1/2 mx-auto"></div>
    </div>
  );
};

export const ProductListSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const CategoryListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
      {[...Array(count)].map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ShopProductListSkeleton = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const SidebarSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-surface-light border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-5 bg-surface-light rounded w-1/2 mb-5"></div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 bg-surface-light rounded"></div>
                <div className="h-4 bg-surface-light rounded flex-1"></div>
              </div>
              <div className="w-8 h-5 bg-surface-light rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-white to-surface-light border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-5 bg-surface-light rounded w-2/3 mb-5"></div>
        <div className="h-2 bg-surface-light rounded w-full mb-3"></div>
        <div className="flex justify-between mb-6">
          <div className="h-3 bg-surface-light rounded w-16"></div>
          <div className="h-3 bg-surface-light rounded w-16"></div>
        </div>
        <div className="h-12 bg-surface-light rounded-xl"></div>
      </div>
    </div>
  );
};
