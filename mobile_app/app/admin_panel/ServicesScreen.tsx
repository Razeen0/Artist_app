import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "../../components/admin/SectionHeader";
import SearchFilterBar from "../../components/admin/SearchFilterBar";
import KPICard from "../../components/admin/KPICard";
import { toast } from "../../utils/toast";

const SERVICES = [
    { id: "1", name: "Bridal Makeup", artist: "Meena K.", price: "₹29,500", duration: "120 min", category: "Bridal", bookings: 8 },
    { id: "2", name: "Party Makeup", artist: "Sai Veeranna", price: "₹10,000", duration: "60 min", category: "Party", bookings: 12 },
    { id: "3", name: "Hair Styling", artist: "Aishwarya", price: "₹6,700", duration: "45 min", category: "Hair", bookings: 6 },
    { id: "4", name: "Engagement Look", artist: "Meena K.", price: "₹21,000", duration: "90 min", category: "Bridal", bookings: 5 },
    { id: "5", name: "Natural Everyday", artist: "Aishwarya", price: "₹5,000", duration: "30 min", category: "Casual", bookings: 3 },
    { id: "6", name: "Editorial Makeup", artist: "Sai Veeranna", price: "₹16,800", duration: "90 min", category: "Editorial", bookings: 4 },
    { id: "7", name: "Mehendi Design", artist: "Priya M.", price: "₹8,400", duration: "60 min", category: "Bridal", bookings: 7 },
];

const CATEGORIES = ["All", "Bridal", "Party", "Hair", "Casual", "Editorial"];

export default function ServicesScreen() {
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("All");

    const filtered = useMemo(() => {
        return SERVICES.filter((s) => {
            const q = search.toLowerCase();
            const matchSearch = !q || s.name.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q);
            const matchCat = catFilter === "All" || s.category === catFilter;
            return matchSearch && matchCat;
        });
    }, [search, catFilter]);

    return (
        <ScrollView className="flex-1 bg-dark-900" contentContainerStyle={{ padding: 20 }}>
            <View className="flex-row items-center gap-x-2 mb-4">
                <Text className="text-slate-500 text-xs">Admin</Text>
                <Ionicons name="chevron-forward" size={14} color="#64748b" />
                <Text className="text-slate-400 text-xs font-medium">Services</Text>
            </View>

            <SectionHeader title="Service Management" subtitle="Manage all makeup services offered"
                actionLabel="Add Service" onAction={() => toast.success("Opening Add Service form...")} />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-5" contentContainerStyle={{ paddingHorizontal: 20 }}>
                <KPICard title="Total Services" value={SERVICES.length}
                    icon={<Ionicons name="cut" size={18} color="#06b6d4" />} />
                <KPICard title="Total Bookings" value={SERVICES.reduce((s, x) => s + x.bookings, 0)}
                    icon={<Ionicons name="calendar" size={18} color="#3b82f6" />} />
                <KPICard title="Categories" value={new Set(SERVICES.map(s => s.category)).size}
                    icon={<Ionicons name="grid" size={18} color="#f59e0b" />} />
            </ScrollView>

            <SearchFilterBar searchValue={search} onSearchChange={setSearch}
                placeholder="Search services or artist..."
                statusOptions={CATEGORIES} selectedStatus={catFilter} onStatusChange={setCatFilter} />

            {filtered.map((service) => (
                <View key={service.id} className="bg-dark-700 rounded-2xl p-4 mb-3 border border-white/5">
                    <View className="flex-row items-center gap-x-3 mb-3">
                        <View className="w-11 h-11 rounded-xl bg-info/10 items-center justify-center">
                            <Ionicons name="cut" size={22} color="#06b6d4" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-sm font-semibold">{service.name}</Text>
                            <Text className="text-slate-500 text-xs mt-1">
                                <Ionicons name="brush-outline" size={12} color="#64748b" /> {service.artist}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-success text-base font-bold">{service.price}</Text>
                            <Text className="text-slate-500 text-[10px] mt-0.5">{service.duration}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center border-t border-white/5 pt-3 gap-x-3">
                        <View className="bg-accent/15 px-3 py-0.5 rounded-full border border-accent/20">
                            <Text className="text-accent text-[10px] font-semibold">{service.category}</Text>
                        </View>
                        <Text className="text-slate-500 text-xs flex-1">{service.bookings} bookings</Text>
                        <View className="flex-row gap-x-2">
                            <TouchableOpacity className="w-[34] h-[34] rounded-md bg-dark-800 items-center justify-center border border-white/5">
                                <Ionicons name="create-outline" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-[34] h-[34] rounded-md bg-danger/10 items-center justify-center border border-danger/20">
                                <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}

            <View className="h-10" />
        </ScrollView>
    );
}
