"use client";
import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkletonWrapper from "@/components/SkletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

const StatsCards = ({ from, to, userSettings }: Props) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-green-500 " />
          }
          border={"border-green-500"}
          textColor={"text-green-500"}
        />
      </SkletonWrapper>

      <SkletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 " />
          }
          border={"border-red-500"}
          textColor={"text-red-500"}
        />
      </SkletonWrapper>

      <SkletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 " />
          }
          border={"border-violet-500"}
          textColor={"text-violet-500"}
        />
      </SkletonWrapper>
    </div>
  );
};

export default StatsCards;

function StatCard({
  formatter,
  value,
  title,
  icon,
  border,
  textColor,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: string;
  value: number;
  border: string;
  textColor: string;
}) {
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card
      className={cn(
        "flex h-32 w-full items-center gap-2 p-4",
        border,
        textColor
      )}
    >
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="mb-2 text-secondary-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-3xl"
        />
      </div>
    </Card>
  );
}
