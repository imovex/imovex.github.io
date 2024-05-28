import React, { createContext, useContext, useState } from 'react';

const WorkingTimesContext = createContext();

export const WorkingTimesProvider = ({ children }) => {
  const initialWorkingTimes = {
    startTime: "08:00",
    breakStartTime: "12:00",
    breakEndTime: "13:00",
    endTime: "17:00"
  };
  const [workingTimes, setWorkingTimes] = useState(initialWorkingTimes);

  return (
    <WorkingTimesContext.Provider value={{ workingTimes, setWorkingTimes }}>
      {children}
    </WorkingTimesContext.Provider>
  );
};

export const useWorkingTimes = () => {
  return useContext(WorkingTimesContext);
};