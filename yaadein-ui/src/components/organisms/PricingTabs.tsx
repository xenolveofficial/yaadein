"use client";

import * as React from "react";
import { HOST_PLANS, PHOTOGRAPHER_PLANS } from "@/content/plans.content";
import { PlanCard } from "@/components/molecules/PlanCard";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export function PricingTabs() {
  const [showInfraCost, setShowInfraCost] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("host");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
      {/* Tab Switcher & Toggle Container */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-border pb-6">
        <Tabs
          defaultValue="host"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-surface-secondary/80 border border-border p-1 rounded-xl flex gap-1 h-auto w-full md:w-auto">
            <TabsTrigger
              value="host"
              className="py-2.5 px-6 rounded-lg text-sm font-semibold tracking-wide data-active:bg-surface-primary data-active:text-brand-primary data-active:shadow-sm text-text-secondary w-full md:w-auto"
            >
              Event Host
            </TabsTrigger>
            <TabsTrigger
              value="photographer"
              className="py-2.5 px-6 rounded-lg text-sm font-semibold tracking-wide data-active:bg-surface-primary data-active:text-brand-primary data-active:shadow-sm text-text-secondary w-full md:w-auto"
            >
              Photographer
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "host" && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-secondary">
              Show infra cost basis
            </span>
            <Switch
              checked={showInfraCost}
              onCheckedChange={setShowInfraCost}
              aria-label="Toggle infra cost visibility"
            />
          </div>
        )}
      </div>

      {/* Plans Content Grid */}
      <Tabs defaultValue="host" value={activeTab} className="w-full">
        {/* Host Plans Content */}
        <TabsContent value="host" className="outline-none">
          <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
            {HOST_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="snap-center shrink-0 min-w-[290px] w-full md:w-auto md:min-w-0"
              >
                <PlanCard
                  plan={plan}
                  showInfraCost={showInfraCost}
                  className={
                    plan.id === "starter"
                      ? "bg-surface-secondary border-2 border-dashed border-border shadow-none"
                      : ""
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Photographer Plans Content */}
        <TabsContent value="photographer" className="outline-none">
          <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-3 md:overflow-visible">
            {PHOTOGRAPHER_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="snap-center shrink-0 min-w-[290px] w-full md:w-auto md:min-w-0"
              >
                <PlanCard
                  plan={plan}
                  showInfraCost={false}
                  className={
                    plan.id === "starter"
                      ? "bg-surface-secondary border-2 border-dashed border-border shadow-none"
                      : ""
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
