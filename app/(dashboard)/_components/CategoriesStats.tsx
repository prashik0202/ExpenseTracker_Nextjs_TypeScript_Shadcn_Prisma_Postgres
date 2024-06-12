import { getCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkletonWrapper from "@/components/SkletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

const CategoriesStats = ({ userSettings, from, to }: Props) => {
  // fetching the User Stats for specofic date
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  // formatter is used change the currency format when user changed the currency
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex gap-2 w-full flex-wrap md:flex-nowrap">
      <SkletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkletonWrapper>
      <SkletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkletonWrapper>
    </div>
  );
};

export default CategoriesStats;

function CategoriesCard({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: getCategoriesStatsResponseType;
}) {
  const filterData = data.filter((el) => el.type === type);
  const total = filterData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

  return (
    <Card className="w-full h-80 col-span-6 border-none">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-secondary-foreground md:grid-flow-col">
          <h1 className="text-2xl font-normal">
            {type === "income" ? "Income" : "Expense"}
          </h1>
        </CardTitle>
      </CardHeader>

      <div className="flex justify-between items-center gap-2">
        {filterData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            <h1 className="text-xl">No data for selected period</h1>
            <p className="text-sm text-muted-foreground text-center">
              Try selecting a different period <br /> or try adding new{" "}
              {type === "expense" ? "expense" : "income"}
            </p>
          </div>
        )}

        {filterData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filterData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);

                return (
                  <div key={item.category} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-secondary-foreground">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-secondary-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className="text-sm text-secondary-foreground">
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      className={cn(
                        `h-1`,
                        item.type === "expense"
                          ? "[&>*]:bg-red-500"
                          : "[&>*]:bg-green-500"
                      )}
                      // type={item.type}
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
