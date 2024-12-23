import { useTheme } from "@mui/material";
import { DatePicker, Space } from "antd";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs type
// import styled from "styled-components";
import styled from "@mui/material/styles/styled";

const { RangePicker } = DatePicker;

type ValueDate<T> = {
    label: string;
    value: [T, T];
};

const rangePresets: ValueDate<Dayjs>[] = [
    {
        label: 'Last 7 Days',
        value: [dayjs().subtract(7, 'd'), dayjs()],
    },
    {
        label: 'Last 14 Days',
        value: [dayjs().subtract(14, 'd'), dayjs()],
    },
    {
        label: 'Last 30 Days',
        value: [dayjs().subtract(30, 'd'), dayjs()],
    },
    {
        label: 'Last 90 Days',
        value: [dayjs().subtract(90, 'd'), dayjs()],
    },
]

const DateRangePicker = ({ onRangeChange, fromDate, toDate , disabled }) => {
    const theme = useTheme();

    const StyledRangePicker = styled(RangePicker)`
    
        .ant-picker-active-bar {
            display: none; 
        }
        .ant-picker-input>input {
            font-size: 14px;
            color: ${theme.palette.mode === "light" ? "#000" : "#fff"}; 
        }
        .ant-picker-input input::placeholder {
            color: ${theme.palette.mode === "light" ? "#000" : "#fff"}; 
            opacity: 5; 
        }
        .ant-picker-suffix {
            font-size: 20px;
            color:  ${theme.palette.mode === "light" ? "#8A8A8A" : "#fff"}; 
        }
       
        &.ant-picker-disabled {
            background-color: ${theme.palette.mode === "light" ? "#f5f5f5" : "#303030"};
            border: none;
    
            .ant-picker-input input::placeholder {
            color: ${theme.palette.mode === "light" ? "#8A8A8A" : "#fff"};
            opacity: 0.5;
            }
            .ant-picker-suffix {
            color: ${theme.palette.mode === "light" ? "#c8c8c8" : "#ffffff40"};
            }
        }
     
        `;

    return (
        <Space direction="vertical" size={12}>
            <StyledRangePicker
               className="my-range"
                presets={rangePresets}
                onChange={onRangeChange}
                variant="filled"
                size="large"
                separator="-" 
                disabled={disabled}
                value={[
                    fromDate ? dayjs(fromDate) : null,
                    toDate ? dayjs(toDate) : null
                    
                ]}
                // maxDate={dayjs()}
                style={{
                    border: "1.5px solid #C4C6CF",
                    borderRadius: "5px",
                    fontFamily:"Inter , sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    width: "240px",
                    height: "40px",
                    backgroundColor: theme.palette.mode === "dark" ? "#595959" : "#fff",
                    color: theme.palette.mode === "light" ? "#000" : "#fff",
                }}
            />
        </Space>
    )
};
export default DateRangePicker;