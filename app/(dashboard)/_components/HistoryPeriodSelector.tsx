import { GetHistoryPeriodResponseType } from "@/app/api/history-periods/route";
import SkletonWrapper from "@/components/SkletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeframe: TimeFrame;
  setTimeframe: (timeframe: TimeFrame) => void;
}

const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeframe,
  setTimeframe,
}: Props) => {
  const historyPeriods = useQuery<GetHistoryPeriodResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap  items-center gap-4">
      <SkletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <SkletonWrapper
            isLoading={historyPeriods.isFetching}
            fullWidth={false}
          >
            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={historyPeriods.data || []}
            />
          </SkletonWrapper>
          {timeframe === "month" && (
            <SkletonWrapper
              isLoading={historyPeriods.isFetching}
              fullWidth={false}
            >
              <MonthSelector period={period} setPeriod={setPeriod} />
            </SkletonWrapper>
          )}
        </div>
      </SkletonWrapper>
    </div>
  );
};

export default HistoryPeriodSelector;

// YEAR SELECTOR
function YearSelector({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodResponseType;
}) {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

//MONTH SELECTOR
function MonthSelector({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({ year: period.year, month: parseInt(value) });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {
          // taking array of moths
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
            const mothStr = new Date(period.year, month, 1).toLocaleString(
              "default",
              { month: "long" }
            );

            return (
              <SelectItem key={month} value={month.toString()}>
                {mothStr}
              </SelectItem>
            );
          })
        }
      </SelectContent>
    </Select>
  );
}
