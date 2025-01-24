"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { ArrowDownWideNarrow } from "lucide-react";

import api from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomSlider } from "@/components/ui/custom-slider";

interface Category {
  _id: string;
  name: string;
}

interface FilterProductProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: [number, number];
  }) => void;
  minPrice: number;
  maxPrice: number;
}

const FilterProduct: React.FC<FilterProductProps> = ({
  onFilterChange,
  minPrice,
  maxPrice,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const params = useParams();

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const fetchCategories = async () => {
    try {
      const response = await api.get(
        `/v1/category/get-category-by-storeId/${params.storeId}`
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.log("Error while fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedCategories);
    onFilterChange({
      categories: updatedCategories,
      priceRange,
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newPriceRange: [number, number] = [value[0], value[1]];
    setPriceRange(newPriceRange);
    onFilterChange({
      categories: selectedCategories,
      priceRange: newPriceRange,
    });
  };

  const handleResetFilter = () => {
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    onFilterChange({
      categories: [],
      priceRange: [minPrice, maxPrice],
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          <ArrowDownWideNarrow className="mr-2 h-4 w-4" />
          Filter
          {(selectedCategories.length > 0 ||
            priceRange[0] !== minPrice ||
            priceRange[1] !== maxPrice) && (
            <span className="ml-2 h-2 w-2 rounded-full bg-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[300px] p-4 bg-white shadow-xl rounded-lg"
      >
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={selectedCategories.includes(category._id)}
                  onCheckedChange={() => handleCategoryToggle(category._id)}
                />
                <label
                  htmlFor={category._id}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="my-5">
          <h4 className="font-semibold text-sm">Price Range</h4>
          <div className="pt-4">
            <CustomSlider
              min={minPrice}
              max={maxPrice}
              step={1}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={handlePriceChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>

        <Button
          onClick={handleResetFilter}
          variant="outline"
          className="w-full mt-4"
        >
          Reset Filters
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterProduct;
