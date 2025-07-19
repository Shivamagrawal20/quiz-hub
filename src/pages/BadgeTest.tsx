import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BADGE_DEFINITIONS } from '@/lib/achievementSystem';
import { CheckCircle, XCircle, Filter, RefreshCw } from 'lucide-react';

const BadgeTest = () => {
  const [loadedBadges, setLoadedBadges] = useState<Set<string>>(new Set());
  const [failedBadges, setFailedBadges] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const handleImageLoad = (badgeId: string) => {
    setLoadedBadges(prev => new Set(prev).add(badgeId));
    setFailedBadges(prev => {
      const newSet = new Set(prev);
      newSet.delete(badgeId);
      return newSet;
    });
  };

  const handleImageError = (badgeId: string) => {
    setFailedBadges(prev => new Set(prev).add(badgeId));
    setLoadedBadges(prev => {
      const newSet = new Set(prev);
      newSet.delete(badgeId);
      return newSet;
    });
  };

  const resetTest = () => {
    setLoadedBadges(new Set());
    setFailedBadges(new Set());
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'participation': return 'bg-green-100 text-green-800';
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'efficiency': return 'bg-orange-100 text-orange-800';
      case 'consistency': return 'bg-purple-100 text-purple-800';
      case 'mastery': return 'bg-red-100 text-red-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique categories and rarities for filtering
  const categories = ['all', ...Array.from(new Set(BADGE_DEFINITIONS.map(b => b.category)))];
  const rarities = ['all', ...Array.from(new Set(BADGE_DEFINITIONS.map(b => b.rarity)))];

  // Filter badges based on selected category and rarity
  const filteredBadges = BADGE_DEFINITIONS.filter(badge => {
    const categoryMatch = selectedCategory === 'all' || badge.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || badge.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Badge Test Page</h1>
          <p className="text-gray-600 mb-4">
            This page tests all badge images to ensure they load correctly. Total badges: {BADGE_DEFINITIONS.length}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Loaded: {loadedBadges.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium">Failed: {failedBadges.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Pending: {BADGE_DEFINITIONS.length - loadedBadges.size - failedBadges.size}
              </span>
            </div>
            <Button 
              onClick={resetTest} 
              variant="outline" 
              size="sm"
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Test
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRarity} onValueChange={setSelectedRarity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rarity" />
              </SelectTrigger>
              <SelectContent>
                {rarities.map(rarity => (
                  <SelectItem key={rarity} value={rarity}>
                    {rarity === 'all' ? 'All Rarities' : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600">
              Showing {filteredBadges.length} of {BADGE_DEFINITIONS.length} badges
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => {
            const IconComponent = badge.icon;
            const isLoaded = loadedBadges.has(badge.id);
            const hasFailed = failedBadges.has(badge.id);
            
            return (
              <Card 
                key={badge.id} 
                className={`transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  isLoaded 
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : hasFailed 
                    ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">{badge.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={`text-xs px-2 py-1 font-medium ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 font-medium ${getCategoryColor(badge.category)}`}>
                          {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {isLoaded && <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" />}
                      {hasFailed && <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Badge Image Section - Direct display */}
                  <div className="flex justify-center">
                    {badge.imagePath ? (
                      <div className={`transition-all duration-300 ${
                        isLoaded 
                          ? 'ring-4 ring-green-200 scale-105' 
                          : hasFailed 
                          ? 'opacity-60 ring-4 ring-red-200' 
                          : 'ring-2 ring-gray-200 hover:scale-105'
                      }`}>
                        <img 
                          src={badge.imagePath} 
                          alt={badge.name}
                          className="h-32 w-32 object-contain drop-shadow-lg"
                          onLoad={() => handleImageLoad(badge.id)}
                          onError={() => handleImageError(badge.id)}
                        />
                      </div>
                    ) : (
                      <div className={`w-32 h-32 ${badge.color} rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isLoaded 
                          ? 'ring-4 ring-green-200 scale-105' 
                          : hasFailed 
                          ? 'opacity-60 ring-4 ring-red-200' 
                          : 'ring-2 ring-gray-200 hover:scale-105'
                      }`}>
                        {IconComponent && (
                          <IconComponent className="h-16 w-16 text-white" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Badge Description - Better spacing */}
                  <div className="text-center px-2">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                  
                  {/* Technical Details - Enhanced styling */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>ID:</strong> {badge.id}</div>
                        <div><strong>Path:</strong> {badge.imagePath || 'No image'}</div>
                        <div><strong>Category:</strong> {badge.category}</div>
                        <div><strong>Status:</strong> 
                          {isLoaded ? ' ✅ Loaded' : hasFailed ? ' ❌ Failed' : ' ⏳ Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No badges match the selected filters.</p>
            <Button 
              onClick={() => {
                setSelectedCategory('all');
                setSelectedRarity('all');
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {failedBadges.size > 0 && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load ({failedBadges.size}):</h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Array.from(failedBadges).map(badgeId => {
                const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                return (
                  <li key={badgeId}>
                    • {badge?.name} ({badge?.imagePath})
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check that image files exist in the correct path</li>
            <li>• Ensure file names match exactly (including case sensitivity)</li>
            <li>• Verify file formats are supported (PNG, SVG, JPG)</li>
            <li>• Check browser console for 404 errors</li>
            <li>• Make sure the development server is running</li>
            <li>• Use the Reset Test button to retry loading</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BadgeTest; 