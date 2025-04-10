"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Eye, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export const AnalyticsClient = ({ mostVisited, mostPurchased }) => {
  const params = useParams();

  const firstProduct = mostVisited[0];
  const firstMostPurchased = mostPurchased[0];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Analytics" description="Analytics for your business" />
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          {!firstProduct ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  No most visited products found.
                </p>
              </div>
            </Card>
          ) : (
            <Link href={`/${params.storeId}/analytics/most-visited`}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Most Visited Products
                      </CardTitle>
                      <CardDescription>
                        Top products by page views
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="sr-only">
                        View all most visited products
                      </span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="relative aspect-square w-24 h-24 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={firstProduct.thumbnail}
                          alt={firstProduct.name}
                          fill
                          className="object-cover transition-all group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base line-clamp-2 mb-1">
                          {firstProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          <span>{firstProduct.visitCount} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
        <div>
          {!firstMostPurchased ? (
            <Card className="p-6">
              <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  No most purchased products found.
                </p>
              </div>
            </Card>
          ) : (
            <Link href={`/${params.storeId}/analytics/most-visited`}>
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Most purchased Products
                      </CardTitle>
                      <CardDescription>
                        Top products by purchased
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="sr-only">
                        View all most purchased products
                      </span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="relative aspect-square w-24 h-24 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={firstMostPurchased.thumbnail}
                          alt={firstMostPurchased.name}
                          fill
                          className="object-cover transition-all group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base line-clamp-2 mb-1">
                          {firstMostPurchased.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShoppingBag className="h-4 w-4" />
                          <span>
                            {firstMostPurchased.purchaseCount} purchase
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
