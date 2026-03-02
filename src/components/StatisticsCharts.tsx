import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

// Color palette – harmonious HSL based colors
const COLORS = ['#8B5E3C', '#C49A6F'];

interface StatisticsChartsProps {
    genderCounts: Record<string, number>;
    cityCounts: Record<string, number>;
    ageGroups: Record<string, number>;
}

export function StatisticsCharts({ genderCounts, cityCounts, ageGroups }: StatisticsChartsProps) {
    // Transform objects into arrays suitable for Recharts
    const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));
    const cityData = Object.entries(cityCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // show top 10 cities
    const ageData = Object.entries(ageGroups).map(([range, value]) => ({ range, value }));

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Gender Pie Chart */}
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribuição por Gênero</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={genderData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {genderData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* City Bar Chart */}
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribuição por Cidades</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8B5E3C" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Age Bar Chart */}
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Distribuição por Faixa Etária</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#C49A6F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
