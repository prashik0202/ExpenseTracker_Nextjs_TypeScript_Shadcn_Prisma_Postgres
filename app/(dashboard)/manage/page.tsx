"use client";
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkletonWrapper from "@/components/SkletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

const ManagePage = () => {
  return (
    <>
      {/* Header starts*/}
      <div className="container bg-card">
        <div className="flex-col flex-wrap p-2">
          <h1 className="text-2xl text-secondary-foreground">Manage</h1>
          <p className="text-sm mt-2 text-secondary-foreground">
            Manage your account settings and categories here
          </p>
        </div>
      </div>
      {/* Header End */}
      <div className="container flex flex-col gap-2 p-2">
        <Card className="border-none">
          <CardHeader>
            <CardHeader>
              <CardTitle>Currency</CardTitle>
              <CardDescription>
                Set your default currency for transaction
              </CardDescription>
            </CardHeader>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default ManagePage;

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["category", type],
    queryFn: () =>
      fetch(`/api/category?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === "income" ? "Incomes" : "Expenses"} categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallBack={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>

        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "expense" ? "text-rose-500" : "text-emerald-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>
            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="flex flex-wrap gap-2">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-none flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-2xl" role="img">
          {category.icon}
        </span>
        <span className="text-sm">{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4" />
            <span className="hidden md:block">Remove</span>
          </Button>
        }
      />
    </div>
  );
}
