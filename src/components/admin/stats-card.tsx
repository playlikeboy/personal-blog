"use client";

import { Text, Title } from "rizzui";

interface StatsCardProps {
    title: string;
    value: number;
    icon: any;
    color: string;
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border flex items-center justify-between">
            <div>
                <Text className="text-gray-500 font-medium mb-1">{title}</Text>
                <Title as="h2" className="text-3xl font-bold">{value}</Title>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
