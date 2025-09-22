"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X, Download, RefreshCw } from "lucide-react";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  onExport: (format: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export interface FilterState {
  timeframe: string;
  state?: string;
  sector?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

const states = [
  "All States", "Maharashtra", "Uttar Pradesh", "Karnataka", "Tamil Nadu", 
  "Gujarat", "Rajasthan", "West Bengal", "Madhya Pradesh", "Haryana", "Punjab"
];

const sectors = [
  "All Sectors", "Information Technology", "Healthcare", "Finance", 
  "Manufacturing", "Education", "Government", "Agriculture", "Retail"
];

export default function FilterPanel({ onFilterChange, onExport, onRefresh, isLoading }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    timeframe: "30d"
  });
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    
    // Update active filters for display
    const newActiveFilters = [];
    if (newFilters.state && newFilters.state !== "All States") {
      newActiveFilters.push(`State: ${newFilters.state}`);
    }
    if (newFilters.sector && newFilters.sector !== "All Sectors") {
      newActiveFilters.push(`Sector: ${newFilters.sector}`);
    }
    if (newFilters.timeframe !== "30d") {
      newActiveFilters.push(`Period: ${newFilters.timeframe}`);
    }
    setActiveFilters(newActiveFilters);
  };

  const clearFilters = () => {
    const defaultFilters = { timeframe: "30d" };
    setFilters(defaultFilters);
    setActiveFilters([]);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2" />
          Dashboard Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
          {/* Time Period */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select
              value={filters.timeframe}
              onValueChange={(value) => handleFilterChange("timeframe", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Select
              value={filters.state || "All States"}
              onValueChange={(value) => handleFilterChange("state", value === "All States" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sector Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sector</label>
            <Select
              value={filters.sector || "All Sectors"}
              onValueChange={(value) => handleFilterChange("sector", value === "All Sectors" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Actions</label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export</label>
            <Select onValueChange={onExport}>
              <SelectTrigger>
                <SelectValue placeholder="Export as..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {activeFilters.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Clear</label>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Active Filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
