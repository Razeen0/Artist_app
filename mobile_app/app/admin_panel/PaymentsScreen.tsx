import React, { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../../components/admin/StatusBadge";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import KPICard from "../../components/admin/KPICard";

const PAYMENTS = [
    { id: "1", customer: "Priya Sharma", artist: "Meena K.", amount: "₹29,500", currency: "INR", status: "Paid", date: "Feb 20, 2026", service: "Bridal Makeup", method: "Stripe" },
    { id: "2", customer: "Ananya R.", artist: "Sai Veeranna", amount: "₹10,000", currency: "INR", status: "Paid", date: "Feb 18, 2026", service: "Party Makeup", method: "Stripe" },
    { id: "3", customer: "Divya M.", artist: "Aishwarya", amount: "₹6,700", currency: "INR", status: "Paid", date: "Feb 15, 2026", service: "Hair Styling", method: "Cash" },
    { id: "4", customer: "Kavitha N.", artist: "Meena K.", amount: "₹21,000", currency: "INR", status: "Unpaid", date: "Feb 22, 2026", service: "Engagement Look", method: "—" },
    { id: "5", customer: "Deepika S.", artist: "Priya M.", amount: "₹8,400", currency: "INR", status: "Refunded", date: "Feb 10, 2026", service: "Mehendi Design", method: "Stripe" },
    { id: "6", customer: "Lakshmi V.", artist: "Sai Veeranna", amount: "₹16,800", currency: "INR", status: "Paid", date: "Feb 20, 2026", service: "Editorial Makeup", method: "Stripe" },
];

const STATUS_FILTERS = ["All", "Paid", "Unpaid", "Refunded"];

export default function PaymentsScreen() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = useMemo(() => {
        return PAYMENTS.filter((p) => {
            const q = search.toLowerCase();
            const matchSearch = !q || p.customer.toLowerCase().includes(q) || p.artist.toLowerCase().includes(q);
            const matchStatus = statusFilter === "All" || p.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const totalPaid = PAYMENTS.filter(p => p.status === "Paid").reduce((s, p) => s + parseInt(p.amount.replace("₹", "").replace(",", "")), 0);
    const totalUnpaid = PAYMENTS.filter(p => p.status === "Unpaid").reduce((s, p) => s + parseInt(p.amount.replace("₹", "").replace(",", "")), 0);
    const totalRefunded = PAYMENTS.filter(p => p.status === "Refunded").reduce((s, p) => s + parseInt(p.amount.replace("₹", "").replace(",", "")), 0);

    const getIconForStatus = (status: string) => {
        switch (status) {
            case "Paid": return { name: "checkmark-circle" as const, color: "#22c55e", bg: "bg-success/10" };
            case "Refunded": return { name: "return-down-back" as const, color: "#f59e0b", bg: "bg-warn/10" };
            default: return { name: "alert-circle" as const, color: "#ef4444", bg: "bg-danger/10" };
        }
    };

    const getAmountColor = (status: string) => {
        switch (status) {
            case "Paid": return "text-success";
            case "Refunded": return "text-warn";
            default: return "text-danger";
        }
    };

    return (
        <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
            <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-slate-500 text-xs">Admin</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
                <Text className="text-slate-400 text-xs font-medium">Payments</Text>
            </View>

            <SectionHeader title="Payment Management" subtitle="Track all transactions and revenue" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
                <KPICard title="Total Revenue" value={`₹${totalPaid}`}
                    icon={<Ionicons name="cash" size={18} color="#22c55e" />} />
                <KPICard title="Pending" value={`₹${totalUnpaid}`}
                    icon={<Ionicons name="hourglass" size={18} color="#f59e0b" />} />
                <KPICard title="Refunded" value={`₹${totalRefunded}`}
                    icon={<Ionicons name="return-down-back" size={18} color="#ef4444" />} />
                <KPICard title="Transactions" value={PAYMENTS.length}
                    icon={<Ionicons name="receipt" size={18} color="#3b82f6" />} />
            </ScrollView>

            <SearchFilterBar searchValue={search} onSearchChange={setSearch}
                placeholder="Search by customer or artist..."
                statusOptions={STATUS_FILTERS} selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

            {filtered.map((payment) => {
                const icon = getIconForStatus(payment.status);
                return (
                    <View key={payment.id} className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5">
                        <View className="flex-row items-start gap-x-3 mb-3">
                            <View className={`w-11 h-11 rounded-xl items-center justify-center ${icon.bg}`}>
                                <Ionicons name={icon.name} size={22} color={icon.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white text-sm font-semibold">{payment.customer}</Text>
                                <Text className="text-slate-500 text-xs mt-0.5">{payment.service}</Text>
                            </View>
                            <View className="items-end gap-y-1.5">
                                <Text className={`text-lg font-bold ${getAmountColor(payment.status)}`}>
                                    {payment.status === "Refunded" ? "-" : ""}{payment.amount}
                                </Text>
                                <StatusBadge status={payment.status} />
                            </View>
                        </View>

                        <View className="bg-dark-800 rounded-xl p-3 gap-y-2">
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center gap-x-2 flex-1">
                                    <Ionicons name="brush-outline" size={13} color="#64748b" />
                                    <Text className="text-slate-400 text-xs">{payment.artist}</Text>
                                </View>
                                <View className="flex-row items-center gap-x-2 flex-1">
                                    <Ionicons name="calendar-outline" size={13} color="#64748b" />
                                    <Text className="text-slate-400 text-xs">{payment.date}</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center gap-x-2 flex-1">
                                    <Ionicons name="card-outline" size={13} color="#64748b" />
                                    <Text className="text-slate-400 text-xs">{payment.method}</Text>
                                </View>
                                <View className="flex-row items-center gap-x-2 flex-1">
                                    <Ionicons name="globe-outline" size={13} color="#64748b" />
                                    <Text className="text-slate-400 text-xs">{payment.currency}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            })}

            <View className="h-10" />
        </ScrollView>
    );
}
