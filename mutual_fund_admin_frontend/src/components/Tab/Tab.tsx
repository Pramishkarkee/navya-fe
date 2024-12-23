import React, { useState } from "react";
import { Tabs, Tab, Box, useTheme } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabPanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabData {
  value: number;
  label: string;
  component: any;
  disabled?: boolean;
}

interface TabsProps {
  tabData: TabData[];
}

export default function BasicTabComponent({ tabData }: TabsProps) {
  const theme = useTheme();

  const firstEnabledTab =
    tabData.find((tab) => !tab.disabled)?.value ?? tabData[0].value;
  const [selectedTab, setSelectedTab] = useState(firstEnabledTab);

  // const enabledTab = tabData.find( tab => )
  // const [selectedTab, setSelectedTab] = useState(tabData[0].value);

  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    const tab = tabData.find((tab) => tab.value === newValue);
    if (!tab?.disabled) {
      setSelectedTab(newValue);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "max-content",
          borderBottom: 1,
          borderColor: "divider",
          mb: 1.5,
        }}
      >
        <Tabs
          aria-label="secondary-tab-menu"
          onChange={onChange}
          value={selectedTab}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        >
          {tabData.map((menu, index) => (
            <Tab
              key={index}
              label={menu.label}
              disabled={menu.disabled}
              {...a11yProps(index)}
              sx={{
                fontSize: "16px",
                fontWeight: "medium",
                lineHeight: "14px",
                textTransform: "none",
                px: 1,
                "&.Mui-selected": {
                  color: theme.palette.secondary.darkGrey,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
      {tabData.map((item, index) => (
        <CustomTabPanel key={index} value={selectedTab} index={index}>
          {item.component}
        </CustomTabPanel>
      ))}
    </>
  );
}
