import React, { useState, useMemo, Fragment } from 'react';
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts';
import classNames from 'classnames/bind';
import styles from './Chart.module.scss';

const cx = classNames.bind(styles);

const LineChart = ({ title, data, chartConfig, options, onFilterChange }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        first: options.first.defaultValue,
        second: options.second.defaultValue,
    });

    const [visibleLines, setVisibleLines] = useState(
        chartConfig.lines.reduce((acc, line) => {
            acc[line.dataKey] = true;
            return acc;
        }, {}),
    );

    const toggleLine = (dataKey) => {
        setVisibleLines((prev) => ({
            ...prev,
            [dataKey]: !prev[dataKey],
        }));
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = {
            ...selectedFilters,
            [filterType]: value,
        };
        setSelectedFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    // Lấy số ngày từ filter second
    const getDaysCount = () => {
        return parseInt(selectedFilters.second) || 10;
    };

    // Lọc dữ liệu theo số ngày
    const filteredData = useMemo(() => {
        const daysCount = getDaysCount();
        return data.slice(-daysCount);
    }, [data, selectedFilters.second]);

    // Tính toán domain cho Y axis (auto scale)
    const getYAxisDomain = () => {
        let allValues = [];

        // Chỉ lấy giá trị từ các đường đang hiển thị
        chartConfig.lines.forEach((line) => {
            if (visibleLines[line.dataKey]) {
                allValues = [...allValues, ...filteredData.map((d) => d[line.dataKey])];
            }
        });

        if (allValues.length === 0) {
            return { yMin: 0, yMax: 100 };
        }

        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);

        // Padding 20%
        const padding = (maxValue - minValue) * 0.2;
        const yMin = Math.max(0, Math.floor(minValue - padding));
        const yMax = Math.ceil(maxValue + padding);

        return { yMin, yMax };
    };

    const { yMin, yMax } = getYAxisDomain();

    return (
        <React.Fragment>
            <div className={cx('chart-header')}>
                <div className={cx('header-top')}>
                    <h2 className={cx('chart-title')}>{title}</h2>

                    {/* Dropdowns */}
                    <div className={cx('chart-options')}>
                        <select
                            className={cx('select')}
                            value={selectedFilters.first}
                            onChange={(e) => handleFilterChange('first', e.target.value)}
                        >
                            {options.first.items.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            className={cx('select')}
                            value={selectedFilters.second}
                            onChange={(e) => handleFilterChange('second', e.target.value)}
                        >
                            {options.second.items.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Checkboxes cho hiển thị đường */}
                <div className={cx('line-toggles')}>
                    {chartConfig.lines.map((line) => (
                        <label key={line.dataKey} className={cx('toggle-label')}>
                            <input
                                type="checkbox"
                                checked={visibleLines[line.dataKey]}
                                onChange={() => toggleLine(line.dataKey)}
                                className={cx('checkbox')}
                            />
                            <div className={cx('line-info')}>
                                <div className={cx('line-color')} style={{ backgroundColor: line.stroke }}></div>
                                <span className={cx('line-name')}>{line.name}</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <ResponsiveContainer width="100%" height={chartConfig.height || 350}>
                <ComposedChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        {chartConfig.lines.map((line) => (
                            <linearGradient key={line.dataKey} id={`color-${line.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={line.stroke} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={line.stroke} stopOpacity={0.05} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey={chartConfig.xAxisKey} tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} />
                    <YAxis tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} domain={[yMin, yMax]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px',
                        }}
                    />

                    {/* Areas */}
                    {chartConfig.lines.map((line) => (
                        <Area
                            key={`area-${line.dataKey}`}
                            type="monotone"
                            dataKey={line.dataKey}
                            fill={`url(#color-${line.dataKey})`}
                            stroke="none"
                            hide={!visibleLines[line.dataKey]}
                        />
                    ))}

                    {/* Lines */}
                    {chartConfig.lines.map((line) => (
                        <Line
                            key={`line-${line.dataKey}`}
                            type="monotone"
                            dataKey={line.dataKey}
                            stroke={line.stroke}
                            strokeWidth={line.strokeWidth || 3}
                            dot={{ fill: line.stroke, r: 4 }}
                            activeDot={{ r: 6 }}
                            name={line.name}
                            hide={!visibleLines[line.dataKey]}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default LineChart;
