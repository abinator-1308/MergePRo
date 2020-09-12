import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import { Row } from "./design/Row";
import { Settings } from "./Settings";
import { CoreProps } from "../interface";
import { REALTIME_UPDATE_INTERVAL } from "../constants";
import { StyledAppBar } from "./AppBar";
 
export const Popup = observer((props: CoreProps) => {
 useEffect(() => {
   const interval = setInterval(() => {
     props.core.triggerBackgroundRefresh();
   }, REALTIME_UPDATE_INTERVAL);
   return () => clearInterval(interval);
 }, []);
 
 return (
   <>
     <Row>
       <StyledAppBar core={props.core} />
     </Row>            
     <Settings core={props.core} />
   </>
 );
});
