"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import React from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

const OverView = ({ userSettings }: { userSettings: UserSettings }) => {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h1 className="text-2xl">Overview</h1>
        <div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(value) => {
              const { from, to } = value.range;
              // we update the date range only if both dates are set
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `the selected date range is too big.Max allow range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container flex w-full flex-col gap-2">
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
      </div>
    </>
  );
};

export default OverView;
