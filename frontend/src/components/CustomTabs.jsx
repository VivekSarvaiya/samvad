import React from "react";
import { ConfigProvider, Tabs } from "antd"

const CustomTabs = ({
   itemSelectedColor = "#F7F7F7",
   itemHoverColor = "#F7F7F7",
   inkBarColor = "#F7F7F7",
   itemColor = "#AAAAAA",
   defaultActiveKey = "1",
   items,
   onChange,
   ...rest
}) => {
   return (
      <ConfigProvider
         theme={{
            components: {
               Tabs: {
                  itemSelectedColor,
                  itemHoverColor,
                  inkBarColor,
                  itemColor,
               },
            },
         }}
      >
         <Tabs defaultActiveKey={defaultActiveKey} items={items} onChange={onChange} {...rest} />
      </ConfigProvider>
   )
};

export default CustomTabs;
