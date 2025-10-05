import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { colors } from '@mui/material';
import { useState } from 'react';

import StatCard from '@/components/StatCard';
import { dataByMonth, dataByYear } from './data';
import { lineChartConfig, barChartConfig, monthFilterMap, quarterMap } from './chartConfigs';
import { LineChart, BarChart } from '@/components/Chart';

const cx = classNames.bind(styles);

const StatCards = [
    {
        title: 'Liên hệ hôm nay',
        value: 24,
        bonus: 'Tháng này: 56',
        icon: '👤',
        background: 'linear-gradient(135deg, #f192f7, #f55d79)',
    },
    {
        title: 'Lượt thích',
        value: 1234,
        bonus: '+12% so với tháng trước',
        icon: '❤️',
        background: 'linear-gradient(135deg, #4dafff, #05eeff)',
    },
    {
        title: 'Lượt xem',
        value: 45678,
        bonus: '+8% so với tuần trước',
        icon: '👀',
        background: 'linear-gradient(135deg, #42eb80, #37fad3)',
    },
    {
        title: 'Tổng bài viết',
        value: 892,
        bonus: '+5 bài mới hôm nay',
        icon: '📝',
        background: 'linear-gradient(135deg, #fa7594, #ffdc42)',
    },
];

function Dashboard() {
    const [lineChartFilters, setLineChartFilters] = useState({
        first: lineChartConfig.options.first.defaultValue,
        second: lineChartConfig.options.second.defaultValue,
    });

    const [barChartFilters, setBarChartFilters] = useState({
        first: barChartConfig.options.first.defaultValue,
        second: barChartConfig.options.second.defaultValue,
    });

    // Hàm lấy data cho line chart theo filter
    const getLineChartData = (filters) => {
        const monthKey = monthFilterMap[filters.first] || 'Tháng 12/2024';
        const monthData = dataByMonth[monthKey] || dataByMonth['Tháng 12/2024'];

        // Chuyển đổi key từ views/likes sang luotXem/luotThich
        return monthData.map((item) => ({
            date: item.date,
            luotXem: item.views,
            luotThich: item.likes,
        }));
    };

    // Hàm lấy data cho bar chart theo filter
    const getBarChartData = (filters) => {
        const yearData = dataByYear[filters.first] || dataByYear['2024'];

        // Chuyển đổi từ object sang array
        const allData = Object.entries(yearData).map(([month, views]) => ({
            month,
            views,
        }));

        // Lọc theo quý nếu cần
        if (filters.second === 'all') {
            return allData;
        }

        const months = quarterMap[filters.second];
        return allData.filter((item) => months.includes(item.month));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('stats-container')}>
                {StatCards.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        bonus={item.bonus}
                        icon={item.icon}
                        background={item.background}
                    />
                ))}
            </div>

            <div className={cx('chart-container')}>
                {/* Line Chart */}
                <LineChart
                    title={lineChartConfig.title}
                    data={getLineChartData(lineChartFilters)}
                    chartConfig={lineChartConfig.chartConfig}
                    options={lineChartConfig.options}
                    onFilterChange={setLineChartFilters}
                />

                {/* Bar Chart */}
                <BarChart
                    title={barChartConfig.title}
                    data={getBarChartData(barChartFilters)}
                    chartConfig={barChartConfig.chartConfig}
                    options={barChartConfig.options}
                    onFilterChange={setBarChartFilters}
                />
            </div>
        </div>
    );
}

export default Dashboard;
