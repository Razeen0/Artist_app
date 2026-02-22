import React from "react";
import { View, Text } from "react-native";

interface StatusBadgeProps {
    status: string;
    size?: "sm" | "md";
}

const statusStyles: Record<string, { bg: string; dot: string; text: string }> = {
    active: { bg: "bg-success/10", dot: "bg-success", text: "text-success" },
    inactive: { bg: "bg-danger/10", dot: "bg-danger", text: "text-danger" },
    suspended: { bg: "bg-warn/10", dot: "bg-warn", text: "text-warn" },
    pending: { bg: "bg-warn/10", dot: "bg-warn", text: "text-warn" },
    confirmed: { bg: "bg-success/10", dot: "bg-success", text: "text-success" },
    completed: { bg: "bg-accent/10", dot: "bg-accent", text: "text-accent" },
    cancelled: { bg: "bg-danger/10", dot: "bg-danger", text: "text-danger" },
    paid: { bg: "bg-success/10", dot: "bg-success", text: "text-success" },
    unpaid: { bg: "bg-danger/10", dot: "bg-danger", text: "text-danger" },
    refunded: { bg: "bg-warn/10", dot: "bg-warn", text: "text-warn" },
};

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
    const s = status?.toLowerCase() || "inactive";
    const config = statusStyles[s] || statusStyles.inactive;

    return (
        <View className={`flex-row items-center self-start rounded-full gap-x-1.5 ${config.bg} ${size === "md" ? "px-3 py-1.5" : "px-2 py-0.5"}`}>
            <View className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            <Text className={`font-semibold capitalize ${config.text} ${size === "md" ? "text-xs" : "text-[10px]"}`}>
                {status}
            </Text>
        </View>
    );
}
