import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import KPICard from "../../components/admin/KPICard";

const BOOKINGS = [
    { id: "1", customer: "Priya Sharma", artist: "Meena K.", service: "Bridal Makeup", date: "Feb 25, 2026", time: "10:00 AM - 12:00 PM", amount: "₹29,500", status: "Confirmed" },
    { id: "2", customer: "Ananya R.", artist: "Sai Veeranna", service: "Party Makeup", date: "Feb 24, 2026", time: "2:00 PM - 3:00 PM", amount: "₹10,000", status: "Pending" },
    { id: "3", customer: "Divya M.", artist: "Aishwarya", service: "Hair Styling", date: "Feb 23, 2026", time: "11:00 AM - 11:45 AM", amount: "₹6,700", status: "Completed" },
    { id: "4", customer: "Kavitha N.", artist: "Meena K.", service: "Engagement Look", date: "Feb 22, 2026", time: "3:00 PM - 4:30 PM", amount: "₹21,000", status: "Pending" },
    { id: "5", customer: "Deepika S.", artist: "Priya M.", service: "Mehendi Design", date: "Feb 21, 2026", time: "9:00 AM - 10:00 AM", amount: "₹8,400", status: "Cancelled" },
    { id: "6", customer: "Lakshmi V.", artist: "Sai Veeranna", service: "Editorial Makeup", date: "Feb 20, 2026", time: "1:00 PM - 2:30 PM", amount: "₹16,800", status: "Completed" },
];

const STATUS_FILTERS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function BookingsScreen() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = useMemo(() => {
        return BOOKINGS.filter((b) => {
            const q = search.toLowerCase();
            const matchSearch = !q || b.customer.toLowerCase().includes(q) || b.artist.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
            const matchStatus = statusFilter === "All" || b.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const stats = {
        total: BOOKINGS.length,
        pending: BOOKINGS.filter(b => b.status === "Pending").length,
        confirmed: BOOKINGS.filter(b => b.status === "Confirmed").length,
        revenue: BOOKINGS.filter(b => b.status !== "Cancelled").reduce((s, b) => s + parseInt(b.amount.replace("₹", "").replace(",", "")), 0),
    };

    return (
        <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
            <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-slate-500 text-xs">Admin</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
                <Text className="text-slate-400 text-xs font-medium">Bookings</Text>
            </View>

            <SectionHeader title="Booking Management" subtitle="Track and manage all appointment bookings" />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
                <KPICard title="Total Bookings" value={stats.total}
                    icon={<Ionicons name="calendar" size={18} color="#3b82f6" />} />
                <KPICard title="Pending" value={stats.pending}
                    icon={<Ionicons name="hourglass" size={18} color="#f59e0b" />} />
                <KPICard title="Confirmed" value={stats.confirmed}
                    icon={<Ionicons name="checkmark-circle" size={18} color="#22c55e" />} />
                <KPICard title="Revenue" value={`₹${stats.revenue}`}
                    icon={<Ionicons name="cash" size={18} color="#a855f7" />} />
            </ScrollView>

            <SearchFilterBar searchValue={search} onSearchChange={setSearch}
                placeholder="Search customer, artist, or service..."
                statusOptions={STATUS_FILTERS} selectedStatus={statusFilter} onStatusChange={setStatusFilter} />

            {filtered.map((booking) => (
                <View key={booking.id} className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5">
                    <View className="flex-row items-start gap-x-3 mb-3">
                        <Avatar name={booking.customer} size={42} />
                        <View className="flex-1">
                            <Text className="text-white text-sm font-semibold">{booking.customer}</Text>
                            <Text className="text-slate-400 text-xs mt-0.5">{booking.service}</Text>
                        </View>
                        <View className="items-end gap-y-1.5">
                            <Text className="text-white text-base font-bold">{booking.amount}</Text>
                            <StatusBadge status={booking.status} />
                        </View>
                    </View>

                    <View className="bg-dark-800 rounded-xl p-3 gap-y-2 mb-3">
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="brush-outline" size={14} color="#64748b" />
                            <Text className="text-slate-400 text-xs">{booking.artist}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="calendar-outline" size={14} color="#64748b" />
                            <Text className="text-slate-400 text-xs">{booking.date}</Text>
                        </View>
                        <View className="flex-row items-center gap-x-2">
                            <Ionicons name="time-outline" size={14} color="#64748b" />
                            <Text className="text-slate-400 text-xs">{booking.time}</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-x-2 border-t border-white/5 pt-3">
                        <TouchableOpacity className="flex-row items-center gap-x-1 px-3 py-2 rounded-md bg-dark-800 border border-white/5">
                            <Ionicons name="eye-outline" size={16} color="#94a3b8" />
                            <Text className="text-slate-400 text-xs font-medium">View</Text>
                        </TouchableOpacity>
                        {booking.status === "Pending" && (
                            <>
                                <TouchableOpacity className="flex-row items-center gap-x-1 px-3 py-2 rounded-md bg-success/10 border border-success/20">
                                    <Ionicons name="checkmark" size={16} color="#22c55e" />
                                    <Text className="text-success text-xs font-medium">Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center gap-x-1 px-3 py-2 rounded-md bg-danger/10 border border-danger/20">
                                    <Ionicons name="close" size={16} color="#ef4444" />
                                    <Text className="text-danger text-xs font-medium">Cancel</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            ))}

            <View className="h-10" />
        </ScrollView>
    );
}
