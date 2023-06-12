import { Box, Tabs, Tab, Tooltip } from '@mui/material';
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { CourseContext } from '../../context/CourseContext';
import storage from '../../utils/storage';
import { Add, MoreHoriz } from '@mui/icons-material';
import { darkTheme, lightTheme } from '../../constants/theme';
import { TimetableData } from '../../interfaces/Periods';
import { v4 as uuidv4 } from 'uuid';
import { TabTheme, tabThemeDark, tabThemeLight, createTimetableStyle } from '../../styles/TimetableTabStyles';
import { EditTabPopups } from './EditTabPopups';

const TimetableTabs: React.FC = () => {
  const TIMETABLE_LIMIT = 13;

  const {
    isDarkMode,
    selectedTimetable,
    setSelectedTimetable,
    displayTimetables,
    setDisplayTimetables,
    setAlertMsg,
    setErrorVisibility,
    setAnchorElement,
    setAnchorCoords,
  } = useContext(AppContext);

  const { setSelectedCourses, setSelectedClasses, setCreatedEvents } = useContext(CourseContext);

  const isMacOS = navigator.userAgent.indexOf('Mac') != -1;

  let addTimetabletip = isMacOS ? 'New Tab (Cmd+Enter)' : 'New Tab (Ctrl+Enter)';

  const theme = isDarkMode ? darkTheme : lightTheme;

  const [tabTheme, setTabTheme] = useState<TabTheme>(isDarkMode ? tabThemeDark : tabThemeLight);
  const dragTab = React.useRef<any>(null);
  const dragOverTab = React.useRef<any>(null);

  const { AddIconStyle, TabContainerStyle, TabStyle } = createTimetableStyle(tabTheme, theme);

  useEffect(() => {
    setTabTheme(isDarkMode ? tabThemeDark : tabThemeLight);
  }, [isDarkMode]);


  /**
   * Timetable handlers
   */
  // Creates new timetable
  const handleCreateTimetable = () => {
    // Limiting users to have a maximum of 13 timetables
    if (displayTimetables.length >= TIMETABLE_LIMIT) {
      setAlertMsg('Maximum timetables reached');
      setErrorVisibility(true);
    } else {
      const nextIndex = displayTimetables.length;

      const newTimetable: TimetableData = {
        name: 'New Timetable',
        id: uuidv4(),
        selectedCourses: [],
        selectedClasses: {},
        createdEvents: {},
      };
      storage.set('timetables', [...displayTimetables, newTimetable]);

      setDisplayTimetables([...displayTimetables, newTimetable]);

      // Should switch current timetable to the new timetable
      setSelectedTimetable(nextIndex);
      // Clearing the selected courses, classes and created events for the new timetable
      setSelectedCourses([]);
      setSelectedClasses({});
      setCreatedEvents({});
    }
  };

  // Fetching the saved timetables from local storage
  useEffect(() => {
    const savedTimetables = storage.get('timetables');
    // checking if a save exists and if so update the timetables to display.
    if (savedTimetables) {
      setDisplayTimetables(savedTimetables);
    }
  }, []);

  /**
  * Drag and drop functions for rearranging timetable tabs
  */
  // Handles timetable switching by updating the selected courses, classes and events to the new timetable
  const handleSwitchTimetables = (timetableIndex: number) => {
    setSelectedCourses(displayTimetables[timetableIndex].selectedCourses);
    setSelectedClasses(displayTimetables[timetableIndex].selectedClasses);
    setCreatedEvents(displayTimetables[timetableIndex].createdEvents);
    setSelectedTimetable(timetableIndex);
  };

  // Reordering the tabs when they are dragged and dropped
  const handleSortTabs = () => {
    const newTimetables = [...displayTimetables];
    const draggedItem = newTimetables[dragTab.current];
    newTimetables.splice(dragTab.current, 1);
    newTimetables.splice(dragOverTab.current, 0, draggedItem);
    setDisplayTimetables(newTimetables);
    setSelectedTimetable(dragOverTab.current);
    dragTab.current = dragOverTab.current;
  };

  // Handle drag start (triggers whenever a tab is clicked)
  const handleTabDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragTab.current = index;
    handleSwitchTimetables(dragTab.current);
  };

  // Handle drag enter (triggers whenever the user drags over another tab)
  const handleTabDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverTab.current = index;
    handleSortTabs();
  };

  /**
   * Dropdown menu tab handlers
   */
  // Left click handler for the three dots icon (editing the timetable tab)
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  // Right clicking a tab will switch to that tab and open the menu
  const handleRightTabClick = (event: React.MouseEvent, index: number) => {
    event.preventDefault();
    handleSwitchTimetables(index);

    // Anchoring the menu to the mouse position
    setAnchorCoords({ x: event.clientX, y: event.clientY });
  };

  return (
    <Box sx={{ paddingTop: '10px', overflow: 'auto' }}>
      <Tabs
        value={selectedTimetable}
        sx={TabContainerStyle}
        TabIndicatorProps={{ style: { display: 'none' } }}
        variant="scrollable"
      >
        {displayTimetables.map((timetable: TimetableData, index: number) => (
          <Tab
            key={index}
            label={timetable.name}
            sx={TabStyle(index)}
            onClick={() => handleSwitchTimetables(index)}
            onContextMenu={(e) => handleRightTabClick(e, index)}
            icon={
              selectedTimetable === index ? (
                <span onClick={handleMenuClick}>
                  <MoreHoriz />
                </span>
              ) : (
                <></>
              )
            }
            iconPosition="end"
            draggable={true}
            onDragStart={(e) => handleTabDragStart(e, index)}
            onDragEnter={(e) => handleTabDragEnter(e, index)}
            onDragEnd={handleSortTabs}
            onDragOver={(e) => e.preventDefault()}
          />
        ))}
        <Tooltip title={addTimetabletip}>
          <Tab id="create-timetables-button" icon={<Add />} onClick={handleCreateTimetable} sx={AddIconStyle} />
        </Tooltip>
      </Tabs>
      <EditTabPopups />
    </Box>
  );
};
export { TimetableTabs };